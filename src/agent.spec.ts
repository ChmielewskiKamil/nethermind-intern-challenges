import {
  HandleTransaction,
  ethers,
  TransactionEvent,
  getJsonRpcUrl,
  Finding,
  FindingType,
  FindingSeverity,
} from "forta-agent";
import agent from "./agent";
import { AGENT_REGISTRY_ABI } from "./abi/agentRegistry";
import { AGENT_REGISTRY_ADDR, NETHERMIND_DEPLOYER_ADDRESS } from "./constants";
import {
  NETHERMIND_BOT_CREATE_TX,
  NETHERMIND_BOT_ENABLE_DISABLE_TX,
  NETHERMIND_BOT_UPDATE_TX,
  NON_NETHERMIND_BOT_UPDATE_TX,
} from "./test_tx_data";
import { createTxEventFromReceipt } from "./utils";

// The following test suite does not use ganache due to personal preference.
// Instead, it uses forked anvil polygon mainnet, which caches subsequent requests.
// Polygon offers free rpc at: https://polygon-rpc.com
// 1. Spin up anvil with `anvil --fork-url https://polygon-rpc.com`
// 2. Add `"jsonRpcUrl": "http://localhost:8545"` to your forta.config.json file.
// 3. Run the test suite as you normally would `npm run test`
describe("nethermind bot creation and update monitoring agent", () => {
  const rpcProvider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
  // @TODO: Wrap this into provideHandleTransaction
  let handleTransaction: HandleTransaction;
  let agentRegistry: ethers.Contract;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
    agentRegistry = new ethers.Contract(AGENT_REGISTRY_ADDR, AGENT_REGISTRY_ABI, rpcProvider);
  });

  it("should use correct nethermind deployer address", async () => {
    expect(NETHERMIND_DEPLOYER_ADDRESS).toStrictEqual("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8");
  });

  it("returns empty findings when no bot created or updated in a tx", async () => {
    const txEvent: TransactionEvent = await createTxEventFromReceipt(
      agentRegistry,
      NETHERMIND_BOT_ENABLE_DISABLE_TX,
      rpcProvider
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toHaveLength(0);
  });

  it("returns one finding for tx with bot update", async () => {
    const txEvent: TransactionEvent = await createTxEventFromReceipt(
      agentRegistry,
      NETHERMIND_BOT_UPDATE_TX,
      rpcProvider
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Forta Agent has been updated",
        description:
          "Forta Agent 63178469883724842253811149026434419297883949962197771239560976121248185588756 has been updated by 0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8",
        alertId: "NETH-FORTA-BOT-UPDATE",
        protocol: "Forta",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: ["0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8"],
      }),
    ]);
  });

  it("should distinguish between bot creation and bot update", async () => {
    const txEvent: TransactionEvent = await createTxEventFromReceipt(
      agentRegistry,
      NETHERMIND_BOT_CREATE_TX,
      rpcProvider
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Forta Agent has been created",
        description: "Forta Agent has been created by 0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8",
        alertId: "NETH-FORTA-BOT-CREATE",
        protocol: "Forta",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: ["0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8"],
      }),
    ]);
  });

  it("should alert only when txs originate from nethermind deployer", async () => {
    const txEvent: TransactionEvent = await createTxEventFromReceipt(
      agentRegistry,
      NON_NETHERMIND_BOT_UPDATE_TX,
      rpcProvider
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });
});
