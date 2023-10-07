import { NETHERMIND_DEPLOYER_ADDRESS } from "./agent";

describe("nethermind bot creation and update monitoring agent", () => {
  it("should use correct nethermind deployer address", async () => {
    expect(NETHERMIND_DEPLOYER_ADDRESS).toStrictEqual("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8");
  });
});
