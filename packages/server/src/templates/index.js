const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const pluralize = require("pluralize");
const { stringCamelCase } = require("@polkadot/util");

Handlebars.registerHelper("pluralize", pluralize);
Handlebars.registerHelper("isdefined", (v) => v !== undefined);
Handlebars.registerHelper('eq', function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.every(expression => args[0] == expression);
});

const templates = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith(".hbs"))
  .map((f) => ({
    name: stringCamelCase(f.slice(0, f.lastIndexOf("."))),
    template: Handlebars.compile(
      fs.readFileSync(path.join(__dirname, f), { encoding: "utf8" })
    ),
  }))
  .reduce((d, t) => {
    d[t.name] = t.template;
    return d;
  }, {});

module.exports = templates;
