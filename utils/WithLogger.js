/* global console */

const DEBUG_LOGS = process.env.DEBUG_LOGS === 'true';
const serializeObjectParam = ({ tabSize = 2 } = {}) => (item) => typeof item === 'object' ? JSON.stringify(item, null, tabSize) : item;

class WithLogger {
  constructor() {
    this.__className = this.constructor.name;
    this.__loggerTabSize = 2;
    this.__console = {
      ...console,
      log: this.__logMessage.bind(this, 'log'),
      warn: this.__logMessage.bind(this, 'warn'),
      debug: (...args) => DEBUG_LOGS && this.__logMessage('debug', ...args),
      info: this.__logMessage.bind(this, 'info'),
    };
  }

  __logMessage(level, ...args) {
    const timestamp = new Date().toISOString();
    const argParser = serializeObjectParam({ tabSize: this.__loggerTabSize });
    const parsedArgs = args.map(argParser);
    console[level](`[${timestamp}] (${this.__className})`, ...parsedArgs);
  }
}

module.exports = { WithLogger };
