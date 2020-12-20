#!/usr/bin/env node
require("dotenv").config();
const packageJson = require("./package.json");
const { program } = require("commander");
const {
  readdirSync,
  lstatSync,
  existsSync,
  symlinkSync,
  unlinkSync,
} = require("fs");
const { join } = require("path");
const { Logger } = require("./lib");

program
  .version(packageJson.version)
  .requiredOption(
    "-s --short-name <shortName>",
    "short name of the game to patch (example: warhammer2)"
  )
  .option(
    "-d --delete-existing",
    "delete any existing files or links if found before symlinking"
  )
  .option("-f --full-length", "print paths in results in full length")
  .parse(process.argv);

const patchSteamDirPath = join(process.env.PATCH_STEAM_DIR, program.shortName);

if (!existsSync(patchSteamDirPath)) {
  console.error(
    `error: there is no dir in patch-steam with the specified short name\ndir not found: ${patchSteamDirPath}`
  );
  process.exit(1);
}

if (!lstatSync(patchSteamDirPath).isDirectory()) {
  console.error(`error: not a directory\n${patchSteamDirPath}`);
  process.exit(1);
}

function collectSymLinkTargetPaths(dir) {
  const results = [];
  for (const curr of readdirSync(dir)) {
    const currPath = join(dir, curr);
    if (lstatSync(currPath).isDirectory()) {
      results.push(...collectSymLinkTargetPaths(currPath));
    } else {
      results.push(currPath);
    }
  }
  return results;
}

const symLinkTargetPaths = collectSymLinkTargetPaths(patchSteamDirPath);

const logger = new Logger(program);

for (const symLinkTargetPath of symLinkTargetPaths) {
  const symLinkLocationPath = symLinkTargetPath.replace(
    patchSteamDirPath,
    process.env.TARGET_STEAM_DIR
  );
  if (!existsSync(symLinkLocationPath)) {
    try {
      if (lstatSync(symLinkLocationPath).isSymbolicLink()) {
        logger.log("⚠️", "Invalid existing link", symLinkLocationPath);
        unlinkSync(symLinkLocationPath);
      }
    } catch (err) {
      // OK to ignore
    }
    logger.log("💡", "Not found", symLinkLocationPath);
    symlinkSync(symLinkTargetPath, symLinkLocationPath);
    logger.log("🔗", "Linked", symLinkTargetPath);
  } else {
    if (program.deleteExisting) {
      unlinkSync(symLinkLocationPath);
      logger.log("❌", "Deleted existing", symLinkLocationPath);
      symlinkSync(symLinkTargetPath, symLinkLocationPath);
      logger.log("🔗", "Linked", symLinkTargetPath);
    } else {
      logger.log("✅", "Already exists", symLinkLocationPath);
    }
  }
}

logger.print();
