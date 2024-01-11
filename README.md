## Type Definitions

```typescript
function fxrmc(
  mailbox: Mailbox,
  password: string,
  headless: false | "new"
): Promise<string>;

interface Mailbox {
  mailbox: string;
  countFirefoxMessages: (firefoxDomain: string) => Promise<number>;
  getLatestFirefoxMessageText: (firefoxDomain: string) => Promise<string>;
}
```
