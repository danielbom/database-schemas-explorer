import * as fs from 'fs'
import * as path from 'path'

const FILE_PATH = __filename

type StringifyArgs = Parameters<typeof JSON.stringify>

export class Resources {
  constructor(public readonly resourcesPath: string) {}

  static create(): Resources {
    const currentPath = path.dirname(FILE_PATH)
    const rootPath = path.resolve(currentPath, '..')
    const resourcesPath = path.resolve(rootPath, 'resources')
    return new Resources(resourcesPath)
  }

  getFullPath(fileOrDir: string[]): string {
    return path.resolve(this.resourcesPath, ...fileOrDir)
  }

  readSync(fileOrDir: string[]): string {
    return fs.readFileSync(this.getFullPath(fileOrDir), 'utf-8')
  }

  read(fileOrDir: string[]): Promise<string> {
    return fs.promises.readFile(this.getFullPath(fileOrDir), 'utf-8')
  }

  writeSync(fieldOrDir: string[], content: string): void {
    return fs.writeFileSync(this.getFullPath(fieldOrDir), content)
  }

  write(fieldOrDir: string[], content: string): Promise<void> {
    return fs.promises.writeFile(this.getFullPath(fieldOrDir), content)
  }

  writeJsonSync(fieldOrDir: string[], ...args: StringifyArgs): void {
    return this.writeSync(fieldOrDir, JSON.stringify(...args))
  }

  writeJson(fieldOrDir: string[], ...args: StringifyArgs): Promise<void> {
    return this.write(fieldOrDir, JSON.stringify(...args))
  }
}
