#!/usr/bin/env node
require("dotenv").config();
const packageJson = require("./package.json");
const { program } = require("commander");
const {
  mkdirSync,
  readdirSync,
  lstatSync,
  existsSync,
  symlinkSync,
  unlinkSync,
  rmSync,
} = require("fs");
const { join } = require("path");
const { exec } = require("child_process");

program
  .version(packageJson.version)
  .requiredOption(
    "-s --short-name <shortName>",
    "short name of the game to patch (example: warhammer2)"
  )
  .requiredOption(
    "-n --long-name <longName>",
    "long name of the game to patch (example: Total War WARHAMMER II)"
  )
  .option("-d --delete-existing", "delete existing steam patch dir if present")
  .option("-f --full-length", "print paths in results in full length")
  .parse(process.argv);

const patchSteamDirPath = join(process.env.PATCH_STEAM_DIR, program.shortName);

if (!program.deleteExisting && existsSync(patchSteamDirPath)) {
  console.error(
    `error: there is already a dir in patch-steam with the specified short name\npath: ${patchSteamDirPath}`
  );
  process.exit(1);
}

const sourceSteamDirPath = join(process.env.SOURCE_STEAM_DIR, program.longName);

if (!existsSync(sourceSteamDirPath)) {
  console.error(
    `error: there is no game with the specified name installed\ndir not found: ${sourceSteamDirPath}`
  );
  process.exit(1);
}
if (existsSync(patchSteamDirPath)) {
  rmSync(patchSteamDirPath, { force: true, recursive: true });
}

mkdirSync(patchSteamDirPath);

exec(`rsync -avh --prune-empty-dirs --include='*/' --include='*.'{txt,xml} --exclude='*' "${sourceSteamDirPath}" "${patchSteamDirPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(error.message);
    process.exit(1)
  }
  if (stderr) {
    console.error(stderr);
    process.exit(1)
  }
  console.log(stdout);
});

