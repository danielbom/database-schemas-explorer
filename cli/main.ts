import { Command } from 'commander'

const commander = new Command('prisma-github-collector')

commander
  .command('store-all-prisma-repositories')
  .description('|1st| Store all prisma repositories (unsafe)')
  .action(() => import('./actions/store-all-prisma-repositories').then((m) => m.storeAllPrismaRepositories()))

commander
  .command('store-all-repositories-files')
  .description('|2nd| Store all repositories files (safe)')
  .action(() => import('./actions/store-all-repositories-files').then((m) => m.storeAllRepositoriesFiles()))

commander
  .command('store-prisma-files-content')
  .description('|3rd| Store prisma files content (safe)')
  .action(() => import('./actions/store-prisma-files-content').then((m) => m.storePrismaFilesContent()))

commander.addHelpText('after', ' ')
commander.addHelpText('after', '  (unsafe): recover from errors/interruptions REQUIRES code inspection.')
commander.addHelpText('after', '  (safe): recover from errors/interruptions NO REQUIRES code inspections.')

commander.parse(process.argv)
