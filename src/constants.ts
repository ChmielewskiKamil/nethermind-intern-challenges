import { ethers } from "forta-agent";
import { AGENT_REGISTRY_ABI } from "./abi/agentRegistry";

export const AGENT_REGISTRY_IFACE = new ethers.utils.Interface(AGENT_REGISTRY_ABI);
// Proxy contract address
export const AGENT_REGISTRY_ADDR = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const NETHERMIND_DEPLOYER_ADDRESS = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";

// Would love to use the interface instead of hardcoding this,
// but can't get the `getEvent` function to work with `filterLog`
export const EVENT_SIGS_TO_MONITOR = [
  "event AgentUpdated(uint256 indexed agentId, address indexed by, string metadata, uint256[] chainIds)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];
