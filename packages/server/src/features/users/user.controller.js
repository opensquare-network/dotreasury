const { randomBytes } = require("crypto");
const argon2 = require("argon2");
const {
  getUserCollection,
  getAddressCollection,
} = require("../../mongo-admin");
const { HttpError } = require("../../exc");
const { isValidSignature } = require("../../utils");
const { DefaultUserNotification } = require("../../contants");
const mailService = require("../../services/mail.service");
const validator = require("validator");

class UserController {
  async linkAddressStart(ctx) {
    const { address } = ctx.params;
    const user = ctx.request.user;

    const addressCol = await getAddressCollection();
    const addresses = await addressCol
      .find({ userId: user._id, address })
      .toArray();

    let addrItem = addresses[0];

    if (addrItem?.verified) {
      throw new HttpError(400, {
        address: ["The address is already linked with this account."],
      });
    }

    if (!addrItem) {
      const challenge = randomBytes(12).toString("hex");
      addrItem = {
        userId: user._id,
        address,
        challenge,
        verified: false,
      };

      const result = await addressCol.insertOne(addrItem);
      if (!result.result.ok) {
        throw new HttpError(500, "Db error: save address.");
      }
    }

    ctx.body = {
      challenge: addrItem.challenge,
    };
  }

  async linkAddressConfirm(ctx) {
    const { address } = ctx.params;
    const { challengeAnswer } = ctx.request.body;
    const user = ctx.request.user;

    if (!challengeAnswer) {
      throw new HttpError(400, {
        challengeAnswer: ["Challenge answer is not provided."],
      });
    }

    const addressCol = await getAddressCollection();
    const addresses = await addressCol
      .find({ userId: user._id, address, verified: false })
      .toArray();

    const addrItem = addresses[0];

    if (!addrItem) {
      throw new HttpError(404, {
        address: ["The linking address is not found"],
      });
    }

    const success = isValidSignature(
      addrItem.challenge,
      challengeAnswer,
      addrItem.address
    );
    if (!success) {
      throw new HttpError(400, "Invalid signature.");
    }

    const existing = await addressCol.findOne({ address, verified: true });
    if (existing) {
      throw new HttpError(400, {
        address: ["The address is already linked with existing account."],
      });
    }

    const result = await addressCol.updateOne(
      {
        userId: user._id,
        address,
        verified: false,
      },
      {
        $set: {
          verified: true,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error: save address.");
    }

    if (!result.result.nModified === 0) {
      throw new HttpError(500, "Address is not linked.");
    }

    ctx.body = true;
  }

  async unlinkAddress(ctx) {
    const { address } = ctx.params;
    const user = ctx.request.user;

    const addressCol = await getAddressCollection();
    const result = await addressCol.deleteOne({
      userId: user._id,
      address,
      verified: true,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, unlink address.");
    }

    if (result.result.n === 0) {
      throw new HttpError(500, "Failed to unlink address.");
    }

    ctx.body = true;
  }

  async setUserNotification(ctx) {
    const { participated, mentioned } = ctx.request.body;
    const user = ctx.request.user;

    const notification = Object.assign(
      { ...DefaultUserNotification },
      mentioned !== undefined && { mentioned },
      participated !== undefined && { participated }
    );

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          notification,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.result.nModified === 0) {
      throw new HttpError(500, "The notification is not updated.");
    }

    ctx.body = true;
  }

  async getUserProfile(ctx) {
    const user = ctx.request.user;

    const addressCol = await getAddressCollection();
    const addresses = await addressCol
      .find({ userId: user._id, verified: true })
      .toArray();

    ctx.body = {
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      addresses: addresses.map((addr) => addr.address),
      notification: { ...DefaultUserNotification, ...user.notification },
    };
  }

  async changePassword(ctx) {
    const { oldPassword, newPassword } = ctx.request.body;
    const user = ctx.request.user;

    if (!oldPassword) {
      throw new HttpError(400, {
        oldPassword: ["Old password must be provided."],
      });
    }

    if (!newPassword) {
      throw new HttpError(400, {
        newPassword: ["New password must be provided."],
      });
    }

    if (newPassword === oldPassword) {
      throw new HttpError(400, {
        newPassword: ["The new password must be different from the old one."],
      });
    }

    const correct = await argon2.verify(user.hashedPassword, oldPassword);
    if (!correct) {
      throw new HttpError(401, { oldPassword: ["Incorrect old password."] });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          hashedPassword,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: change password.");
    }

    if (result.result.nModified === 0) {
      throw new HttpError(500, "Failed to change password.");
    }

    ctx.body = true;
  }

  async changeEmail(ctx) {
    const { password, newEmail } = ctx.request.body;
    const user = ctx.request.user;

    if (!password) {
      throw new HttpError(400, { password: ["Password must be provided."] });
    }

    if (newEmail === user.email) {
      throw new HttpError(400, {
        newEmail: ["The new email address must be different from the old one."],
      });
    }

    if (!validator.isEmail(newEmail)) {
      throw new HttpError(400, { newEmail: ["Invaild email"] });
    }

    const correct = await argon2.verify(user.hashedPassword, password);
    if (!correct) {
      throw new HttpError(401, { password: ["Incorrect password."] });
    }

    const userCol = await getUserCollection();

    const existing = await userCol.findOne({ email: newEmail });
    if (existing) {
      throw new HttpError(409, {
        newEmail: ["The email address has been used by another account."],
      });
    }

    const verifyToken = randomBytes(12).toString("hex");
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          email: newEmail,
          emailVerified: false,
          verifyToken,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: change email.");
    }

    if (result.result.nModified === 0) {
      throw new HttpError(500, "Failed to change email.");
    }

    mailService.sendVerificationEmail({
      username: user.username,
      email: newEmail,
      token: verifyToken,
    });

    ctx.body = true;
  }

  async deleteAccount(ctx) {
    const { password } = ctx.request.body;
    const user = ctx.request.user;

    if (!password) {
      throw new HttpError(400, { password: ["Password must be provided."] });
    }

    const correct = await argon2.verify(user.hashedPassword, password);
    if (!correct) {
      throw new HttpError(401, { password: ["Incorrect password."] });
    }

    const addressCol = await getAddressCollection();
    let result = await addressCol.deleteMany({ userId: user._id });

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: clean linked addresses.");
    }

    const userCol = await getUserCollection();
    result = await userCol.deleteOne({ _id: user._id });

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: delete account.");
    }

    if (result.result.n === 0) {
      throw new HttpError(500, "Failed to delete account.");
    }

    ctx.body = true;
  }

  async resendVerifyEmail(ctx) {
    const user = ctx.request.user;

    if (user.emailVerified) {
      throw new HttpError(400, "Email is already verified.");
    }

    mailService.sendVerificationEmail({
      username: user.username,
      email: user.email,
      token: user.verifyToken,
    });

    ctx.body = true;
  }
}

module.exports = new UserController();
