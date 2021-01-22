const { ObjectId } = require("mongodb");
const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const validator = require('validator');
const authService = require("../../services/auth.service");
const { getUserCollection, getLoginAttemptCollection } = require("../../mongo-admin");
const { HttpError } = require("../../exc");
const { isValidSignature } = require("../../utils");

class AuthController {
  async signup(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!username) {
      throw new HttpError(400, "Username is missing");
    }

    if (!email) {
      throw new HttpError(400, "Email is missing");
    }

    if (!password) {
      throw new HttpError(400, "Password is missing");
    }

    if (!username.match(/^[a-z][a-z0-9_]{2,15}$/)) {
      throw new HttpError(400, "Invalid username. It should start with alpha, and only contains alpha, numeric and underscore. The length must between 3 to 16");
    }

    if (!validator.isEmail(email)) {
      throw new HttpError(400, "Invaild email");
    }

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
    const accessToken = await authService.getSignedToken(insertedUser);
    const refreshToken = await authService.getRefreshToken(insertedUser);

    ctx.body = {
      username: insertedUser.username,
      email: insertedUser.email,
      accessToken,
      refreshToken,
    };
  }

  async login(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!email && !username) {
      throw new HttpError(400, "Email or username must be provided");
    }

    if (!password) {
      throw new HttpError(400, "Password is missing");
    }

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

    const accessToken = await authService.getSignedToken(user);
    const refreshToken = await authService.getRefreshToken(user);

    ctx.body = {
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
    }
  }

  async refresh(ctx) {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      throw new HttpError(400, "Refresh token is missing");
    }

    const accessToken = await authService.refresh(refreshToken);
    ctx.body = {
      accessToken
    };
  }

  async addressLoginStart(ctx) {
    const { address } = ctx.params;

    const userCol = await getUserCollection();
    const user = await userCol.findOne({
      addresses: {
        $elemMatch: {
          address,
          verified: true,
        }
      }
    });

    if (!user) {
      throw new HttpError(400, "The address is not linked to any account.");
    }

    const loginAttemptCol = await getLoginAttemptCollection();
    const result = await loginAttemptCol.insertOne({
      userId: user._id,
      address,
      challenge: randomBytes(12).toString('hex'),
      createdAt: new Date(),
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Db error: start address login.");
    }

    const loginAttempt = result.ops[0];

    ctx.body = {
      attemptId: loginAttempt._id,
      challenge: loginAttempt.challenge,
    }
  }

  async addressLoginConfirm(ctx) {
    const { attemptId } = ctx.params;
    const { challengeAnswer } = ctx.request.body;

    if (!challengeAnswer) {
      throw new HttpError(400, "Challenge answer is not provided.");
    }

    const loginAttemptCol = await getLoginAttemptCollection();
    const loginAttempt = await loginAttemptCol.findOne({ _id: ObjectId(attemptId) });
    if (!loginAttempt) {
      throw new HttpError(400, "Incorrect login attempt id");
    }

    const success = isValidSignature(loginAttempt.challenge, challengeAnswer, loginAttempt.address);
    if (!success) {
      throw new HttpError(401, "Incorrect signature.");
    }

    const userCol = await getUserCollection();
    const user = await userCol.findOne({ _id: loginAttempt.userId });
    if (!user) {
      throw new HttpError(500, "Account has been deleted.");
    }

    const accessToken = await authService.getSignedToken(user);
    const refreshToken = await authService.getRefreshToken(user);

    ctx.body = {
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
    }
  }
}

module.exports = new AuthController();
