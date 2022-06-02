import inquirer from "inquirer";

import util from "util";
import fs from "fs";
import path from "path";

(async function () {
    const ncp = util.promisify(require("ncp").ncp);

    const answers = await inquirer.prompt([
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


    console.log(answers);
    const { name, port } = answers;
    await ncp(path.join(__dirname, `./template/`), name);

    //SET package.json
    let fileContent = fs
        .readFileSync(name + "/package.json", "utf8")
        .toString();
        let template = fileContent.replace(
        new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"),
        '"' + name + '"'
    );
    fs.writeFileSync(name + "/package.json", template);

    //SET .cracorc.js
    fileContent = fs
        .readFileSync(name + "/.cracorc.js", "utf8")
        .toString();
    template = fileContent.replace(
        new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"),
        '"' + name + '"'
    );
    template = template.replace(
        new RegExp(`(\{\{PORT\}\}|\{\{ PORT \}\})`, "g"),
        port
    );

    fs.writeFileSync(name + "/.cracorc.js", template);
})();
