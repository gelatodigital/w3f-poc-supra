import hre from "hardhat";
import { expect } from "chai";
import { DIASignedOracleMultiple } from "../typechain";
import { before } from "mocha";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const {Web3} = require('web3');
import {
  Web3FunctionUserArgs,
  Web3FunctionResultV2,
} from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import { Contract } from "ethers";
import { ORACLE_ABI } from "../web3-functions/supra/ocale_abi";
const { ethers, deployments, w3f } = hre;

describe("Supra Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let oracle: Contract;
  let simpleW3f: Web3FunctionHardhat;
  let userArgs: {};

  before(async function () {


    [owner] = await hre.ethers.getSigners();


    const contractAbi = ORACLE_ABI // Path of your smart contract ABI

    const contractAddress = '0xBf07a08042Bf7a61680527D06aC5F54278e0c8E5'//'0x6Cd59830AAD978446e6cc7f6cc173aF7656Fb917'; // Address of your smart contract
  
    oracle = new Contract(contractAddress,contractAbi,hre.ethers.provider);



    simpleW3f = w3f.get("supra");


    userArgs = {
    };
  });

  it("canExec: true - First execution", async () => {
    let { result } = await simpleW3f.run("onRun",{ userArgs });
    result = result as Web3FunctionResultV2;
    
    console.log(result)

    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");


    const calldataPrice = result.callData[0];
    let tx =   await owner.sendTransaction({
      to: calldataPrice.to,
      data: calldataPrice.data,
       gasPrice: 160000000,
        gasLimit:30000000
       });
      await tx.wait()

  });
});
