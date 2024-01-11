import { Page } from "puppeteer";
import { Err } from "../types";

export async function verifyAccount(page: Page, code: string) {
  await page.locator("#otp-code").fill(code);

  const confirmButton = await page.waitForSelector("#submit-btn");
  if (!confirmButton) throw new Error(Err.verifyAccount1);
  await confirmButton.click();
}
