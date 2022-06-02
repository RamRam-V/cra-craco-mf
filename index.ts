#! /usr/bin/env node

import inquirer from "inquirer";

import util from "util";
import fs from "fs";
import path from "path";

(async function () {
    const ncp = util.promisify(require("ncp").ncp);

    const answers = await inquirer.prompt([
        {
            type: "input",
            message: "enter destination folder:",
            name: "dir",
            default: "./",
        },
        {
            type: "input",
            message: "Pick the name of your app:",
            name: "name",
            default: "host",
        },
        {
            type: "input",
            message: "Port number:",
            name: "port",
            default: "8080",
        },
    ]);

    let { dir, name, port } = answers;

    if (dir.length - 1 !== dir.lastIndexOf("/")) {
        // dir = dir.split("/");
        // dir.pop();
        // dir = dir.join("/");
        dir = dir + "/" + name;
    } else {
        dir = dir + name;
    }
    

    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });

    await ncp(path.join(__dirname, `./template/`), dir);

    //SET package.json
    let fileContent = fs
        .readFileSync(dir + "/package.json", "utf8")
        .toString();
    let template = fileContent.replace(
        new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"),
        '"' + name + '"'
    );
    fs.writeFileSync(dir + "/package.json", template);

    //SET .cracorc.js
    fileContent = fs.readFileSync(dir + "/.cracorc.js", "utf8").toString();
    template = fileContent.replace(
        new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"),
        '"' + name + '"'
    );
    template = template.replace(
        new RegExp(`(\{\{PORT\}\}|\{\{ PORT \}\})`, "g"),
        port
    );

    fs.writeFileSync(dir + "/.cracorc.js", template);
})();
