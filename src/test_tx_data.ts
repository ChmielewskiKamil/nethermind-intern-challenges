// https://polygonscan.com/tx/0xc6a4f95f3bab231a7422f4c2424645104e81de1415c07fc7538cbdb4b8dfa97b
// This is a TX originating from the Nethermind deployer that:
// - Updates the Forta Bot
export const NETHERMIND_BOT_UPDATE_TX = "0xc6a4f95f3bab231a7422f4c2424645104e81de1415c07fc7538cbdb4b8dfa97b";

// https://polygonscan.com/tx/0x1f63262d5d114b92cee2ff38bd242ca383d65f17dcf23e2858f3c18e2ba253d6
// This is a TX originating from the Nethermind deployer that:
// - DOES NOT update the Forta Bot
// - It Enables/Disables the Forta Bot
export const NETHERMIND_BOT_ENABLE_DISABLE_TX = "0x1f63262d5d114b92cee2ff38bd242ca383d65f17dcf23e2858f3c18e2ba253d6";

// https://polygonscan.com/tx/0x4d4c1a71122050441129c656cc7c239753b3cbc278d1850a9a8a7c745818addc
// This is a TX originating from the Nethermind deployer that:
// - Creates the Forta Bot
export const NETHERMIND_BOT_CREATE_TX = "0x4d4c1a71122050441129c656cc7c239753b3cbc278d1850a9a8a7c745818addc";

// https://polygonscan.com/tx/0x6f2c67182d50b9fc85b837fcff943f6f574a9b545c5903feb19671e92f7b2f1c
// This is a TX that DOES NOT originate from the Nethermind deployer that:
// - Updates the Forta Bot
export const NON_NETHERMIND_BOT_UPDATE_TX = "0x6f2c67182d50b9fc85b837fcff943f6f574a9b545c5903feb19671e92f7b2f1c";

// https://polygonscan.com/tx/0xa201c72c280e7bc0babc0eb55af9b90208c10df3a52b88e31f29fca2212a679c
// This is a TX originating from the Nethermind deployer that:
// - DOES NOT interact with the Agent Registry contract
// - BUT emits the same Transfer event signature as the Agent Registry contract
export const NETHERMIND_NON_AGENT_REGISTRY_TX = "0xa201c72c280e7bc0babc0eb55af9b90208c10df3a52b88e31f29fca2212a679c";
