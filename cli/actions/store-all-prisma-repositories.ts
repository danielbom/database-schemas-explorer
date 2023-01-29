import { Database } from 'src/database'
import { GithubApi } from 'src/github/api'
import * as Github from 'src/github/types'
import { logger } from 'src/lib/simple-logger'
import { mappers } from 'src/mappers'

export async function storeAllPrismaRepositories() {
  const github = GithubApi.create()
  const database = Database.create()
  await database.connect()

  const repositoriesCount = await database.prisma.repository.count()
  const initialPage = 1

  const state = {
    count: repositoriesCount,
    page: initialPage,
    pageSize: 100,
  }

  while (true) {
    try {
      const response = await github.searchRepositories({
        q: 'prisma',
        // ref: 'advsearch',
        // type: 'Code',
        // q: 'model+extension:prisma',
        page: state.page,
        per_page: state.pageSize,
      })

      const nextCount = await storePrismaRepository(state.count, database, response.data)

      if (state.pageSize !== response.data.items.length) {
        logger.info('no more repositories to insert')
        break
      }

      state.count = nextCount
      state.page += 1
    } catch (error) {
      logger.error(error.message)
      logger.error(error.stack)
      if (error.response) {
        logger.error(error.response.data)
      }
      break
    }
  }

  logger.info('complete!')
}

export async function storePrismaRepository(
  initialCount: number,
  database: Database,
  data: Github.SearchRepositoriesResponse,
): Promise<number> {
  let count = initialCount
  for (const repository of data.items) {
    const prefix = `${count++} | ${repository.full_name}`

    logger.info(`${prefix} inserting repository`)

    const exists = await database.prisma.repository.findUnique({
      where: { id: repository.id },
    })

    if (exists) {
      logger.info(`${prefix}: repository already exists`)
      continue
    }

    await database.prisma.repository.create({
      data: mappers.GithubRepository.PrismaRepository.map(repository),
    })

    logger.info(`${prefix}: repository inserted`)
  }

  return count
}
