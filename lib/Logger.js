function formatPath(path, maxLength) {
  const ellipsis = "(…)";
  if (path.length <= maxLength) {
    return path;
  }
  return `${path.substr(
    0,
    maxLength / 2 - ellipsis.length
  )}${ellipsis}${path.substr(path.length - maxLength / 2)}`;
}

module.exports = class Logger {
  #logs = [];
  #program;

  constructor(program) {
    this.#program = program;
  }

  log(emoji, message, path) {
    this.#logs.push({
      emoji,
      message,
      path,
    });
  }

  print() {
    const maxMessageLength = this.#logs.reduce(
      (maxLength, { message }) => Math.max(maxLength, message.length),
      0
    );
    const maxLogMessageLength = parseInt(
      process.env.LOG_MESSAGE_MAX_LENGTH,
      10
    );
    const maxPathLength = maxLogMessageLength - maxMessageLength - 4;
    for (const { emoji, message, path } of this.#logs) {
      console.log(
        `${emoji} ${message}: ${" ".repeat(maxMessageLength - message.length)}${
          this.#program.fullLength ? path : formatPath(path, maxPathLength)
        }`
      );
    }
  }
};
