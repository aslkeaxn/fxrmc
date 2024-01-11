import { Page } from "puppeteer";
import { Err, Mailbox } from "../types";


export async function createAccount(
  page: Page,
  mailbox: Mailbox,
  password: string
) {
  await page.goto("https://relay.firefox.com/");

  const signUpButton = await page.waitForSelector("a ::-p-text(Sign Up)");
  if (!signUpButton) throw new Error(Err.createAccount1);
  await signUpButton.click();

  await page.locator("input").fill(mailbox.mailbox);

  const signUpOrSignInButton = await page.waitForSelector(
    "button ::-p-text(Sign up or sign in)"
  );
  if (!signUpOrSignInButton) throw new Error(Err.createAccount2);
  await signUpOrSignInButton.click();

  await page.locator("#password").fill(password);
  await page.locator("#vpassword").fill(password);
  const age = Math.floor(Math.random() * (60 - 18 + 1)) + 18;
  await page.locator("#age").fill(`${age}`);

  const createAccountButton = await page.waitForSelector("#submit-btn");
  if (!createAccountButton) throw new Error(Err.createAccount3);
  await createAccountButton.click();
}
