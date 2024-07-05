How to use web3 Functions to update On-Chain prices with Supra
===============

Gelato Web3 Functions together with Supra offer the ability to create fine-tuned customized oracles getting and pushing prices on-chain following predefined logic within the Web3 Function and verifying prices on-chain through the Supra network.

In this repository, you will find the following demo here:

[W3F to Supra](https://github.com/gelatodigital/w3f-poc-supra/tree/main/web3-functions/supra): this demo directly interacts with the supra network.


> [!NOTE]
> The gelato fees are payed with [1Balance](https://docs.gelato.network/developer-services/1balance). 
> 1Balance allows to deposit USDC on polygon and run the transactions on every network.

Supra: Logic
---------------

- `PullserviceClient.ts`:
The provided code defines and utilizes the PullServiceClient class within a Web3 function to interact with an oracle service. The Web3 function requests proof data for specific asset price indexes from the oracle. The PullServiceClient sends a request to the oracle's rpc and retrieves the proof data. This proof data is then used to call a smart contract function `verifyOracleProofV2` from `callContract` function on the blockchain to verify the authenticity and integrity of the received data.

- Oracle contract address has been hard-coded in the script as:
```ts
const contractAddress = '0xBf07a08042Bf7a61680527D06aC5F54278e0c8E5' //'0x6Cd59830AAD978446e6cc7f6cc173aF7656Fb917';
```
However, you can also specify the contract address in the `userArgs.json` file for flexibility.
This contract is a proxy linked directly to the oracle's contract, allowing you to call the necessary functions to verify the oracle proof data. 

```ts
const response = await client.getProof(request);
console.log("Proof received:", response);
let data = await callContract(response,provider,contractAddress)
return { canExec: true, callData:[{
    to:contractAddress,
    data:data!
}] };
```

- `async function callContract(response:any, provider:any,contractAddress:string)`
The callContract function is responsible for interacting with a smart contract to verify the oracle proof data received from the oracle service. This function ensures that the oracle proof data is correctly processed and ready for verification by the smart contract, let's break it down:
    - Decode Proof Data: The proof data, which is in hex format, is decoded using Web3's ABI decoding methods to extract detailed information such as pair IDs, prices, decimals, and timestamps.
    - Convert Hex to Bytes: The hex-encoded proof data is converted into bytes format.
    - Return Call Data: Finally, it returns the prepared call data to be executed on the blockchain.

- `verifyOracleProofV2`
```ts
    function verifyOracleProofV2(bytes[] calldata _bytesProof) external;
```
In the following demo, we will utilize the `verifyOracleProofV2` method. This method is essential for verifying the authenticity and integrity of data provided by an oracle before it is used in our blockchain application. By using `verifyOracleProofV2`, we ensure that the data has not been tampered with and is sourced from a reliable oracle, thus maintaining the security and trustworthiness of our decentralized system.


Demo W3F: Supra Contract
---------------

Live on Abitrum Sepolia
- Web3 Function: [https://app.gelato.network/functions/task/0xd8adfbc9adc99c251098bb12f1dea4cfa933420936cfafd57022d7624467ccfd:421614](https://app.gelato.network/functions/task/0xd8adfbc9adc99c251098bb12f1dea4cfa933420936cfafd57022d7624467ccfd:421614)

- DedicatedMsgSender [https://sepolia.arbiscan.io/address/0xbb97656cd5fece3a643335d03c8919d5e7dcd225](https://sepolia.arbiscan.io/address/0xbb97656cd5fece3a643335d03c8919d5e7dcd225)

Development
---------------

### Testing

> [!WARNING]
> Contracts are not audited by a third-party. Please use at your own discretion.

1. Install project dependencies:
```
yarn install
```

2. Create a `.env` file with your private config:
```
cp .env.example .env
```
You will need to input your `PROVIDER_URL`, your RPC.


3. Test the  web3 function

```
npx hardhat w3f-run supra --logs
```

### Deployment

1. Deploy the web3 function on IPFS

```
npx hardhat w3f-deploy supra
```

2. Create the task following the link provided when deploying the web3 to IPFS in our case:

```
 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmNquxsJCABNf1AvQSKGJLdcqis4kpfxYxVx6Bocneb2hP

To create a task that runs your Web3 Function every minute, visit:
> https://app.gelato.network/new-task?cid=QmNquxsJCABNf1AvQSKGJLdcqis4kpfxYxVx6Bocneb2hP
```


### W3F command options

- `--logs` Show internal Web3Function logs
- `--runtime=thread|docker` Use thread if you don't have dockerset up locally (default: thread)
- `--debug` Show Runtime debug messages
- `--chain-id=number` Specify the chainId (default is Sepolia: 11155111)

Example: `npx hardhat w3f-run supra --logs --debug`