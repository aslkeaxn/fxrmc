import puppeteer from "puppeteer";
import osecmail from "osecmail";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fxrmc(
  osecmailEmail: string,
  password: string,
  headless: false | "new" = "new"
) {
  const browser = await puppeteer.launch({ headless });
  const pages = await browser.pages();
  const page = pages[0];

  await page.goto("https://relay.firefox.com/");

  const suButton = await page.waitForSelector("a ::-p-text(Sign Up)");
  if (!suButton) throw new Error("Couldn't find sign up button");
  await suButton.click();

  await page.locator("input").fill(osecmailEmail);

  const suSiButton = await page.waitForSelector("#submit-btn");
  if (!suSiButton) throw new Error("Couldn't find sign up or sign in button");
  await suSiButton.click();

  await page.locator("#password").fill(password);
  await page.locator("#vpassword").fill(password);
  const age = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
  await page.locator("#age").fill(`${age}`);

  const caButton = await page.waitForSelector("#submit-btn");
  if (!caButton) throw new Error("Couldn't find create account button");
  await caButton.click();

  const [login, domain] = osecmailEmail.split("@");

  const messages = await osecmail.getMessages(login, domain);
  const originalCount = messages.filter((m) =>
    m.from.includes("mail.firefox.com")
  ).length;

  let code = "";

  let i = 0;
  while (i < 10) {
    i++;
    await sleep(5000);
    const messages = await osecmail.getMessages(login, domain);
    const fxMessages = messages.filter((m) =>
      m.from.includes("mail.firefox.com")
    );

    if (fxMessages.length === originalCount) continue;

    const fxm = await osecmail.getMessage(login, domain, fxMessages[0].id);

    const codeRegex = fxm.textBody.match(/\d{6}/);
    if (!codeRegex) throw new Error("Couldn't match verification code");
    if (codeRegex.length === 0) throw new Error("No regex matches");

    code = codeRegex[0];
    break;
  }

  if (code.length === 0) throw new Error("Couldn't get verification code");

  await page.locator("#otp-code").fill(code);

  const sButton = await page.waitForSelector("#submit-btn");
  if (!sButton) throw new Error("Couldn't find submit button");
  await sButton.click();

  const gmButton = await page.waitForSelector(
    "button ::-p-text(Generate new mask)"
  );
  if (!gmButton) throw new Error("Couldn't find generate mask button");
  await gmButton.click();

  const samp = await page.waitForSelector("samp");
  if (!samp) throw new Error("Couldn't find mask container");

  const mask = await samp.evaluate((s) => s.textContent);
  if (!mask) throw new Error("Couldn't extract mask");

  await page.close();
  await browser.close();

  return mask;
}

export default fxrmc;
