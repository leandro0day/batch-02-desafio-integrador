<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";

let account = ref();
const emit  = defineEmits(["update-account"]);
const connectToMetaMask = async () => {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        account.value = accounts[0];
        console.log("Billetera Metamask:", account.value);
        emit("update-account", account.value);
      } else {
        console.log("No se seleccionó una cuenta.");
      }
    } catch (error) {
      console.error("Error al conectar con Metamask:", error);
    }
  } else {
    console.log("Metamask no detectado en el navegador.");
  }
};
</script>

<template>
  <div>
    <h2>Log In</h2>
    <button @click="connectToMetaMask">Conectar con MetaMask</button>
    <p>
      Connectada con cuenta: <span>{{ account}}</span>
    </p>
  </div>
</template>

<style scoped></style>
