import fastifyView from '@fastify/view'
import fastify from 'fastify'
import * as path from 'path'
import * as pugEngine from 'pug'
import { marked } from 'marked'
import { Database } from 'src/database'
import { logger } from 'src/lib/simple-logger'

const database = Database.create()
const server = fastify()

database.connect()

server.register(fastifyView, {
  engine: { pug: pugEngine },
  root: path.join(__dirname, 'views'),
})

server.get('/', async (request, reply) => {
  return reply.view('hello.pug', { name: 'John' })
})

server.get('/show/:id', async (request, reply) => {
  const { id } = request.params as Record<string, string>
  const file = await database.prisma.filesTree.findUnique({
    where: { id: Number(id) },
  })
  if (file?.content) {
    const markdown = marked(`\`\`\`prisma\n${file.content}\n\`\`\``)
    return reply.view('show-file.pug', { content: markdown })
  } else {
    return reply.view('show-file.pug', { content: '' })
  }
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }
  logger.info(`Server listening at ${address}`)
})
