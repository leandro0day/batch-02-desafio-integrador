<script setup>
import { ethers } from "ethers";
import { ref } from "vue";

// APPROVE BBTKN

let approveInput = ref();
let approveError;

const approveButtonBBTkn = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    if (approveInput.value == 0) {
      return (approveError.innerText = "Introduce un numero");
    }
    const tx = await props.BBTKN.connect(signer).approve(
      props.PSaddress,
      approveInput.value.trim() + "000000000000000000"
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash", transactionHash);
  } catch (error) {
    console.error("Error al hacer el BBTkn approve:", error.message);
  }
};
// APPROVE USDC
let approveInputUSDC = ref();
let approveErrorUSDC;

const approveButtonUSDC = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    if (approveInputUSDC.value == 0) {
      return (approveErrorUSDC.innerText = "Introduce un numero");
    }
    const tx = await props.USDC.connect(signer).approve(
      props.PSaddress,
      approveInputUSDC.value.trim() + "000000"
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash APPROVE USDC ", transactionHash);
  } catch (error) {
    console.error("Error al hacer el USDC approve:", error.message);
  }
};

const props = defineProps([
  "USDC",
  "BBTKN",
  "PSaddress",
  "provider",
  "USDCaddress",
  "account",
]);
</script>

<template>
  <div>
    <label>Approve BBites Token a Public Sale</label>
    <input
      v-model="approveInput"
      type="text"
      placeholder="# BBtokens to approve"
    />
    <button @click="approveButtonBBTkn">Approve</button>
    <span id="approveError" style="color: red"></span>
  </div>

  <div>
    <label>Approve USDC a Public Sale</label>
    <input
      v-model="approveInputUSDC"
      type="text"
      placeholder="# USDC to approve"
    />
    <button @click="approveButtonUSDC">Approve</button>
    <span style="color: red"></span>
  </div>
</template>
