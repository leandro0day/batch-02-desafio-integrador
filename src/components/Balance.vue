<script setup>
import { ethers } from "ethers";
import { ref } from "vue";

let balance = ref();
const balanceOf = async () => {
  try {
    console.log(props.account)
    const usdcBalance = ref();
    usdcBalance.value = await props.USDC.balanceOf(props.account);
    console.log("Your USDC balance is:", usdcBalance.value);
    balance.value = ethers.formatUnits(usdcBalance.value, 6);
  } catch (error) {
    console.error("Error al obtener el balance de USDC:", error.message);
  }
};

let Bbites = ref();
const bbitesTknBalance = async () => {
  try {
    const BbitesBalance = ref();
    BbitesBalance.value = await props.BBTKN.balanceOf(props.account);
    console.log("Your BBTKN balance is", BbitesBalance);
    Bbites.value = ethers.formatUnits(BbitesBalance.value, 18);
  } catch (error) {
    console.error("Error  obtener el balance de BBTKN:", error.message);
  }
};

const props = defineProps(["USDC", "BBTKN", "account"]);
</script>

<template>
  <div>
    <label>USD Coin Balance:</label>
    <span>{{ balance }}</span>
    <button @click="balanceOf">Refresh</button>
  </div>
  
  <div>
    <label>BBites Token Balance:</label>
    <span>{{ Bbites }}</span>
    <button @click="bbitesTknBalance">Refresh</button>
  </div>
</template>
