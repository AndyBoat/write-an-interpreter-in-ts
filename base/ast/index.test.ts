import { describe, expect, test } from "bun:test";
import { Identifier, LetStatement, Program } from ".";
import { TOKEN_TYPE, Token } from "../token";

describe("ast", () => {
  test("let myVar = anotherVar;", () => {
    let program = new Program();
    const letStatement = new LetStatement(
      new Token(TOKEN_TYPE.LET, "let"),
      new Identifier(new Token(TOKEN_TYPE.IDENT, "myVar"), "myVar"),
      new Identifier(new Token(TOKEN_TYPE.IDENT, "anotherVar"), "anotherVar")
    );

    program.statements.push(letStatement);
    expect(program.toString()).toBe("let myVar = anotherVar;");
  });
});
