type LogLevel = "INFO" | "WARN" | "ERROR" | "SECURITY";

interface LogEvent {
  level: LogLevel;
  action: string;
  message: string;
  ip?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export const logger = {
  log(event: LogEvent) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${event.level}] [${event.action}]`;

    if (event.level === "ERROR" || event.level === "SECURITY") {
      console.error(`${prefix} ${event.message}`, event.details ? JSON.stringify(event.details) : "");
    } else if (event.level === "WARN") {
      console.warn(`${prefix} ${event.message}`, event.details ? JSON.stringify(event.details) : "");
    } else {
      console.log(`${prefix} ${event.message}`, event.details ? JSON.stringify(event.details) : "");
    }
  },

  info(action: string, message: string, details?: Record<string, any>) {
    this.log({ level: "INFO", action, message, details });
  },

  warn(action: string, message: string, details?: Record<string, any>) {
    this.log({ level: "WARN", action, message, details });
  },

  error(action: string, message: string, details?: Record<string, any>) {
    this.log({ level: "ERROR", action, message, details });
  },

  security(action: string, message: string, ip?: string, details?: Record<string, any>) {
    this.log({ level: "SECURITY", action, message, ip, details });
  },
};
