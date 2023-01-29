import Tokenizr from 'tokenizr'

export enum TokenType {
  boolean = 'boolean',
  string = 'string',
  number = 'number',
  operator = 'operator',
  optional = 'optional',
  required = 'required',
  open_brace = 'open_brace',
  close_brace = 'close_brace',
  open_paren = 'open_paren',
  close_paren = 'close_paren',
  open_bracket = 'open_bracket',
  close_bracket = 'close_bracket',
  equal = 'equal',
  colon = 'colon',
  comma = 'comma',
  keyword = 'keyword',
  type = 'type',
  function = 'function',
  identifier = 'identifier',
  whitespace = 'whitespace',
  comment = 'comment',
  new_line = 'newLine',
  EOF = 'EOF',
}

const lexer = new Tokenizr()

const keywords = ['model', 'enum', 'datasource', 'generator', 'type']
const functions = ['autoincrement', 'env', 'now', 'dbgenerated']
const types = ['ID', 'String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'Bytes']

const re_boolean = /true|false/
const re_functions = new RegExp(`(${functions.join('|')})`)
const re_keywords = new RegExp(`(${keywords.join('|')})`)
const re_types = new RegExp(`(${types.join('|')})`)
const re_identifier = /[a-zA-Z_][a-zA-Z0-9_]*/

lexer.rule(/@@?[a-zA-Z_][a-zA-Z0-9_.]*/, (ctx) => ctx.accept(TokenType.operator))
lexer.rule(/"[^"]*"/, (ctx) => ctx.accept(TokenType.string))
lexer.rule(/-?[0-9]+(\.[0-9]*)?(e\-?[0-9]+)?/, (ctx) => ctx.accept(TokenType.number))
lexer.rule(/\?/, (ctx) => ctx.accept(TokenType.optional))
lexer.rule(/\!/, (ctx) => ctx.accept(TokenType.required))
lexer.rule(/\{/, (ctx) => ctx.accept(TokenType.open_brace))
lexer.rule(/\}/, (ctx) => ctx.accept(TokenType.close_brace))
lexer.rule(/\(/, (ctx) => ctx.accept(TokenType.open_paren))
lexer.rule(/\)/, (ctx) => ctx.accept(TokenType.close_paren))
lexer.rule(/\[/, (ctx) => ctx.accept(TokenType.open_bracket))
lexer.rule(/\]/, (ctx) => ctx.accept(TokenType.close_bracket))
lexer.rule(/\=/, (ctx) => ctx.accept(TokenType.equal))
lexer.rule(/\:/, (ctx) => ctx.accept(TokenType.colon))
lexer.rule(/\,/, (ctx) => ctx.accept(TokenType.comma))
lexer.rule(/#.*/, (ctx) => ctx.accept(TokenType.comment))
lexer.rule(/\/\/.*/, (ctx) => ctx.accept(TokenType.comment))
lexer.rule(re_keywords, (ctx) => ctx.accept(TokenType.keyword))
lexer.rule(re_types, (ctx) => ctx.accept(TokenType.type))
lexer.rule(re_functions, (ctx) => ctx.accept(TokenType.function))
lexer.rule(re_boolean, (ctx) => ctx.accept(TokenType.boolean))
lexer.rule(re_identifier, (ctx) => ctx.accept(TokenType.identifier))
lexer.rule(/\n/, (ctx) => ctx.accept(TokenType.new_line))
lexer.rule(/\s+/, (ctx) => ctx.accept(TokenType.whitespace))

export default lexer
