## Description

This library allows the automatic generation of mozilla relay masks given a Mailnesia mailbox.

To programmatically query the returned Mailnesia mailbox, you can use my [mailnesia](https://www.npmjs.com/package/mailnesia) library.

## Type Definitions

```javascript
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
    RM = "Couldn't retrieve mask"
}

function createFxRelayMask(config?: {
    mailbox?: string;
    password?: string;
}): Promise<{
    mailbox: string;
    email: string;
    password: string;
    mask: string;
}>;
```

## Usage

```javascript
import fxrgen from "fxrgen";

fxrgen.createFxRelayMask().then(({ mailbox, email, password, mask }) => {
  // ...
});
```
