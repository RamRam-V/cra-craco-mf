#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const ncp = util_1.default.promisify(require("ncp").ncp);
        const answers = yield inquirer_1.default.prompt([
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
        }
        else {
            dir = dir + name;
        }
        console.log(dir);
        console.log(path_1.default.join(__dirname, dir));
        fs_1.default.mkdirSync(dir, { recursive: true });
        yield ncp(path_1.default.join(__dirname, `./template/`), dir);
        //SET package.json
        let fileContent = fs_1.default.readFileSync(dir + "/package.json", "utf8").toString();
        let template = fileContent.replace(new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"), '"' + name + '"');
        fs_1.default.writeFileSync(dir + "/package.json", template);
        //SET .cracorc.js
        fileContent = fs_1.default.readFileSync(dir + "/.cracorc.js", "utf8").toString();
        template = fileContent.replace(new RegExp(`(\{\{PROJECT_NAME\}\}|\{\{ PROJECT_NAME \}\})`, "g"), '"' + name + '"');
        template = template.replace(new RegExp(`(\{\{PORT\}\}|\{\{ PORT \}\})`, "g"), port);
        fs_1.default.writeFileSync(dir + "/.cracorc.js", template);
    });
})();
