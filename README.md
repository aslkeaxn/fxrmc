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
