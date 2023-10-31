<script setup>
import MetaMask from "./components/MetaMask.vue";
import Balance from "./components/Balance.vue";
import Approves from "./components/Approves .vue";
import BuyingInGoerli from "./components/BuyingInGoerli.vue";
import BuyingInMumbai from "./components/BuyingInMumbai.vue";
import Events from "./components/Events.vue";
import { Contract, ethers } from "ethers";

import usdcTknAbi from "../artifacts/contracts/USDCoin.sol/USDCoin.json";
import bbitesTokenAbi from "../artifacts/contracts/BBitesToken.sol/BBitesToken.json";
import publicSaleAbi from "../artifacts/contracts/PublicSale.sol/PublicSale.json";
import nftTknAbi from "../artifacts/contracts/CuyCollectionNft.sol/CuyCollectionNft.json";

import { onMounted, ref } from "vue";

let account = ref();

const updateAccount = (newAccount) => {
  account.value = newAccount;
};

let provider, signer, providerListenerBBites, providerListenerNFT;
let usdcTkContract,
  bbitesTknContract,
  pubSContract,
  nftContract,
  nftCListener,
  bbitesEvents;
let bbitesTknAdd, pubSContractAdd, usdcAddress, nftAddress;

provider = new ethers.BrowserProvider(window.ethereum);
signer = provider.getSigner(account.value);
bbitesTknAdd = "0xE255E418cd36f9F6Eae5374aABE0fB8b8D0ED302";
usdcAddress = "0x1Aaaa873cc3280DB38B94843D7642459DE2823Ea";
pubSContractAdd = "0x0970F80451890F9Cf1B68E9DF66B95e8251F133E";
providerListenerBBites = new ethers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/c1oANXqAu408URmDw9WFiymFLKsYFYn-"
);

usdcTkContract = new Contract(usdcAddress, usdcTknAbi.abi, provider);
bbitesTknContract = new Contract(bbitesTknAdd, bbitesTokenAbi.abi, provider);
bbitesEvents = new Contract(
  bbitesTknAdd,
  bbitesTokenAbi.abi,
  providerListenerBBites
);
pubSContract = new Contract(pubSContractAdd, publicSaleAbi.abi, provider);

providerListenerNFT = new ethers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/CplTokNbDbof1k5DSmAIxYIqW_DOe2rM"
);
nftAddress = "0x0643Bfa31a2041D580d22B505e019448d576c186";

nftContract = new Contract(nftAddress, nftTknAbi.abi, provider);
nftCListener = new Contract(
  nftAddress,
  nftTknAbi.abi,
  providerListenerNFT
);

onMounted(() => {
  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });
});
</script>

<template>
  <MetaMask @update-account="updateAccount"></MetaMask>
  <h2>Balances de USDC y BBTKN</h2>
  <Balance
    :USDC="usdcTkContract"
    :BBTKN="bbitesTknContract"
    :account="account"
  ></Balance>
  <h2>Approves (USDC y BBToken) en Goerli</h2>
  <Approves
    :USDC="usdcTkContract"
    :BBTKN="bbitesTknContract"
    :PSaddress="pubSContractAdd"
    :USDCaddress="usdcAddress"
    :provider="provider"
    :account="account"
  ></Approves>
  <BuyingInGoerli
    :USDC="usdcTkContract"
    :BBTKN="bbitesTknContract"
    :PSaddress="pubSContractAdd"
    :USDCaddress="usdcAddress"
    :provider="provider"
    :PS="pubSContract"
    :account="account"
  ></BuyingInGoerli>
  <BuyingInMumbai
    :NFT="nftContract"
    :provider="provider"
    :account="account"
  ></BuyingInMumbai>
  <Events
    :BBTKNL="bbitesEvents"
    :PS="pubSContract"
    :NFTL="nftCListener"
  ></Events>
</template>

<style scoped></style>
