import {
  Finding,
  FindingSeverity,
  HandleTransaction,
  FindingType,
  TransactionEvent,
  LogDescription,
} from "forta-agent";

export const NETHERMIND_DEPLOYER_ADDRESS = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  // This is not a typical Solidity signature :>
  const HARDCODED_EVENT_SIGS = [
    "event AgentUpdated(uint256 indexed agentId, address indexed by, string metadata, uint256[] chainIds)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ];
  // Why can't I use getEvent from the interface?
  // @TODO This is obv wrong, but I can't get eventFiltering to work

  txEvent.filterLog(HARDCODED_EVENT_SIGS, NETHERMIND_DEPLOYER_ADDRESS).forEach((log) => {
    findings.push(createFinding(log));
  });

  return findings;
};

export default {
  handleTransaction,
};

// Forked from @0xtaf's
// https://github.com/NethermindEth/Forta-Agents/blob/main/compound-comptroller-bot/src/finding.ts
export const createFinding = (log: LogDescription): Finding => {
  switch (log.signature) {
    case "AgentUpdated(uint256,address,string,uint256[])":
      return Finding.from({
        name: "Forta Agent has been updated",
        description: `Agent ${log.args[0]} has been updated by ${log.args[1]}`,
        alertId: "NETH-FORTA-BOT-UPDATE",
        protocol: "Forta",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: [log.address],
      });
    default:
      return Finding.from({
        name: "",
        description: "",
        alertId: "",
        protocol: "",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: [log.address],
      });
  }
};
