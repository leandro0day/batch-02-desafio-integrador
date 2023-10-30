require("dotenv").config();

const cuyCollectionAbi = require("../artifacts/contracts/CuyCollectionNft.sol/CuyCollectionNft.json");
const { SentinelClient } = require("@openzeppelin/defender-sentinel-client");
const client = new SentinelClient({
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_SECRET_KEY,
});

const main = async () => {
  const requestParameters = {
    type: "BLOCK",
    network: "mumbai",
    confirmLevel: 1,
    name: "[Mumbai Sentinel] Desafio Integrador",
    addresses: ["0xb9a68eAeaCF274Ed1a4Eb94d82355258A0cE6e6a"],
    abi: cuyCollectionAbi.abi,
    paused: false,
    eventConditions: [
      {
        eventSignature: "Burn(address,uint256)",
      },
    ],
    autotaskTrigger: "4025acf4-5ed7-4975-bcbf-5289ccd3cbda",
  };
  await client.create(requestParameters);
  const sentinels = await client.list();
  console.log(sentinels);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
