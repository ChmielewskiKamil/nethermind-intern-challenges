import { Finding, HandleTransaction, TransactionEvent, Initialize, getEthersProvider } from "forta-agent";
import { EVENT_SIGS_TO_MONITOR } from "./constants";
import { providers } from "ethers";
import { NetworkManager } from "forta-agent-tools";
import { createFinding, NetworkData } from "./utils";
import CONFIG from "./agent.config";

const networkManager = new NetworkManager<NetworkData>(CONFIG);

// Asynchronous initialization handler, usefull for fetching data from APIs
// Is it run automatically when the bot is deployed?
// This pattern is mentioned in the best practices also most of the bots use it.
const provideInitialize = (networkManager: NetworkManager<NetworkData>, provider: providers.Provider): Initialize => {
  return async () => {
    await networkManager.init(provider);
  };
};

export const provideHandleTransaction = (networkManager: NetworkManager<NetworkData>): HandleTransaction => {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    /* @audit-issue If the deployer interacts with different contract that emits the same event signature,
     * it will trigger an alert. It is not a correct behaviour. */
    // Why can't I use getEvent from the interface?
    txEvent.filterLog(EVENT_SIGS_TO_MONITOR, networkManager.get("nethermindDeployerAddress")).forEach((log) => {
      findings.push(createFinding(log));
    });

    return findings;
  };
};

export default {
  provideInitialize: provideInitialize(networkManager, getEthersProvider()),
  handleTransaction: provideHandleTransaction(networkManager),
};
