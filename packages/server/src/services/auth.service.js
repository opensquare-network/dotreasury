const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { getUserCollection } = require("../mongo-admin");
const { HttpError } = require("../exc");

class AuthService {
  async validate(accessToken) {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new HttpError(501, "Unauthorized");
    }

    const userCol = await getUserCollection();
    const user = await userCol.findOne({ _id: ObjectId(decoded.id) });
    if (!user) {
      throw new HttpError(500, "Current user is not exists");
    }

    return user;
  }

  getSignedToken(user) {
    const content = {
      id: user._id,
			email: user.email,
			username: user.username,
			iat: Math.floor(Date.now() / 1000),
		};

		return jwt.sign(
			content,
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '1h' }
		);
  }
}

module.exports = new AuthService;
