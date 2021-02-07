const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { getUserCollection } = require("../mongo-admin");
const { HttpError } = require("../exc");

class AuthService {
  async validate(accessToken) {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    } catch (e) {
      throw new HttpError(401, e.message);
    }

    const userCol = await getUserCollection();
    const user = await userCol.findOne({ _id: ObjectId(decoded.id) });
    if (!user) {
      throw new HttpError(500, "Current user is not exists");
    }

    return user;
  }

  async getSignedToken(user) {
    const content = {
      id: user._id,
      email: user.email,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(content, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  }

  async getRefreshToken(user) {
    const randHex = randomBytes(12).toString("hex");
    const token = `${user._id}-${randHex}`;
    const valid = true;

    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + oneMonth);

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: {
            expires,
            token,
            valid,
          },
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Error in generating refresh token");
    }

    return token;
  }

  async refresh(refreshToken) {
    const userCol = await getUserCollection();
    const user = await userCol.findOne({ "refreshToken.token": refreshToken });

    if (!user) {
      throw new HttpError(400, "Invaild refresh token");
    }

    if (!user.refreshToken.valid) {
      throw new HttpError(401, "Refresh token revoked");
    }

    if (user.refreshToken.expires.getTime() < Date.now()) {
      throw new HttpError(401, "The refresh token has expired.");
    }

    return this.getSignedToken(user);
  }
}

module.exports = new AuthService();
