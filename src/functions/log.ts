import { logger } from '../lib/simple-logger'

export function log<T>(value: T, ...args: any[]): T {
  logger.info(value, ...args)
  return value
}
