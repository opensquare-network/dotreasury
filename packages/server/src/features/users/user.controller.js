const { randomBytes } = require("crypto");
const { getUserCollection } = require("../../mongo-admin");
const { HttpError } = require("../../exc");

class UserController {
  async linkAddressStart(ctx) {
    ctx.body = {};
  }

  async linkAddressConfirm(ctx) {
    ctx.body = {};
  }
}

module.exports = new UserController();
