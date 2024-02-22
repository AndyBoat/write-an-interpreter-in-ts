import {
  Expression,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  LetStatement,
  Program,
  ReturnStatement,
  Statement,
} from "../../base/ast";
import type Lexer from "../lexer";
import { TOKEN_TYPE, type Token } from "../lexer";

export type PrefixParseFn = () => Expression | undefined;
export type InfixParseFn = (e: Expression) => Expression | undefined;

export enum PRECEDENCES {
  _,
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
}

export default class Parser {
  l: Lexer;
  errors: string[] = [];
  curToken!: Token;
  peekToken!: Token;

  private prefixParseFns: Partial<Record<TOKEN_TYPE, PrefixParseFn>> = {};
  private infixParseFns: Partial<Record<TOKEN_TYPE, InfixParseFn>> = {};

  constructor(l: Lexer) {
    this.l = l;
    this.nextToken();
    this.nextToken();

    // NOTE: pay attention to the `this` behavior in javascript
    this.registerPrefix(TOKEN_TYPE.IDENT, (...params) =>
      this.parseIdentifier(...params)
    );
    this.registerPrefix(TOKEN_TYPE.INT, (...params) =>
      this.parseIntegerLiteral(...params)
    );
  }
  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram(): Program | null {
    const program = new Program();
    while (this.curToken.type !== TOKEN_TYPE.EOF) {
      const statement = this.parseStatement();
      if (statement !== null) {
        program.statements.push(statement);
      }
      this.nextToken();
    }
    return program;
  }

  private parseStatement(): Statement | null {
    switch (this.curToken.type) {
      case TOKEN_TYPE.LET:
        return this.parseLetStatement();
      case TOKEN_TYPE.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
    return null;
  }

  private parseLetStatement(): LetStatement | null {
    const statement = new LetStatement(this.curToken);
    if (!this.iterateIfPeekMatch(TOKEN_TYPE.IDENT)) {
      return null;
    }
    const identifier = new Identifier(this.curToken, this.curToken.literal);
    statement.name = identifier;

    if (!this.iterateIfPeekMatch(TOKEN_TYPE.ASSIGN)) {
      return null;
    }

    //TODO: parse expression

    while (!this.curTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private curTokenIs(type: TOKEN_TYPE) {
    return this.curToken.type === type;
  }

  private peekTokenIs(type: TOKEN_TYPE) {
    return this.peekToken.type === type;
  }

  private iterateIfPeekMatch(type: TOKEN_TYPE) {
    if (this.peekTokenIs(type)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(type);
      return false;
    }
  }

  private peekError(type: TOKEN_TYPE) {
    const msg = `expected next token to be ${type}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  private parseReturnStatement() {
    const statement = new ReturnStatement(this.curToken);
    this.nextToken();

    // TODO: parse expression
    while (!this.curTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
      continue;
    }

    return statement;
  }

  private registerPrefix(type: TOKEN_TYPE, fn: PrefixParseFn) {
    this.prefixParseFns[type] = fn;
  }

  private registerInfix(type: TOKEN_TYPE, fn: InfixParseFn) {
    this.infixParseFns[type] = fn;
  }

  private parseExpressionStatement(): ExpressionStatement {
    const statement = new ExpressionStatement(this.curToken);
    statement.expression = this.parseExpression(PRECEDENCES.LOWEST);
    if (this.peekTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
    }
    return statement;
  }

  private parseExpression(precedence: PRECEDENCES): Expression | undefined {
    const prefixFn = this.prefixParseFns[this.curToken.type];
    if (!prefixFn) {
      return undefined;
    }

    const leftExp = prefixFn();
    return leftExp;
  }

  private parseIdentifier(): Expression {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  private parseIntegerLiteral(): Expression | undefined {
    const integerLiteral = new IntegerLiteral(this.curToken);
    const num = Number.parseInt(this.curToken.literal);
    if (Number.isNaN(num)) {
      const msg = `could not parse ${this.curToken.literal} as integer`;
      this.errors.push(msg);
      return undefined;
    }
    integerLiteral.value = num;
    return integerLiteral;
  }
}
