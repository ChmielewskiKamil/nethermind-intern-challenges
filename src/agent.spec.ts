import { createTransactionEvent, HandleTransaction, ethers, TransactionEvent, getJsonRpcUrl } from "forta-agent";
import agent, { NETHERMIND_DEPLOYER_ADDRESS } from "./agent";
import { AGENT_REGISTRY_ABI } from "./abi/agentRegistry";
import { AGENT_REGISTRY_ADDR } from "./constants";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { NETHERMIND_BOT_ENABLE_DISABLE_TX, NETHERMIND_BOT_UPDATE_TX } from "./test_tx_data";

describe("nethermind bot creation and update monitoring agent", () => {
  // @TODO: Move this part to NetworkManager and later to initialise function
  const rpcProvider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
  // @TODO: Wrap this into provideHandleTransaction
  let handleTransaction: HandleTransaction;
  // @TODO: Move this to initialise function
  let agentRegistry: ethers.Contract;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
    // @TODO This should be moved to initialisation
    agentRegistry = new ethers.Contract(AGENT_REGISTRY_ADDR, AGENT_REGISTRY_ABI, rpcProvider);
  });

  it("should use correct nethermind deployer address", async () => {
    expect(NETHERMIND_DEPLOYER_ADDRESS).toStrictEqual("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8");
  });

  it("returns empty findings when no bot created or updated in a tx", async () => {
    const receipt = await rpcProvider.getTransactionReceipt(NETHERMIND_BOT_ENABLE_DISABLE_TX);
    let sender = receipt.from;
    let parsedLog = agentRegistry.interface.parseLog(receipt.logs[0]);
    let inputs = parsedLog.args;
    let eventFragment = parsedLog.eventFragment;

    const txEvent = new TestTransactionEvent().addEventLog(eventFragment, sender, inputs);
    const findings = await handleTransaction(txEvent);
    expect(findings).toHaveLength(0);
  });

  it("[FORK] returns one finding for tx with bot update", async () => {
    // @TODO Move hardcoded hashed to one file and explain them there
    const receipt = await rpcProvider.getTransactionReceipt(NETHERMIND_BOT_UPDATE_TX);

    let sender = receipt.from;
    let parsedLog = agentRegistry.interface.parseLog(receipt.logs[0]);
    let inputs = parsedLog.args;
    let eventFragment = parsedLog.eventFragment;

    const txEvent: TransactionEvent = new TestTransactionEvent()
      // Documentation about addEventLog is incorrect,
      // addEventLog calls Ethers#encodeEventLog internally
      // https://github.com/NethermindEth/general-agents-module/blob/ba7d309ef618b4afc65514a02469792a7168ebaf/src/test/test_transaction_event.ts#L98
      // It's implementation https://github.com/ethers-io/ethers.js/blob/06db04082278a2d7d6fbde925976356c95281891/src.ts/abi/interface.ts#L1071-L1088
      // Uses assert to check if the length of arguments === length of inputs
      // if not, it reverts
      // When you pass EventFragment, the inputs are mandatory because of the argument/value mismatch
      .addEventLog(eventFragment, sender, inputs);

    const findings = await handleTransaction(txEvent);
    expect(findings).toHaveLength(1);
  });
});
