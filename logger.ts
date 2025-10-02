/**
 * Structured logging utility for the application
 * Handles error logging with sanitization for production environments
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  errorCode?: string;
  metadata?: Record<string, any>;
  sanitizedError?: {
    message: string;
    name: string;
    stack?: string;
  };
}

class AppLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  /**
   * Generates a short, safe error code for user-facing error identification
   */
  private generateErrorCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `ERR_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Sanitizes error objects by removing sensitive information
   */
  private sanitizeError(error: Error): { message: string; name: string; stack?: string } {
    const sanitized = {
      message: error.message || 'Unknown error occurred',
      name: error.name || 'Error'
    };

    // In development, include limited stack trace
    if (this.isDevelopment && error.stack) {
      // Truncate stack trace and remove file paths
      const stackLines = error.stack.split('\n').slice(0, 5);
      sanitized.stack = stackLines
        .map(line => line.replace(/at\s+.*[\\\/]([^\\\/]+:\d+:\d+)/, 'at $1'))
        .join('\n');
    }

    return sanitized;
  }

  /**
   * Removes or redacts sensitive information from metadata
   */
  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'credential', 'auth'];
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(metadata)) {
      const keyLower = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sensitive => keyLower.includes(sensitive));
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 200) {
        // Truncate long strings
        sanitized[key] = value.substring(0, 200) + '... [TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, any>): string {
    const errorCode = this.generateErrorCode();
    
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      errorCode,
      metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
      sanitizedError: error ? this.sanitizeError(error) : undefined
    };

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      const consoleMethod = level === LogLevel.ERROR ? console.error : 
                          level === LogLevel.WARN ? console.warn : console.log;
      
      consoleMethod('🔍 [App Logger]', {
        errorCode,
        level,
        message,
        ...(error && { error: this.sanitizeError(error) }),
        ...(metadata && { metadata: this.sanitizeMetadata(metadata) })
      });
    } else {
      // In production, you would send this to your logging service
      // For now, we'll use console.log with structured format
      console.log(JSON.stringify(logEntry));
    }

    return errorCode;
  }

  /**
   * Log error with structured format and return error code for user display
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): string {
    return this.log(LogLevel.ERROR, message, error, metadata);
  }

  /**
   * Log warning
   */
  warn(message: string, metadata?: Record<string, any>): string {
    return this.log(LogLevel.WARN, message, undefined, metadata);
  }

  /**
   * Log info
   */
  info(message: string, metadata?: Record<string, any>): string {
    return this.log(LogLevel.INFO, message, undefined, metadata);
  }

  /**
   * Log debug (only in development)
   */
  debug(message: string, metadata?: Record<string, any>): string {
    if (this.isDevelopment) {
      return this.log(LogLevel.DEBUG, message, undefined, metadata);
    }
    return '';
  }
}

// Export singleton instance
export const logger = new AppLogger();

/**
 * Helper function to create user-friendly error messages
 */
export function createUserErrorMessage(operation: string, errorCode: string): string {
  return `❌ ${operation} failed (Error: ${errorCode})`;
}
