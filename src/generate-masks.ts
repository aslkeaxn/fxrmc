import { Page } from "puppeteer";
import { Err } from "../types";

export async function generateMask(page: Page) {
  const generateNewMaskButton = await page.waitForSelector(
    "button ::-p-text(Generate new mask)"
  );
  if (!generateNewMaskButton) throw new Error(Err.generateMasks1);
  await generateNewMaskButton.click();

  const maskButton = await page.waitForSelector("button samp");
  if (!maskButton) throw new Error(Err.generateMasks2);
  const mask = await maskButton.evaluate((e) => e.textContent);
  if (!mask) throw new Error(Err.generateMasks3);

  return mask;
}
