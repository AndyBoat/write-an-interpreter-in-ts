import { describe, expect, test } from "bun:test";
import Lexer, { TOKEN_TYPE, Token } from "./index";

describe("Lexer", () => {
  test("complete test case", () => {
    const input = `let five = 5;
    let ten = 10;
    
    let add = fn(x,y){
      x + y;
    };
  
    let result = add(five,ten);
    !-/*5;
    5 < 10 > 5;

    if (5 < 10){
      return false;
    } else{
      return true;
    }

    10 == 10;
    10 != 9;
    `;
    const l = new Lexer(input);
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LET, "let"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "five"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ASSIGN, "="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "5"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LET, "let"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "ten"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ASSIGN, "="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LET, "let"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "add"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ASSIGN, "="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.FUNCTION, "fn"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LPAREN, "("));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "x"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.COMMA, ","));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "y"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RPAREN, ")"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LBRACE, "{"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "x"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.PLUS, "+"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "y"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RBRACE, "}"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LET, "let"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "result"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ASSIGN, "="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "add"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LPAREN, "("));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "five"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.COMMA, ","));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IDENT, "ten"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RPAREN, ")"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.BANG, "!"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.MINUS, "-"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SLASH, "/"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ASTERISK, "*"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "5"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "5"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LT, "<"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.GT, ">"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "5"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    //
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.IF, "if"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LPAREN, "("));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "5"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LT, "<"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RPAREN, ")"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LBRACE, "{"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RETURN, "return"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.FALSE, "false"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RBRACE, "}"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.ELSE, "else"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.LBRACE, "{"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RETURN, "return"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.TRUE, "true"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.RBRACE, "}"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.EQ, "=="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "10"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.NOT_EQ, "!="));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.INT, "9"));
    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.SEMICOLON, ";"));

    expect(l.nextToken()).toEqual(new Token(TOKEN_TYPE.EOF, ""));
  });
});
