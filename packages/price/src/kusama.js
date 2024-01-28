const dotenv = require("dotenv");
dotenv.config();

const { loopQueryAndSave } = require("./tick");

loopQueryAndSave("KSM").then(() => console.log(`KSM price updated`));
