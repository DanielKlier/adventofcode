export function log<T>(a: T): T {
  console.log(a);
  return a;
}

export class Logger {
  static Level = {
    Silent: 0,
    Error: 1,
    Warn: 2,
    Info: 3,
    Debug: 4,
  };

  constructor(public level = Logger.Level.Error) {}

  error(err: Error | unknown, ...args: unknown[]) {
    if (this.level >= Logger.Level.Error) {
      console.error(err, ...args);
    }
  }

  warn(err: Error | unknown, ...args: unknown[]) {
    if (this.level >= Logger.Level.Warn) {
      console.warn(err, ...args);
    }
  }

  info(...args: unknown[]) {
    if (this.level >= Logger.Level.Info) {
      console.log(...args);
    }
  }

  debug(...args: unknown[]) {
    if (this.level >= Logger.Level.Debug) {
      console.debug(...args);
    }
  }
}
