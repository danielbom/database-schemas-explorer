import { GithubApi } from 'src/github/api'
import { Database } from 'src/database'
import { logger } from 'src/lib/simple-logger'
import * as Prisma from '@prisma/client'

export async function storePrismaFilesContent() {
  const repositoriesCache = new Map<number, Prisma.Repository>()
  const database = Database.create()
  const github = GithubApi.create()

  await database.connect()

  const prismaFiles = await database.prisma.filesTree.findMany({
    where: {
      path: { endsWith: '.prisma' },
      content: null,
    },
  })

  for (const file of prismaFiles) {
    const repository = await _getRepository(file.repositoryId, repositoriesCache, database)
    const prefix = `${repository.full_name}/${file.path}`
    logger.info(`${prefix} Get content`)

    try {
      const content = await github.getRawData({
        owner: repository.owner,
        repo: repository.name,
        tree_sha: repository.default_branch,
        path: file.path,
      })
      await _updateFileContent(database, file, content.data)
    } catch (error) {
      logger.error(`${prefix} Not Found`)
      await _updateFileContent(database, file, '404: Not Found')
    }
  }

  logger.info('complete!')
}

async function _updateFileContent(database: Database, file: Prisma.FilesTree, content: string): Promise<void> {
  await database.prisma.filesTree.update({
    where: { id: file.id },
    data: { content },
  })
}

async function _getRepository(id: number, cache: Map<number, Prisma.Repository>, database: Database) {
  const cachedRepository = cache.get(id)
  if (cachedRepository) {
    return cachedRepository
  }

  const repository = await database.prisma.repository.findUnique({ where: { id } })
  if (!repository) {
    throw new Error(`Repository with id ${id} not found`)
  }

  cache.set(id, repository)
  return repository
}
