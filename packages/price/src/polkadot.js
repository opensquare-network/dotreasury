const dotenv = require("dotenv");
dotenv.config();

const { loopQueryAndSave } = require("./tick");

loopQueryAndSave("DOT").then(() => console.log(`KSM price updated`));
