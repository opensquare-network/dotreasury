const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const templates = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith(".hbs"))
  .map((f) => ({
    name: f.slice(0, f.lastIndexOf(".")),
    template: Handlebars.compile(
      fs.readFileSync(path.join(__dirname, f), { encoding: "utf8" })
    ),
  }))
  .reduce((d, t) => {
    d[t.name] = t.template;
    return d;
  }, {});

module.exports = templates;
