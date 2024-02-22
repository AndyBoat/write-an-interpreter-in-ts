import { start } from "./tool/repl";
import os from "node:os";

const userInfo = os.userInfo();

console.info(
  `Hello ${userInfo.username}! This is the Monkey programming language!`
);
console.info("Feel free to type in commands");

start();
