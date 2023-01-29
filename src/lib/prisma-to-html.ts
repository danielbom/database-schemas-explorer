import { Token } from 'tokenizr'
import lexer, { TokenType } from './tokenize-prisma'

const TYPE_TO_CLASS: Record<TokenType, string> = {
  [TokenType.open_paren]: 'punct paren',
  [TokenType.open_brace]: 'punct brace',
  [TokenType.open_bracket]: 'punct bracket',
  [TokenType.close_paren]: 'punct paren',
  [TokenType.close_brace]: 'punct brace',
  [TokenType.close_bracket]: 'punct bracket',
  [TokenType.colon]: 'punct',
  [TokenType.comma]: 'punct',
  [TokenType.optional]: 'optional',
  [TokenType.required]: 'required',
  [TokenType.equal]: 'punct',
  [TokenType.comment]: 'comment',
  [TokenType.boolean]: 'boolean',
  [TokenType.string]: 'string',
  [TokenType.number]: 'number',
  [TokenType.keyword]: 'keyword',
  [TokenType.identifier]: 'identifier',
  [TokenType.operator]: 'operator',
  [TokenType.type]: 'type',
  [TokenType.function]: 'function',
  [TokenType.whitespace]: '',
  [TokenType.new_line]: '',
  [TokenType.EOF]: '',
}

export function prismaToHtml(content: string) {
  lexer.input(content)

  let lastGroupToken: Token | null = null
  let groupTokens: Token[] = []
  let lineTokens: Token[] = []
  let lastToken: Token | null = null

  try {
    const sb: string[] = []
    lexer.tokens().forEach((token) => {
      const tokenType =
        lastGroupToken && token.type === TokenType.keyword ? TokenType.identifier : (token.type as TokenType)
      const typeClass = TYPE_TO_CLASS[tokenType]

      if (lineTokens.length === 1 && lineTokens[0].type === tokenType && tokenType === TokenType.identifier) {
        sb.push(`<span class="token type">${token.value}</span>`)
      } else if (lastToken && lastToken.type === TokenType.keyword && tokenType === TokenType.identifier) {
        sb.push(`<span class="token keyword-identifier">${token.value}</span>`)
      } else if (typeClass) {
        sb.push(`<span class="token ${typeClass}">${token.value}</span>`)
      } else if (tokenType === TokenType.new_line) {
        sb.push('<br />')
        lineTokens = []
      } else if (tokenType === TokenType.whitespace) {
        sb.push(token.value)
      }

      if (tokenType === TokenType.keyword) {
        lastGroupToken = token
      } else if (tokenType === TokenType.open_brace) {
        groupTokens.push(lastGroupToken!)
      } else if (tokenType === TokenType.close_brace) {
        groupTokens.pop()
        lastGroupToken = groupTokens.length > 0 ? groupTokens[groupTokens.length - 1] : null
      }

      if (typeClass) {
        if (!typeClass.includes('punct')) {
          lastToken = token
          lineTokens.push(token)
        }
      }
    })

    return `<div class="language-prisma"><code><pre>\n${sb.join('')}</pre></code></div>`
  } catch (error) {
    const lastPositionContent = content.slice(error.pos, error.pos + 10)
    const message = `Error while parsing prisma file: ${error.message} at ${error.pos} (${error.line}:${error.col})\n${lastPositionContent}`

    console.error(error)
    console.error(message)
    throw new Error(message)
  }
}
