<script setup>
import { ethers } from "ethers";
import { ref } from "vue";

// purchaseWithTokens
let purchaseInput = ref();
let purchaseError;
const purchaseButton = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.PS.connect(signer).purchaseWithTokens(
      purchaseInput.value
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash purchaseWithTokens", transactionHash);
  } catch (error) {
    console.log(error.message);
  }
};

// purchaseWithUSDC
let amountInUSDCInput = ref();
let purchaseInputUSDC = ref();
let purchaseErrorUSDC;

const purchaseButtonUSDC = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.PS.connect(signer).purchaseWithUSDC(
      purchaseInputUSDC.value,
      amountInUSDCInput.value + "000000"
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash purchaseWithUSDC", transactionHash);
  } catch (error) {
    console.log(error.message);
  }
};

// purchaseWithEtherAndId

let purchaseInputEtherId = ref();
let purchaseEtherIdError;

const purchaseButtonEtherId = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.PS.connect(signer).purchaseWithEtherAndId(
      purchaseInputEtherId.value,
      {
        value: ethers.parseEther("0.01"),
      }
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash", transactionHash);
  } catch (error) {
    console.log(error);
  }
};

// send Ether

let sendEtherError;
const sendEtherButton = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.PS.connect(signer).depositEthForARandomNft({
      value: ethers.parseEther("0.01"),
    });
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash", transactionHash);
  } catch (error) {
    console.log(error.message);
  }
};

// getPriceForId
let priceNftIdInput = ref();
let getPriceNftError = document.getElementById("getPriceNftError");

let showPrice = ref(false);
let price = ref();

const getPriceNftByIdBttn = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.PS.connect(signer).getPriceForId(
      priceNftIdInput.value
    );
    const NFTvalue = tx / BigInt(1 * 10 ** 18);
    console.log(NFTvalue);
    price.value = `El precio del NFT: ${priceNftIdInput.value} es de: ${NFTvalue}.0`;
    showPrice.value = true
  } catch (error) {
    console.log(error.message);
  }
};
const props = defineProps([
  "USDC",
  "BBTKN",
  "PSaddress",
  "provider",
  "USDCaddress",
  "PS",
  "account",
]);
</script>

<template>
  <h2>Comprando NFTs en Public Sale en Goerli</h2>
  <div>
    <label>Purchase By Id with BBites tokens (0 - 699)</label>
    <input type="text" v-model="purchaseInput" placeholder="NFT id" />
    <button @click="purchaseButton">Purchase</button>
    <span id="purchaseError" style="color: red"></span>
  </div>

  <div>
    <label>Purchase By Id with USDC (0 - 699)</label>
    <input
      type="number"
      v-model="purchaseInputUSDC"
      name="purchaseInputUSDC"
      placeholder="NFT id"
    />
    <input
      type="number"
      v-model="amountInUSDCInput"
      name="amountInUSDCInput"
      placeholder="UDSC amount in"
    />
    <button @click="purchaseButtonUSDC">Purchase</button>
    <span id="purchaseErrorUSDC" style="color: red"></span>
  </div>

  <div>
    <label>Purchase By Id With Ether (700 - 999)</label>
    <input type="text" v-model="purchaseInputEtherId" placeholder="NFT id" />
    <button @click="purchaseButtonEtherId">Purchase</button>
    <span id="purchaseEtherIdError" style="color: red"></span>
  </div>

  <div>
    <label>Send Ether to Public Sale (random 700 - 999)</label>
    <button @click="sendEtherButton">Send</button>
    <span id="sendEtherError" style="color: red"></span>
  </div>

  <div>
    <label for="priceNftIdInput">Consult NFT price by id</label>
    <input
      type="number"
      v-model="priceNftIdInput"
      name="priceNftIdInput"
      placeholder="NFT id"
    />
    <button @click="getPriceNftByIdBttn">Get Price</button>
    <span v-if="showPrice">{{ price }}</span>
    <span id="getPriceNftError" style="color: red"></span>
  </div>
</template>
