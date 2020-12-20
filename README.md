# Steam Fixer

**Workaround for a bug in Steam that makes it possible to install games on external drives**

Steam has a bug that makes it impossible to install a Mac game on an external
drive. I'm not sure if this is actually a problem of Steam, or if my virus
scanner (which I can't disable) is the culprit.

As soon as a game is installed on the external drive, any TXT and XML files in
the game's installation directory disappear, making it impossible to launch the
game. Steam will notice the missing file and “think” it needs to run an update.

This tool provides a workaround that allows games that have been installed
locally to be moved to the external drive. The trick is to store the TXT and XML
files in a separate location on the internal drive, then, after moving the game
to the external drive, create symbolic links from the external drive to the TXT
and XML files.

## Installation

You need to have [Node.js](https://nodejs.org/), at least version 14.14.0
installed.

Clone or download this GitHub repository to a location of your choosing, then
install npm package dependencies with this command:

```
npm install
```

## Configuration

The basic configuration of this tool is done through a `.env` file, which is not
included in the GitHub repository – you have to create it yourself. The easiest
way to do this is copy the `.env.example` file, which _is_ included, then edit
it:

```
cp .env.example .env
```

In your `.env` file, you have to set the paths to the directories where the
Steam Fixer should store the XML and TXT files, as well as the directories where
Steam installs games, both on your internal and external drive.

## Usage

### How to Move a Game to an External Drive

In Steam, install the game on the Mac's internal drive.

In a terminal, run the command to create patch files:

```
npm run create-patch-files -- -s SHORT_NAME -n LONG_NAME
```

**Example**

```
npm run create-patch-files -- -s three-kingdoms -n "Total War THREE KINGDOMS"
```

This will copy all the TXT and XML files of the game on your internal drive into
the steam patch directory with the provided `SHORT_NAME`, preserving directory
structure.

In Steam, move the local files of the game to the external drive:

- In the games library, right click on the game you want to move
- In the context menu, select “properties”
- In the dialog that opens, click the “local files” tab
- Click the button “move game files”

After the files have been moved successfully, if the game is affected by the bug
that deletes TXT and XML files, Steam will report that updates for the game need
to be installed. Any attempt to update the game will fail.

If this doesn't happen and you can start the game, great – you're done!

**If the game _is_ broken after moving to the external SSD:**

Run the command to create sym links from the external SSD to the patch files:

```
npm run create-sym-links -- -s SHORT_NAME
```

**Example**

```
npm run create-sym-links -- -s three-kingdoms
```

This will create symbolic links from the game on your external drive to the TXT
and XML files in the steam patch directory.

You should now be able to start the game in Steam!
