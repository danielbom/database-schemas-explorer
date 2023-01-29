export const logger = {
  info(...args: any[]) {
    console.log('[INFO]', ...args)
  },
  error(...args: any[]) {
    console.log('[ERROR]', ...args)
  },
  warn(...args: any[]) {
    console.log('[WARN]', ...args)
  },
}
