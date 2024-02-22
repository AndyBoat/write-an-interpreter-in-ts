import { lookupIndent, Token, TOKEN_TYPE } from "../../base/token";

const isLetter = (char: string) => {
  return (
    ("a" <= char && "z" >= char) || ("A" <= char && "Z" >= char) || char === "_"
  );
};

const isDigit = (char: string) => {
  return "0" <= char && char <= "9";
};

export default class Lexer {
  private input: string = "";
  private position: number = 0;
  private readPosition: number = 0;
  private ch: string = "";
  constructor(sourceCode: string) {
    this.input = sourceCode;
    this.readChar();
  }
  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = "";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition++;
  }
  public nextToken(): Token {
    let token: Token;

    this.skipWhitespace();
    switch (this.ch) {
      case "=":
        token = new Token(TOKEN_TYPE.ASSIGN, this.ch);
        break;
      case "+":
        token = new Token(TOKEN_TYPE.PLUS, this.ch);
        break;
      case "-":
        token = new Token(TOKEN_TYPE.MINUS, this.ch);
        break;
      case "!":
        token = new Token(TOKEN_TYPE.BANG, this.ch);
        break;
      case "/":
        token = new Token(TOKEN_TYPE.SLASH, this.ch);
        break;
      case "*":
        token = new Token(TOKEN_TYPE.ASTERISK, this.ch);
        break;
      case "<":
        token = new Token(TOKEN_TYPE.LT, this.ch);
        break;
      case ">":
        token = new Token(TOKEN_TYPE.GT, this.ch);
        break;
      case ",":
        token = new Token(TOKEN_TYPE.COMMA, this.ch);
        break;
      case ";":
        token = new Token(TOKEN_TYPE.SEMICOLON, this.ch);
        break;
      case "(":
        token = new Token(TOKEN_TYPE.LPAREN, this.ch);
        break;
      case ")":
        token = new Token(TOKEN_TYPE.RPAREN, this.ch);
        break;
      case "{":
        token = new Token(TOKEN_TYPE.LBRACE, this.ch);
        break;
      case "}":
        token = new Token(TOKEN_TYPE.RBRACE, this.ch);
        break;
      case "":
        token = new Token(TOKEN_TYPE.EOF, this.ch);
        break;
      default:
        if (isLetter(this.ch)) {
          const tokenLiteral = this.readIdentifier();
          const tokenType = lookupIndent(tokenLiteral);
          return new Token(tokenType, tokenLiteral);
        } else if (isDigit(this.ch)) {
          const tokenLiteral = this.readNumber();
          return new Token(TOKEN_TYPE.INT, tokenLiteral);
        } else {
          token = new Token(TOKEN_TYPE.ILLEGAL, this.ch);
        }
    }
    this.readChar();
    return token!;
  }
  private readIdentifier() {
    let start = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(start, this.position);
  }

  private skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }
  private readNumber() {
    let position = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  private peekChar() {
    if (this.readPosition >= this.input.length) {
      return "";
    }
    return this.input.at(this.readPosition);
  }
}

export { TOKEN_TYPE, Token };
