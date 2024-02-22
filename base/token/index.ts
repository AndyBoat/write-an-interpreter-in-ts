export enum TOKEN_TYPE {
  // PRESERVED
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  // IDENTIFIERS + LITERALS
  IDENT = "IDENT",
  INT = "INT",

  // OPERATORS
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",

  LT = "<",
  GT = ">",

  EQ = "==",
  NOT_EQ = "!=",

  // DELIMITERS
  COMMA = ",",
  SEMICOLON = ";",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  // KEYWORD
  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
}

export const KEYWORD = {
  fn: TOKEN_TYPE.FUNCTION,
  let: TOKEN_TYPE.LET,
  true: TOKEN_TYPE.TRUE,
  false: TOKEN_TYPE.FALSE,
  if: TOKEN_TYPE.IF,
  else: TOKEN_TYPE.ELSE,
  return: TOKEN_TYPE.RETURN,
};

export const lookupIndent = (
  ident: keyof typeof KEYWORD | string
): TOKEN_TYPE => {
  return (KEYWORD as { [key: string]: TOKEN_TYPE })[ident] ?? TOKEN_TYPE.IDENT;
};

export class Token {
  type: TOKEN_TYPE;
  literal: string;
  constructor(type: TOKEN_TYPE, literal: string) {
    this.type = type;
    this.literal = literal;
  }
}
