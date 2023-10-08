import {
  Finding,
  FindingSeverity,
  HandleTransaction,
  FindingType,
  TransactionEvent,
  LogDescription,
} from "forta-agent";
import { EVENT_SIGS_TO_MONITOR, NETHERMIND_DEPLOYER_ADDRESS } from "./constants";

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  // Why can't I use getEvent from the interface?
  txEvent.filterLog(EVENT_SIGS_TO_MONITOR, NETHERMIND_DEPLOYER_ADDRESS).forEach((log) => {
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
