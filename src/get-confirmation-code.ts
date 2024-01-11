import { firefoxDomain } from "../constants";
import { Err } from "../types";
import { Mailbox } from "../types";
import { sleep } from "./sleep";

export async function getConfirmationCode(
  mailbox: Mailbox,
  originalRelayMailCount: number
) {
  let i = 0;

  while (i < 10) {
    i++;
    await sleep(5000);

    const relayMailCount = await mailbox.countFirefoxMessages(firefoxDomain);
    if (relayMailCount === originalRelayMailCount) continue;

    const text = await mailbox.getLatestFirefoxMessageText(firefoxDomain);
    const matches = text.match(/\b\d{6}\b/);
    if (!matches) throw new Error(Err.getConfirmationCode1);
    if (matches.length === 0) throw new Error(Err.getConfirmationCode2);
    const code = matches[0];

    return code;
  }

  throw new Error(Err.getConfirmationCode3);
}
