<script setup>
import { ethers } from "ethers";
import { ref } from "vue";
const props = defineProps(["PS", "BBTKNL", "NFTL"]);

let GoerliEvents = ref([]);
let BBitesEvents = ref([]);
let NFTEvents = ref([]);
// pubSContract - "PurchaseNftWithId"
props.PS.on("PurchaseNftWithId", (sender, id) => {
  const event = `PurchaseNftWithId from: ${sender}, id: ${id} Goerli`;
  GoerliEvents.value.unshift(event);
});

// bbitesCListener - "Transfer"
props.BBTKNL.on("Transfer", (from, to, amount) => {
  const event = `Transfer from: ${from}, to: ${to} amount: ${ethers.formatUnits(
    amount,
    18
  )} BBites Tokens Goerli`;
  BBitesEvents.value.unshift(event);
});

// nftCListener - "Transfer"
props.NFTL.on("Transfer", (from, to, tokenId) => {
  const event = `NFT Transfer - From: ${from}, to: ${to}  ${tokenId} Mumbai`;
  NFTEvents.value.unshift(event);
});

// nftCListener - "Burn"
props.NFTL.on("Burn", (sender, id) => {
  const event = `Burn  From: ${sender} with id: ${id}`;
  NFTEvents.value.unshift(event);
});
</script>

<template>
  <h2>Eventos</h2>
  <div>
    <h3>Contrato Public Sale (Goerli)</h3>
    <ul>
      <li v-for="event in GoerliEvents" :key="event">
        {{ event }}
      </li>
    </ul>
  </div>

  <div>
    <h3>Contrato BBites Token (Goerli)</h3>
    <ul>
      <li v-for="event in BBitesEvents" :key="event">
        {{ event }}
      </li>
    </ul>
  </div>

  <div>
    <h3>Contrato NFT (Mumbai)</h3>
    <ul>
      <li v-for="event in NFTEvents" :key="event">
        {{ event }}
      </li>
    </ul>
  </div>
</template>
