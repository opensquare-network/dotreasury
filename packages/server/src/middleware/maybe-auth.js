const authService = require("../services/auth.service");
const { HttpError } = require("../exc");

async function maybeAuth(ctx, next) {
  const authorization = ctx.request.headers.authorization;
  if (authorization) {
    const match = authorization.match(/^Bearer (.*)$/);
    if (!match) {
      throw new HttpError(400, "Incorrect authorization header.");
    }
    const [, token] = match;

    const user = await authService.validate(token);
    ctx.request.user = user;
  }

  await next();
}

module.exports = maybeAuth;
