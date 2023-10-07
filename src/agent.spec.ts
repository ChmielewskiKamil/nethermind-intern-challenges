import { createTransactionEvent, HandleTransaction, ethers, TransactionEvent } from "forta-agent";
import agent, { NETHERMIND_DEPLOYER_ADDRESS } from "./agent";
import { AGENT_REGISTRY_ABI } from "./abi/agentRegistry";
import { AGENT_REGISTRY_ADDR } from "./constants";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";

const url = "http://localhost:8545";
const rpcProvider = new ethers.providers.JsonRpcProvider(url);

describe("nethermind bot creation and update monitoring agent", () => {
  let handleTransaction: HandleTransaction;
  let agentRegistry: ethers.Contract;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
    agentRegistry = new ethers.Contract(AGENT_REGISTRY_ADDR, AGENT_REGISTRY_ABI, rpcProvider);
  });

  it("should use correct nethermind deployer address", async () => {
    expect(NETHERMIND_DEPLOYER_ADDRESS).toStrictEqual("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8");
  });

  it("returns empty findings when no bot created or updated in a tx", async () => {
    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("[FORK] returns one finding for tx with bot update", async () => {
    // const tx = await rpcProvider.getTransaction("0x6f2c67182d50b9fc85b837fcff943f6f574a9b545c5903feb19671e92f7b2f1c");
    const receipt = await rpcProvider.getTransactionReceipt(
      "0x6f2c67182d50b9fc85b837fcff943f6f574a9b545c5903feb19671e92f7b2f1c"
    );

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
