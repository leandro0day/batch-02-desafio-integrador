<script setup>
import { onMounted, ref } from "vue";
import buffer from "buffer";
import { wallets } from "../../wallets/walletList";
import { MerkleTree } from "merkletreejs";
import { Contract, ethers } from "ethers";

let merkleTree;
let root;
let Buffer = buffer.Buffer;

function hashToken(tokenId, account) {
  return Buffer.from(
    ethers
      .solidityPackedKeccak256(["uint256", "address"], [tokenId, account])
      .slice(2),
    "hex"
  );
}
function buildMerkleTree() {
  let elementosHasheados = wallets.map(({ id, address }) => {
    return hashToken(id, address);
  });
  merkleTree = new MerkleTree(elementosHasheados, ethers.keccak256, {
    sortPairs: true,
  });

  root = merkleTree.getHexRoot();
  console.log("White list", merkleTree.toString());
  console.log("root hash", root);
}

// getProofs
let inputIdProofId = ref();
let inputAccountProofId = ref();

const getProofsButtonId = async () => {
  const hasheandoElemento = hashToken(
    "1000",
    "0xC840F562D9F69b46b4227003E01525CB99344B72"
  );

  const proofs = merkleTree.getHexProof(hasheandoElemento);
  console.log(proofs);
  const pertenece = merkleTree.verify(proofs, hasheandoElemento, root);
  console.log(pertenece);
  navigator.clipboard.writeText(JSON.stringify(proofs));
};

// safeMintWhiteList
const whiteListErrorId = document.getElementById("whiteListErrorId");
let whiteListToInputTokenId = ref();
let whiteListToInputId = ref();
let whiteListToInputProofsId = ref();

const safeMintWhiteListBttnId = async () => {
  // usar ethers.hexlify porque es un array de bytes
  console.log(whiteListToInputId.value)
  console.log(whiteListToInputTokenId.value)
  let proofs = whiteListToInputProofsId.value;
  proofs = JSON.parse(proofs).map(ethers.hexlify);
  let signer = await props.provider.getSigner(props.account.value);
  try {
    const tx = await props.NFT.connect(signer).safeMintWhiteList(
      "0xC840F562D9F69b46b4227003E01525CB99344B72",
      "1000",
      proofs
    );
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash ", transactionHash);
  } catch (error) {
    console.log(error.message);
  }
};

// buyBack
const buyBackInputId = document.getElementById("buyBackInputId");
const buyBackErrorId = document.getElementById("buyBackErrorId");
const buyBackBttn = async () => {
  let signer = await props.provider.getSigner(props.account.value);
  try {

    const tx = await props.NFT.connect(signer).buyBack(1000);
    const response = await tx.wait();
    const transactionHash = response.hash;
    console.log("Tx Hash buyBack", transactionHash);
  } catch (error) {
    console.log(error.message);
  }
};

const props = defineProps(["NFT", "account", "provider"]);
onMounted(() => {
  buildMerkleTree();
});
</script>
<template>
  <h2>Acuñando de whitelist en NFT Contract en Mumbai</h2>
  <div>
    <label>Get proofs for id and account:</label>
    <input
      type="number"
      v-model="inputIdProofId"
      name="inputIdProof"
      placeholder="NFT id"
    />
    <input
      type="text"
      v-model="inputAccountProofId"
      name="inputAccountProof"
      placeholder="Account"
    />
    <button @click="getProofsButtonId">Print and Copy To Clipboard</button>
    <span></span>
  </div>

  <div>
    <label for="priceNftIdInput">Mint with Whitelist:</label>
    <input
      type="text"
      v-model="whiteListToInputId"
      name="whiteListToInput"
      placeholder="to"
    />
    <input
      type="number"
      v-model="whiteListToInputTokenId"
      name="whiteListToInputToken"
      placeholder="tokenId"
    />
    <input
      type="text"
      v-model="whiteListToInputProofsId"
      name="whiteListToInputProofs"
      placeholder="proofs"
    />
    <button @click="safeMintWhiteListBttnId">Safe Mint</button>
    <span id="whiteListErrorId" style="color: red"></span>
  </div>

  <div>
    <label for="buyBackInputId">Buy Back and Burn NFT:</label>
    <input
      type="number"
      id="buyBackInputId"
      name="buyBackInput"
      placeholder="NFT id"
    />
    <button @click="buyBackBttn">Buy Back and Burn</button>
    <span id="buyBackErrorId" style="color: red"></span>
  </div>
</template>
