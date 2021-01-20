const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const authService = require("../../services/auth.service");
const { getUserCollection } = require("../../mongo-admin");
const { HttpError } = require("../../exc");

class AuthController {
  async signup(ctx) {
    const { username, email, password } = ctx.request.body;

    const userCol = await getUserCollection();

    let existing = await userCol.findOne({ email });
    if (existing) {
      throw new HttpError(403, "Email already exists.");
    }

    existing = await userCol.findOne({ username });
    if (existing) {
      throw new HttpError(403, "Username already exists.");
    }

    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(password, { salt });

    const hexSalt = salt.toString('hex');

    const result = await userCol.insertOne({
      username,
      email,
      hashedPassword,
      salt: hexSalt,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Signup error, cannot create user.");
    }

    const insertedUser = result.ops[0];
    const accessToken = authService.getSignedToken(insertedUser);
    ctx.body = {
      accessToken,
    };
  }

  async login(ctx) {
    const { username, email, password } = ctx.request.body;

    const userCol = await getUserCollection();

    const user = await userCol.findOne({
      $or: [
        { email },
        { username },
      ]
    });

    if (!user) {
      throw new HttpError(404, "User does not exists.");
    }

    const correct = await argon2.verify(user.hashedPassword, password);
    if (!correct) {
      throw new HttpError(401, "Incorrect password.");
    }

    const accessToken = authService.getSignedToken(user);

    ctx.body = {
      accessToken,
    }
  }

}

module.exports = new AuthController();
