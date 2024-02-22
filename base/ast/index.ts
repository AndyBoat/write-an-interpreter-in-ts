import { Token, type TOKEN_TYPE } from "../token";

export abstract class Node {
  tokenLiteral() {
    return "";
  }
  toString() {
    return "";
  }
}

export class Statement extends Node {
  statementNode() {
    return;
  }
}

export class Expression extends Node {
  expressionNode() {
    return;
  }
}

export class Program extends Node {
  statements: Statement[] = [];

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }

  toString() {
    return this.statements.map((s) => s.toString()).join("\n");
  }
}

export class Identifier extends Expression {
  constructor(public token: Token, public value: string) {
    super();
  }
  tokenLiteral() {
    return this.token.literal;
  }
  toString(): string {
    return this.value;
  }
}

export class LetStatement extends Statement {
  constructor(
    public token: Token,
    public name: Identifier | undefined = undefined,
    public value: Expression | undefined = undefined
  ) {
    super();
  }
  tokenLiteral() {
    return this.token.literal;
  }
  toString(): string {
    let str = "";
    str += this.tokenLiteral() + " ";
    str += this.name?.toString() ?? "";
    str += " = ";

    if (this.value) {
      str += this.value.toString();
    }
    str += ";";
    return str;
  }
}

export class ReturnStatement extends Statement {
  constructor(
    public token: Token,
    public returnValue: Expression | undefined = undefined
  ) {
    super();
  }
  tokenLiteral() {
    return this.token.literal;
  }
  toString(): string {
    let str = "";
    str += this.tokenLiteral() + " ";
    if (this.returnValue) {
      str += this.returnValue.toString();
    }
    str += ";";
    return str;
  }
}

export class ExpressionStatement extends Statement {
  constructor(
    public token: Token,
    public expression: Expression | undefined = undefined
  ) {
    super();
  }
  tokenLiteral(): string {
    return this.token.literal;
  }
  toString(): string {
    if (this.expression) {
      return this.expression.toString();
    }
    return "";
  }
}

export class IntegerLiteral extends Expression {
  constructor(public token: Token, public value: number = 0) {
    super();
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.token.literal;
  }
}
