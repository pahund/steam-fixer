#!/usr/bin/env node
require("dotenv").config();
const packageJson = require("./package.json");
const { program } = require("commander");
const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");

program.version(packageJson.version).parse(process.argv);

const steamDir = process.env.SOURCE_STEAM_DIR;

for (const curr of readdirSync(steamDir)) {
  if (lstatSync(join(steamDir, curr)).isDirectory()) {
    console.log(curr);
  }
}
