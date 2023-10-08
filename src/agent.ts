import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { EVENT_SIGS_TO_MONITOR, NETHERMIND_DEPLOYER_ADDRESS } from "./constants";
import { createFinding } from "./utils";

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
