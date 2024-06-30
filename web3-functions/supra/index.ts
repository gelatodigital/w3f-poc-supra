// web3-functions/oraclesigned_multipleasset/index.ts
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { PullServiceClient } from "./PullserviceClient";
import { ORACLE_ABI } from "./ocale_abi";
import { Contract, utils } from "ethers";
import { ORACLE_PROOF } from "./oracle_proof_json";

const {Web3} = require('web3');

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider, storage } = context;

  const provider = multiChainProvider.default()

  const address = "https://rpc-testnet-dora-2.supra.com"; // Set the rest server address
  const pairIndexes = [0, 21]; // Set the pair indexes as an array
  const chainType = "evm"; // Set the chain type (evm, sui, aptos, radix)

  const client = new PullServiceClient(address);
  const contractAddress = '0xBf07a08042Bf7a61680527D06aC5F54278e0c8E5'//'0x6Cd59830AAD978446e6cc7f6cc173aF7656Fb917';

  const request = {
    pair_indexes: pairIndexes,
    chain_type: chainType,
  };
  console.log("Requesting proof for price index : ", request.pair_indexes);
  try {
    const response = await client.getProof(request);
    console.log("Proof received:", response);
    let data = await callContract(response,provider,contractAddress)
    return { canExec: true, callData:[{
      to:contractAddress,
      data:data!
    }] };
  } catch (error: any) {
    console.log(error)
    console.error("Error:", error?.response?.data);
    return { canExec: false, message: "noop" };
  }

 
});

async function callContract(response:any, provider:any,contractAddress:string) {

  const contractAbi = ORACLE_ABI // Path of your smart contract ABI


  const contract = new Contract(contractAddress,contractAbi,provider);

  const hex = response.proof_bytes;

  /////////////////////////////////////////////////// Utility code to deserialise the oracle proof bytes (Optional) ///////////////////////////////////////////////////////////////////

  const OracleProofABI =  ORACLE_PROOF; // Interface for the Oracle Proof data

  const web3 = new Web3(new Web3.providers.HttpProvider(provider.connection.url));

  
  let proof_data = web3.eth.abi.decodeParameters(OracleProofABI,hex)

  // OracleProofV2


  let pairId = []  // list of all the pair ids requested
  let pairPrice = []; // list of prices for the corresponding pair ids
  let pairDecimal = []; // list of pair decimals for the corresponding pair ids
  let pairTimestamp = []; // list of pair last updated timestamp for the corresponding pair ids

  for (let i = 0; i < proof_data[0].data.length; ++i) {

      for (let j = 0; j<proof_data[0].data[i].committee_data.length; j++) {

      pairId.push(proof_data[0].data[i].committee_data[j].committee_feed.pair.toString(10)); // pushing the pair ids requested in the output vector

      pairPrice.push(proof_data[0].data[i].committee_data[j].committee_feed.price.toString(10)); // pushing the pair price for the corresponding ids

      pairDecimal.push(proof_data[0].data[i].committee_data[j].committee_feed.decimals.toString(10)); // pushing the pair decimals for the corresponding ids requested

      pairTimestamp.push(proof_data[0].data[i].committee_data[j].committee_feed.timestamp.toString(10)); // pushing the pair timestamp for the corresponding ids requested

      }

  }

  console.log("Pair index : ", pairId);
  console.log("Pair Price : ", pairPrice);
  console.log("Pair Decimal : ", pairDecimal);
  console.log("Pair Timestamp : ", pairTimestamp);


  /////////////////////////////////////////////////// End of the utility code to deserialise the oracle proof bytes (Optional) ////////////////////////////////////////////////////////////////
   let bytes = web3.utils.hexToBytes(hex);
   

  const{data} = await contract.populateTransaction.verifyOracleProofV2(bytes); // function from you contract eg:GetPairPrice from example-contract.sol

return data

}