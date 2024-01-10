import puppeteer, { Browser, Page } from "puppeteer";
import { v4 } from "uuid";
import mailnesia from "mailnesia-api";
import * as cheerio from "cheerio";

enum Err {
  SUB = "Couldn't find sign up button",
  ESB = "Couldn't find email submit button",
  PASB = "Couldn't find password and age submit button",
  FCE = "Couldn't fetch confirmation email",
  PCC = "Couldn't parse confirmation code",
  MVCE = "Couldn't find mozilla verification code email",
  CCSB = "Couldn't find confirmation code submit button",
  SB = "Couldn't find skip button",
  GMB = "Couldn't find generate mask button",
  MC = "Couldn't locate new mask container",
  RM = "Couldn't retrieve mask",
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function initialiseMailbox(config?: {
  mailbox?: string;
  password?: string;
}) {
  const mailbox = config?.mailbox || `${v4().replace(/[-]/g, "").slice(0, -2)}`;
  const password = config?.password || "Relay*123456";
  const email = `${mailbox}@mailnesia.com`;

  return { mailbox, email, password };
}

async function openBrowser() {
  const browser = await puppeteer.launch({ headless: "new" });
  return browser;
}

async function openFirefoxRelayWebsite(browser: Browser) {
  const pages = await browser.pages();
  const fxr = pages[0];
  await fxr.goto("https://relay.firefox.com/");

  return fxr;
}

async function navigateToSignUpPage(fxrLandingPage: Page) {
  const signUpButton = await fxrLandingPage.waitForSelector(
    "a ::-p-text(Sign In)"
  );

  if (!signUpButton) {
    throw new Error(Err.SUB);
  }

  signUpButton.click();
}

async function submitEmail(fxrEmailPage: Page, email: string) {
  await fxrEmailPage.locator("input").fill(`${email}`);
  const signUpButton = await fxrEmailPage.waitForSelector(
    "button ::-p-text(Sign up or sign in)"
  );

  if (!signUpButton) {
    throw new Error(Err.ESB);
  }

  signUpButton.click();
}

async function submitPasswordAndAge(
  fxrPasswordAgePage: Page,
  password: string
) {
  await fxrPasswordAgePage.locator("#password").fill(password);
  await fxrPasswordAgePage.locator("#vpassword").fill(password);
  await fxrPasswordAgePage.locator("#age").fill(`18`);

  const submitButton = await fxrPasswordAgePage.waitForSelector("#submit-btn");

  if (!submitButton) {
    throw new Error(Err.PASB);
  }

  submitButton.click();
}

async function getConfirmationCode(mailbox: string) {
  let i = 0;

  while (i < 5) {
    i++;
    await sleep(5000);

    const emails = await mailnesia.getInbox(mailbox);

    if (emails.length === 0) {
      continue;
    }

    const mozillaEmails = emails.filter((email) => {
      return (
        email.from === "Mozilla <accounts@firefox.com>" &&
        email.subject === "Confirm your account"
      );
    });

    if (mozillaEmails.length === 0) {
      continue;
    }

    const codeEmailId = emails[0].id;
    const codeEmail = await mailnesia.getMessage(mailbox, codeEmailId);

    if (!codeEmail) {
      throw new Error(Err.FCE);
    }

    const $ = cheerio.load(codeEmail.text);
    const text = $.text();
    const codeRegex = text.match(/\d{6}/g);

    if (!codeRegex) {
      throw new Error(Err.PCC);
    }

    const code = codeRegex[0];

    return code;
  }

  throw new Error(Err.MVCE);
}

async function submitConfirmationCode(
  fxrConfirmationCodePage: Page,
  code: string
) {
  await fxrConfirmationCodePage.locator("#otp-code").fill(`${code}`);
  const submitButton = await fxrConfirmationCodePage.waitForSelector(
    "#submit-btn"
  );

  if (!submitButton) {
    throw new Error(Err.CCSB);
  }

  submitButton.click();
}

async function generateMask(fxrNewAccountPage: Page) {
  const skipButton = await fxrNewAccountPage.waitForSelector(
    "button ::-p-text(Skip)"
  );

  if (!skipButton) {
    throw new Error(Err.SB);
  }

  skipButton.click();

  const maskButton = await fxrNewAccountPage.waitForSelector(
    "button ::-p-text(Generate new mask)"
  );

  if (!maskButton) {
    throw new Error(Err.GMB);
  }

  maskButton.click();
}

async function getMask(fxrNewAccountPage: Page) {
  const emailButton = await fxrNewAccountPage.waitForSelector(
    "samp ::-p-text(@mozmail.com)"
  );

  if (!emailButton) {
    throw new Error(Err.MC);
  }

  const mask = await emailButton.evaluate((e) => e.textContent);

  if (!mask) {
    throw new Error(Err.RM);
  }

  return mask;
}

async function createFxRelayMask(config?: {
  mailbox?: string;
  password?: string;
}) {
  console.log("Initialising mailbox...");
  const { mailbox, email, password } = await initialiseMailbox(config);

  console.log("Starting headless puppeteer browser...");
  const browser = await openBrowser();

  console.log("Navigating to Firefox Relay...");
  const fxr = await openFirefoxRelayWebsite(browser);

  console.log("Navigating to sign up page");
  await navigateToSignUpPage(fxr);

  console.log("Submitting email...");
  await submitEmail(fxr, email);

  console.log("Submitting password and age...");
  await submitPasswordAndAge(fxr, password);

  console.log("Retrieving confirmation code...");
  const code = await getConfirmationCode(mailbox);

  console.log("Submitting confirmation code...");
  await submitConfirmationCode(fxr, code);

  console.log("Generating mask...");
  await generateMask(fxr);

  console.log("Retrieving mask...");
  const mask = await getMask(fxr);

  await fxr.close();
  await browser.close();

  return { mailbox, email, password, mask };
}

const fxrmc = {
  createFxRelayMask,
  Err,
};

export default fxrmc;
