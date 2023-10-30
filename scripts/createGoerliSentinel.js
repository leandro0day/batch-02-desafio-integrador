require("dotenv").config();

const publicSaleAbi = require("../artifacts/contracts/PublicSale.sol/PublicSale.json");
const { SentinelClient } = require("@openzeppelin/defender-sentinel-client");
const client = new SentinelClient({
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_SECRET_KEY,
});

const main = async () => {
  const requestParameters = {
    type: "BLOCK",
    network: "goerli",
    confirmLevel: 1,
    name: "[Goerli Sentinel] Desafio Integrador",
    addresses: ["0x1aa8AD573b654E5C19Cb4570e99BD200D98683e5"],
    abi: publicSaleAbi.abi,
    paused: false,
    eventConditions: [
      {
        eventSignature: "PurchaseNftWithId(address,uint256)",
      },
    ],
    autotaskTrigger: "63c90dbc-6f8d-409e-a21c-44f65876efe9",
  };
  await client.create(requestParameters);
  const sentinels = await client.list();
  console.log(sentinels);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
