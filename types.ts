export interface Mailbox {
  mailbox: string;
  countFirefoxMessages: (firefoxDomain: string) => Promise<number>;
  getLatestFirefoxMessageText: (firefoxDomain: string) => Promise<string>;
}

export enum Err {
  createAccount1 = "Couldn't find sign up button",
  createAccount2 = "Couldn't find sign up or sign in button",
  createAccount3 = "Couldn't find create account button",
  getConfirmationCode1 = "Couldn't parse code",
  getConfirmationCode2 = "Regex matches array empty",
  getConfirmationCode3 = "Couldn't get confirmation code",
  verifyAccount1 = "Couldn't find submit button",
  generateMasks1 = "Couldn't find generate new mask button",
  generateMasks2 = "Couldn't find mask button",
  generateMasks3 = "Couldn't extract mask",
}
