## Installation

```
npm i osecmail fxrmc
```

## Usage

Use `osecmail` to generate a 1secmail email, then call `fxrmc` to generate a mask for it.

## Type Definitions

```typescript
function fxrmc(
  osecmailEmail: string,
  password: string,
  options?: PuppeteerLaunchOptions
): Promise<string>;
```
