This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



### Steps of development:
1. `npx create-next-app@latest` , `npx hardhat init` -> in the blockchain dir , `pnpm install --save-dev "hardhat@^2.22.15" "@nomicfoundation/hardhat-toolbox@^5.0.0"` , 
2. Creating the smart contract, idea of the overall functions in the smart contract, defining the data structures
3. Creating the constructor, and setting the oracle inside it
4. Creating the other solidity functions - bet(), withdraw(), report()
5. Creating the hardhat tests for the smart contract, testing them, finally deploying them to the sepolia testnet - `npx hardhat run scripts/deploy.js --network sepolia` , before that do install `pnpm i dotenv`
6. Deployed contract address: `0xdBd963818848D860B76a59f7b6bbCA22EEf5F6B9` , oracle adress: `0xF2de1E3000fbD29cD227aFc3B86721987B4AF701`

7. `pnpm i ethers` - in the client dir
8. Creating the MainComp component which contains most of the ui
9. Connecting the smart contract to the client using ethers.js and also used next-themes for the dark mode