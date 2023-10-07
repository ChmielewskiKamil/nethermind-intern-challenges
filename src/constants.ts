import { ethers } from "forta-agent";
import { AGENT_REGISTRY_ABI } from "./abi/agentRegistry";

export const AGENT_REGISTRY_IFACE = new ethers.utils.Interface(AGENT_REGISTRY_ABI);
// Proxy contract address
export const AGENT_REGISTRY_ADDR = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
