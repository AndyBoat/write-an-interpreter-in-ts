import Lexer, { TOKEN_TYPE } from "../../components/lexer";
const PROMPT = ">> ";

export const start = async () => {
  process.stdout.write(PROMPT);
  for await (const line of console) {
    if (!line) {
      return;
    }
    const l = new Lexer(line);
    for (
      let token = l.nextToken();
      token.type !== TOKEN_TYPE.EOF;
      token = l.nextToken()
    ) {
      console.info(token);
    }
    process.stdout.write(PROMPT);
  }
};
