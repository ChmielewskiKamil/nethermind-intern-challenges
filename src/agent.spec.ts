import { createTransactionEvent, HandleTransaction } from "forta-agent";
import agent, { NETHERMIND_DEPLOYER_ADDRESS } from "./agent";

describe("nethermind bot creation and update monitoring agent", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("should use correct nethermind deployer address", async () => {
    expect(NETHERMIND_DEPLOYER_ADDRESS).toStrictEqual("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8");
  });

  it("returns empty findings when no bot created or updated in a tx", async () => {
    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });
});
