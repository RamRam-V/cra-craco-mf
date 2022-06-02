#! /usr/bin/env node
"use strict";

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.regexp.constructor.js");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async function () {
  const ncp = _util.default.promisify(require("ncp").ncp);

  const answers = await _inquirer.default.prompt([{
    type: "input",
    message: "Pick the name of your app:",
    name: "name",
    default: "host"
  }, {
    type: "input",
    message: "Port number:",
    name: "port",
    default: "8080"
  }]);
  console.log(answers);
  const {
    name,
    port
  } = answers;
  await ncp(_path.default.join(__dirname, "./template/"), name); //SET package.json

  let fileContent = _fs.default.readFileSync(name + "/package.json", "utf8").toString();

  let template = fileContent.replace(new RegExp("({{PROJECT_NAME}}|{{ PROJECT_NAME }})", "g"), '"' + name + '"');

  _fs.default.writeFileSync(name + "/package.json", template); //SET .cracorc.js


  fileContent = _fs.default.readFileSync(name + "/.cracorc.js", "utf8").toString();
  template = fileContent.replace(new RegExp("({{PROJECT_NAME}}|{{ PROJECT_NAME }})", "g"), '"' + name + '"');
  template = template.replace(new RegExp("({{PORT}}|{{ PORT }})", "g"), port);

  _fs.default.writeFileSync(name + "/.cracorc.js", template);
})();