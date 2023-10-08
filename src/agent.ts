import { Finding, FindingSeverity, HandleTransaction, FindingType } from "forta-agent";

export const NETHERMIND_DEPLOYER_ADDRESS = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  // const HARDCODED_EVENT_SIG = "event AgentUpdated(uint256,address,string,uint256[])";
  // Why can't I use getEvent from the interface?
  const fortaBotUpdateEvents = txEvent.logs;

  fortaBotUpdateEvents.forEach((updateEvent) => {
    findings.push(
      Finding.fromObject({
        name: "Nethermind Deployer - Bot Update",
        description: "Nethermind Deployer has updated a Forta bot",
        alertId: "NETH-FORTA-BOT-UPDATE",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
      })
    );
  });
  return findings;
};

export default {
  handleTransaction,
};
