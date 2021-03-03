const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const http = require("http");
const cors = require("@koa/cors");
const config = require("../config");
const { initDb } = require("./mongo");
const { listenAndEmitInfo } = require("./websocket");

require("dotenv").config();

const app = new Koa();

app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(helmet());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
      data: err.data,
    };
  }
});

require("./routes")(app);
const server = http.createServer(app.callback());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initDb()
  .then(async (db) => {
    await listenAndEmitInfo(io);

    app.context.db = db;
    const port = config.server.port || 3213;

    server.listen(port, () =>
      console.log(`✅  The server is running at http://localhost:${port}/`)
    );
  })
  .catch((err) => {
    console.error("Failed to init db for scan server");
    console.error(err);
    process.exit(1);
  });
