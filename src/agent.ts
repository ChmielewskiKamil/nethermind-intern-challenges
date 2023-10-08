import {
  Finding,
  FindingSeverity,
  HandleTransaction,
  FindingType,
  TransactionEvent,
  LogDescription,
} from "forta-agent";
import { NETHERMIND_DEPLOYER_ADDRESS } from "./constants";

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  // This is not a typical Solidity signature :>
  const HARDCODED_EVENT_SIGS = [
    "event AgentUpdated(uint256 indexed agentId, address indexed by, string metadata, uint256[] chainIds)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ];

  // Why can't I use getEvent from the interface?
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
    case "Transfer(address,address,uint256)":
      return Finding.from({
        name: "Forta Agent has been created",
        description: `Forta Agent has been created by ${log.args[1]}`,
        alertId: "NETH-FORTA-BOT-CREATE",
        protocol: "Forta",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: [log.address],
      });
    default:
      return Finding.from({
        name: "Forta Agent has been updated",
        description: `Forta Agent ${log.args[0]} has been updated by ${log.args[1]}`,
        alertId: "NETH-FORTA-BOT-UPDATE",
        protocol: "Forta",
        type: FindingType.Info,
        severity: FindingSeverity.Info,
        metadata: {},
        addresses: [log.address],
      });
  }
};
