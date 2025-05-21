# @winwinkit/sdk

## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @winwinkit/sdk
```

### PNPM

```bash
pnpm add @winwinkit/sdk
```

### Bun

```bash
bun add @winwinkit/sdk
```

### Yarn

```bash
yarn add @winwinkit/sdk
```

## SDK Example Usage

### Example

```typescript
import { WinWinKit } from 'winwinkit'

const wwk = new WinWinKit({
  apiKey: process.env['WINWINKIT_API_KEY'] ?? '',
})

// Create or update user.
const user = await wwk.createOrUpdateUser({
  appUserId: "821fae4b5-1a2d-4c1e-9152-5297086a161c"
})

...

// Fetch user
const user = await wwk.fetchUser({
  appUserId: "821fae4b5-1a2d-4c1e-9152-5297086a161c"
})

...

// Claim referral code
const { user, rewardsGranted } = await wwk.claimReferralCode({ 
  appUserId: "821fae4b5-1a2d-4c1e-9152-5297086a161c",
  code: "XYZ123"
})

...

// Withdraw credits
const { user, withdrawResult } = await wwk.withdrawCredits({ 
  appUserId: "821fae4b5-1a2d-4c1e-9152-5297086a161c",
  key: "key",
  amount: 10
})

...

// Fetch offer code
const { offerCode, subscription } = await wwk.fetchOfferCode({ 
  offerCodeId: "123e4567-e89b-12d3-a456-426614174000",
})
```
