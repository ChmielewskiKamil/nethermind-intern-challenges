import { ethers, Finding, FindingSeverity, FindingType, LogDescription, TransactionEvent } from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";

/**
 * @dev Utility function usefull for interacting with the on-chain data. Given that you have the transaction hash,
 *      you can easily create a TransactionEvent, that will be used in your tests. It returns a promise,
 *      so you have to await it.
 */
export const createTxEventFromReceipt = async (
  contract: ethers.Contract,
  txHash: string,
  rpcProvider: ethers.providers.JsonRpcProvider
): Promise<TransactionEvent> => {
  const receipt = await rpcProvider.getTransactionReceipt(txHash);
  let sender = receipt.from;
  // @TODO: This should probably dynamically select logs to parse
  // or even better parse all of them
  let parsedLog = contract.interface.parseLog(receipt.logs[0]);
  let inputs = parsedLog.args;
  let eventFragment = parsedLog.eventFragment;

  const txEvent: TransactionEvent = new TestTransactionEvent()
    // Documentation about addEventLog is incorrect,
    // addEventLog calls Ethers#encodeEventLog internally
    // https://github.com/NethermindEth/general-agents-module/blob/ba7d309ef618b4afc65514a02469792a7168ebaf/src/test/test_transaction_event.ts#L98
    // It's implementation https://github.com/ethers-io/ethers.js/blob/06db04082278a2d7d6fbde925976356c95281891/src.ts/abi/interface.ts#L1071-L1088
    // Uses assert to check if the length of arguments === length of inputs
    // if not, it reverts
    // When you pass EventFragment, the inputs are mandatory because of the argument/value mismatch
    .addEventLog(eventFragment, sender, inputs);

  return txEvent;
};

/**
 * @dev   Not to be used in testing! In case this is incorrect, you won't be able to catch the bug.
 *        The idea is taken from @0xtaf's compound-comprtoller-bot:
 *        https://github.com/NethermindEth/Forta-Agents/blob/main/compound-comptroller-bot/src/finding.ts
 * @param log Provide it with the log that you will get from the `filterLog` function.
 *        It will match the log signature and create the appropriate finding.
 */
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

export interface NetworkData {
  nethermindDeployerAddress: string;
}

export type AgentConfig = Record<number, NetworkData>;
