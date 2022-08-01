const { ObjectId } = require("mongodb");
const { randomBytes } = require("crypto");
const argon2 = require("argon2");
const validator = require("validator");
const {
  getUserCollection,
  getAttemptCollection,
} = require("../../mongo-admin");
const { HttpError } = require("../../exc");
const { isValidSignature, validateAddress } = require("../../utils");
const { DefaultUserNotification } = require("../../contants");
const mailService = require("../../services/mail.service");

class UserController {
  async linkAddressStart(ctx) {
    const { chain, address } = ctx.params;
    const user = ctx.request.user;

    validateAddress(address, chain);

    const attemptCol = await getAttemptCollection();
    const attempt = {
      type: "linkAddress",
      userId: user._id,
      address,
      chain,
      challenge: randomBytes(12).toString("hex"),
      createdAt: new Date(),
    };
    const result = await attemptCol.insertOne(attempt);

    if (!result.acknowledged) {
      throw new HttpError(500, "Db error: link address start.");
    }

    ctx.body = {
      attemptId: result.insertedId,
      challenge: attempt.challenge,
    };
  }

  async linkAddressConfirm(ctx) {
    const { attemptId } = ctx.params;
    const { challengeAnswer } = ctx.request.body;
    const user = ctx.request.user;

    const attemptCol = await getAttemptCollection();
    const attempt = await attemptCol.findOne({
      _id: ObjectId(attemptId),
      type: "linkAddress",
      userId: user._id,
    });

    if (!attempt) {
      throw new HttpError(400, "Incorrect link address attempt id");
    }

    const { chain, address, userId, challenge } = attempt;

    const addressName = `${chain}Address`;

    if (!challengeAnswer) {
      throw new HttpError(400, {
        challengeAnswer: ["Challenge answer is not provided."],
      });
    }

    const success = await isValidSignature(challenge, challengeAnswer, address);
    if (!success) {
      throw new HttpError(400, {
        challengeAnswer: ["Incorrect challenge answer."],
      });
    }

    if (user[addressName] === address) {
      throw new HttpError(400, {
        address: ["The address is already linked with this account."],
      });
    }

    if (user[addressName]) {
      throw new HttpError(
        400,
        `Only 1 ${chain} address is allow to be linked.`
      );
    }

    const userCol = await getUserCollection();
    const existing = await userCol.findOne({
      [addressName]: address,
      _id: { $ne: userId },
    });
    if (existing) {
      throw new HttpError(400, {
        address: ["The address is already used by another account."],
      });
    }

    const result = await userCol.updateOne(
      { _id: userId },
      {
        $set: {
          [addressName]: address,
        },
      }
    );

    if (!result.acknowledged) {
      throw new HttpError(500, "Db error: save address.");
    }

    ctx.body = true;
  }

  async unlinkAddress(ctx) {
    const { chain, address } = ctx.params;
    const user = ctx.request.user;

    validateAddress(address, chain);

    const addressName = `${chain}Address`;

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $unset: { [addressName]: true },
      }
    );

    if (!result.acknowledged) {
      throw new HttpError(500, "Db error, unlink address.");
    }

    if (result.modifiedCount === 0) {
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

    if (!result.acknowledged) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.modifiedCount === 0) {
      throw new HttpError(500, "The notification is not updated.");
    }

    ctx.body = true;
  }

  async getUserProfile(ctx) {
    const user = ctx.request.user;

    ctx.body = {
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      addresses: ["kusama", "polkadot"].reduce((addresses, chain) => {
        const address = user[`${chain}Address`];
        if (address) {
          addresses.push({
            chain,
            address,
          });
        }
        return addresses;
      }, []),
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

    if (!result.acknowledged) {
      throw new HttpError(500, "DB error: change password.");
    }

    if (result.modifiedCount === 0) {
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
      throw new HttpError(400, { newEmail: ["Invalid email"] });
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

    if (!result.acknowledged) {
      throw new HttpError(500, "DB error: change email.");
    }

    if (result.modifiedCount === 0) {
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

    const userCol = await getUserCollection();
    const result = await userCol.deleteOne({ _id: user._id });

    if (!result.acknowledged) {
      throw new HttpError(500, "DB error: delete account.");
    }

    if (result.deletedCount === 0) {
      throw new HttpError(500, "Failed to delete account.");
    }

    ctx.body = true;
  }

  async resendVerifyEmail(ctx) {
    const user = ctx.request.user;

    if (user.emailVerified) {
      throw new HttpError(400, "Email is already verified.");
    }

    const isSent = await mailService.sendVerificationEmail({
      username: user.username,
      email: user.email,
      token: user.verifyToken,
    });

    if (!isSent) {
      throw new HttpError(500, "Fail to send verification email");
    }

    ctx.body = true;
  }
}

module.exports = new UserController();
