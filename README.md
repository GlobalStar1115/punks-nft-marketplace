
##### Setup

> Install npm dependencies using npm install

```shell
yarn install
```

> Set up environment Variables I already Provided .env.example file.

> Create a .env file in the root directory.

> Set up required environment variables.

```.env
URL="POLYGON_TESTNET_URI"
PRIVATE_KEY="METAMASK_PRIVATE_KEY"
NEXT_PUBLIC_RPC_URL="POLYGON_TESTNET_URI"
NEXT_PUBLIC_CONTRACT_ADDRESS="CONTRACT_ADDRESS"
```

> In the Root Directory First Compile Your Smart Contract with This Following Command.

```shell
npx hardhat compile
```

> After Deploy Smart Contract to the Polygon Mumbai Testnet with this command.

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

> Copy Smart Contract Address and replace it in with your "CONTRACT_ADDRESS"

```
NEXT_PUBLIC_CONTRACT_ADDRESS="CONTRACT_ADDRESS"
```

Let's Run this command for dev

```shell
yarn dev
```