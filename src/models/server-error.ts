export class ServerError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "ServerError";
  }
}
