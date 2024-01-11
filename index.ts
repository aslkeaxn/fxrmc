import puppeteer from "puppeteer";
import { Err, Mailbox } from "./types";
import { createAccount } from "./src/create-account";
import { getConfirmationCode } from "./src/get-confirmation-code";
import { verifyAccount } from "./src/verify-account";
import { generateMask } from "./src/generate-masks";
import { firefoxDomain } from "./constants";

async function fxrmc(
  mailbox: Mailbox,
  password: string,
  headless: false | "new" = "new"
) {
  const browser = await puppeteer.launch({ headless });
  const pages = await browser.pages();
  const page = pages[0];

  console.log("Creating account...");
  const originalRelayMailCount = await mailbox.countFirefoxMessages(
    firefoxDomain
  );
  await createAccount(page, mailbox, password);

  console.log("Verifying account...");
  const code = await getConfirmationCode(mailbox, originalRelayMailCount);
  await verifyAccount(page, code);

  console.log("Generating masks...");
  const mask = await generateMask(page);

  await page.close();
  await browser.close();

  return mask;
}

export { Err };

export default fxrmc;
