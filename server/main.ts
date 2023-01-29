import fastifyView from '@fastify/view'
import fastify from 'fastify'
import * as fs from 'fs'
import * as path from 'path'
import * as pugEngine from 'pug'
import { marked } from 'marked'
import { Database } from 'src/database'
import { logger } from 'src/lib/simple-logger'
import { prismaToHtml } from 'src/lib/prisma-to-html'

const database = Database.create()
const server = fastify()

database.connect()

server.register(fastifyView, {
  engine: { pug: pugEngine },
  root: path.join(__dirname, 'views'),
})

server.get('/html/hello', async (_request, reply) => {
  return reply.view('hello.pug', { name: 'John' })
})

server.get('/html/list-files', async (request, reply) => {
  const query = request.query as Record<string, string>
  const pageSize = Number(query.pageSize) || 20
  const page = Number(query.page) || 1
  const start = (page - 1) * pageSize

  const filesTreeCount = await database.prisma.filesTree.count({
    where: { NOT: { content: null } },
  })
  const pages = Math.ceil(filesTreeCount / pageSize)

  const filesTree = await database.prisma.filesTree.findMany({
    where: { NOT: { content: null } },
    take: pageSize,
    skip: start,
  })

  const repositoriesIds = new Set(filesTree.map((file) => file.repositoryId))
  const repositories = await database.prisma.repository.findMany({
    where: { id: { in: [...repositoriesIds] } },
  })
  const repositoriesMap = new Map(repositories.map((repo) => [repo.id, repo]))

  const files = filesTree.map((file) => {
    const repository = repositoriesMap.get(file.repositoryId)
    return { id: file.id, full_name: repository!.full_name, path: file.path }
  })

  return reply.view('list-files.pug', { files, page, pages, start })
})

server.get('/html/file/:id', async (request, reply) => {
  const { id } = request.params as Record<string, string>
  const file = await database.prisma.filesTree.findUnique({ where: { id: Number(id) } })
  if (file?.content) {
    try {
      const markdown = prismaToHtml(file.content.trim())
      return reply.view('file.pug', { content: markdown })
    } catch (error) {
      return reply.view('file.pug', {
        content: `<pre>// ERROR: This schema contains errors\n\n${file.content}</pre>`,
      })
    }
  }

  return reply.view('file.pug', { content: '' })
})

server.get('/public/*', async (request, reply) => {
  const params = request.params as Record<string, string>
  const filePath = path.join(__dirname, 'public', params['*'])
  const content = fs.createReadStream(filePath)
  reply.header('Content-Type', 'text/css')
  return reply.send(content)
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }
  logger.info(`Server listening at ${address}`)
})
