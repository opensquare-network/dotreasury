const { randomBytes } = require("crypto");
const { getUserCollection } = require("../../mongo-admin");
const { HttpError } = require("../../exc");
const { isValidSignature } = require("../../utils");

class UserController {
  async linkAddressStart(ctx) {
    const { address } = ctx.params;
    const user = ctx.request.user;

    if (!user.addresses) {
      user.addresses = [];
    }

    let addrItem;
    for (const item of user.addresses) {
      if (item.address === address) {
        if (item.verified) {
          throw new HttpError(
            400,
            "The address is already linked with this account."
          );
        }

        addrItem = item;
        break;
      }
    }

    if (!addrItem) {
      const challenge = randomBytes(12).toString("hex");
      addrItem = {
        address,
        challenge,
        verified: false,
      };

      const userCol = await getUserCollection();
      const result = await userCol.updateOne(
        { _id: user._id },
        {
          $push: {
            addresses: addrItem,
          },
        }
      );
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

    console.log(ctx.request.body);
    console.log(challengeAnswer);

    if (!challengeAnswer) {
      throw new HttpError(400, "Challenge answer is not provided.");
    }

    let addrItem;
    for (const item of user.addresses || []) {
      if (item.address === address && item.verified === false) {
        addrItem = item;
        break;
      }
    }

    if (!addrItem) {
      throw new HttpError(404, "The linking address is not found");
    }

    const success = isValidSignature(
      addrItem.challenge,
      challengeAnswer,
      addrItem.address
    );
    if (!success) {
      ctx.body = false;
      return;
    }

    const userCol = await getUserCollection();
    const existing = await userCol.findOne({
      addresses: {
        $elemMatch: {
          address,
          verified: true,
        },
      },
    });

    if (existing) {
      throw new HttpError(
        400,
        "The address is already linked with one account."
      );
    }

    const result = await userCol.updateOne(
      {
        _id: user._id,
        addresses: {
          $elemMatch: {
            address,
            verified: false,
          },
        },
      },
      {
        $set: {
          "addresses.$.verified": true,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error: save address.");
    }

    if (!result.result.nModified === 0) {
      throw new HttpError(500, "Address is not updated.");
    }

    ctx.body = true;
  }

  async unlinkAddress(ctx) {
    const { address } = ctx.params;
    const user = ctx.request.user;

    console.log(address);

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $pull: {
          addresses: {
            address,
            verified: true,
          },
        },
      }
    );

    console.log(result);

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.result.nModified === 0) {
      ctx.body = false;
      return;
    }

    ctx.body = true;
  }

  async getUserProfile(ctx) {
    const user = ctx.request.user;

    ctx.body = {
      username: user.username,
      email: user.email,
      addresses: user.addresses
        ?.filter((addr) => addr.verified)
        .map((addr) => addr.address),
    };
  }
}

module.exports = new UserController();
