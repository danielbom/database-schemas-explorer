import * as Prisma from '@prisma/client'
import { Database } from 'src/database'
import { GithubApi } from 'src/github/api'
import * as Github from 'src/github/types'
import { logger } from 'src/lib/simple-logger'
import { mappers } from 'src/mappers'

export async function storeAllRepositoriesFiles() {
  const github = GithubApi.create()
  const database = Database.create()
  await database.connect()

  const repositories = await _getRepositories(database)

  let count = 0
  for (const repository of repositories) {
    const prefix = `${count++} | ${repository.full_name}`
    logger.info(`${prefix} getting repository files`)

    try {
      const params = {
        owner: repository.owner,
        repo: repository.name,
        tree_sha: repository.default_branch,
      }
      const response = await github.getRepositoryTree(params, { recursive: 1 })

      logger.info(`${prefix} storing repository files`)
      await _storeRepositoryFiles(repository, database, response.data)
    } catch (error) {
      logger.error(`${prefix} ${error.message}`)
      throw new Error('failed to store repository files')
    }
  }

  logger.info('complete!')
}

async function _getRepositories(database: Database): Promise<Prisma.Repository[]> {
  const repositoriesWithFiles = await database.prisma.filesTree.findMany({
    distinct: ['repositoryId'],
    select: { repositoryId: true },
  })
  const repositoryIds = repositoriesWithFiles.map((repository) => repository.repositoryId)

  return await database.prisma.repository.findMany({
    where: { NOT: { id: { in: repositoryIds } } },
  })
}

async function _storeRepositoryFiles(
  repository: Prisma.Repository,
  database: Database,
  data: Github.RepositoryTreeResponse,
): Promise<void> {
  await database.prisma.$transaction(
    data.tree
      .filter((it) => !!it.url)
      .map((tree) => {
        return database.prisma.filesTree.create({
          data: {
            ...mappers.GithubTree.PrismaFileTree.map(tree),
            repository: { connect: { id: repository.id } },
          },
        })
      }),
  )
}
