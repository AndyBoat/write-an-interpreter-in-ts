import { describe, expect, test } from "bun:test";
import Lexer from "../lexer";
import Parser from ".";
import type {
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  LetStatement,
  ReturnStatement,
} from "../../base/ast";

describe("parser", () => {
  const checkParserErrors = (p: Parser) => {
    const errors = p.errors;
    if (errors.length === 0) {
      return;
    }
    for (const msg of errors) {
      console.error(`parse error: ${msg}`);
    }
    expect(errors.length).toBe(0);
  };

  test("simple let-statements", () => {
    const input = `
let x = 5;
let y = 10;
let foobar = 838383;
`;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program).not.toBeNull();
    expect(program?.statements.length).toBe(3);

    expect(program?.statements[0].tokenLiteral()).toBe("let");
    expect(program?.statements[0].constructor.name).toBe("LetStatement");
    expect((program?.statements[0] as LetStatement).name?.value).toBe("x");
    expect((program?.statements[0] as LetStatement).name?.tokenLiteral()).toBe(
      "x"
    );

    expect(program?.statements[1].tokenLiteral()).toBe("let");
    expect(program?.statements[1].constructor.name).toBe("LetStatement");
    expect((program?.statements[1] as LetStatement).name?.value).toBe("y");
    expect((program?.statements[1] as LetStatement).name?.tokenLiteral()).toBe(
      "y"
    );

    expect(program?.statements[2].tokenLiteral()).toBe("let");
    expect(program?.statements[2].constructor.name).toBe("LetStatement");
    expect((program?.statements[2] as LetStatement).name?.value).toBe("foobar");
    expect((program?.statements[2] as LetStatement).name?.tokenLiteral()).toBe(
      "foobar"
    );
  });

  test("return statements", () => {
    const input = `
return 5;
return 10;
return 993322;`;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program?.statements.length).toBe(3);

    for (const statement of program?.statements ?? []) {
      expect(statement.constructor.name).toBe("ReturnStatement");
      expect((statement as ReturnStatement).tokenLiteral()).toBe("return");
    }
  });

  test("identifier expression", () => {
    const input = "foobar";
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program?.statements.length).toBe(1);

    const statement = program?.statements[0] as ExpressionStatement;
    expect(statement.constructor.name).toBe("ExpressionStatement");

    const identifier = statement.expression as Identifier;
    expect(identifier.constructor.name).toBe("Identifier");

    expect(identifier.value).toBe("foobar");
    expect(identifier.tokenLiteral()).toBe("foobar");
  });

  test("integer literal expression", () => {
    const input = "5;";
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program?.statements.length).toBe(1);

    const statement = program?.statements[0] as ExpressionStatement;
    expect(statement.constructor.name).toBe("ExpressionStatement");

    const literal = statement.expression as IntegerLiteral;
    expect(literal.constructor.name).toBe("IntegerLiteral");

    expect(literal.value).toBe(5);
    expect(literal.tokenLiteral()).toBe("5");
  });

  test("prefix expression", () => {
    const TestList = [
      { input: "!5", operator: "!", integerValue: 5 },
      { input: "-15", operator: "-", integerValue: 15 },
    ];

    for (const { input, operator, integerValue } of TestList) {
      const l = new Lexer(input);
      const p = new Parser(l);
      const program = p.parseProgram();
      checkParserErrors(p);
      expect(program?.statements.length).toBe(1);

      const statement = program?.statements[0] as ExpressionStatement;
      expect(statement?.constructor.name).toBe("ExpressionStatement");

      const exp = statement.expression as PrefixExpression;
      expect(exp.constructor.name).toBe("PrefixExpression");

      expect(exp.operator).toBe(operator);
      testIntegerLiteral(exp.right, integerValue);
    }
  });
});
