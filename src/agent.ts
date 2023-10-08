import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { EVENT_SIGS_TO_MONITOR, NETHERMIND_DEPLOYER_ADDRESS } from "./constants";
import { createFinding } from "./utils";

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  /* @audit-issue If the deployer interacts with different contract that emits the same event signature,
   * it will trigger an alert. It is not a correct behaviour. */
  // Why can't I use getEvent from the interface?
  txEvent.filterLog(EVENT_SIGS_TO_MONITOR, NETHERMIND_DEPLOYER_ADDRESS).forEach((log) => {
    findings.push(createFinding(log));
  });

  return findings;
};

export default {
  handleTransaction,
};
