import { Contract, ethers } from "ethers";

import usdcTknAbi from "../artifacts/contracts/USDCoin.sol/USDCoin.json";
import bbitesTokenAbi from "../artifacts/contracts/BBitesToken.sol/BBitesToken.json"
// import publicSaleAbi
// import nftTknAbi

// SUGERENCIA: vuelve a armar el MerkleTree en frontend
// Utiliza la libreria buffer
import buffer from "buffer/";
import walletAndIds from "../wallets/walletList";
import { MerkleTree } from "merkletreejs";
var Buffer = buffer.Buffer;
var merkleTree;
var usdcAddress = "0xf964A915c31D58558bD88a4da8B9a8Fbe9107276";
var account;
function hashToken(tokenId, account) {
  return Buffer.from(
    ethers
      .solidityPackedKeccak256(["uint256", "address"], [tokenId, account])
      .slice(2),
    "hex"
  );
}
function buildMerkleTree() {
  var elementosHasheados;
  merkleTree = new MerkleTree(elementosHasheados, ethers.keccak256, {
    sortPairs: true,
  });
}

var provider, signer
var usdcTkContract, bbitesTknContract, pubSContract, nftContract;
var  bbitesTknAdd, pubSContractAdd;

function initSCsGoerli() {
  provider = new ethers.BrowserProvider(window.ethereum);
  bbitesTknAdd = "0xC772207B33C98Ca4A5416C210E2c726E03dDDCD5";
  pubSContractAdd = "";

  usdcTkContract = new Contract(usdcAddress, usdcTknAbi, provider);
  bbitesTknContract = new Contract(bbitesTknAdd, bbitesTokenAbi, provider) ;  
  pubSContract; // = new Contract(...
}

function initSCsMumbai() {
  provider = new ethers.BrowserProvider(window.ethereum);

  var nftAddress = "";

  nftContract; // = new Contract(...
}

function setUpListeners() {
  // Connect to Metamask
  var bttn = document.getElementById("connect");
  var walletIdEl = document.getElementById("walletId");
  bttn.addEventListener("click", async function () {
    if (window.ethereum) {
      try {
        // Solicitar acceso a la cuenta del usuario
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        // Verificar si se seleccionó una cuenta
        if (accounts.length > 0) {
          account = accounts[0];
          console.log("Billetera Metamask:", account);

          // Mostrar la cuenta en la interfaz
          walletIdEl.innerHTML = account;

          signer = await provider.getSigner(account);
        } else {
          console.log("No se seleccionó una cuenta.");
        }
      } catch (error) {
        console.error("Error al conectar con Metamask:", error);
      }
    } else {
      console.log("Metamask no detectado en el navegador.");
    }
  });

  // USDC Balance - balanceOf
  var bttn = document.getElementById("usdcUpdate");

  bttn.addEventListener("click", async function () {
    //var balance = await usdcTkContract.balanceOf(account);
    var balanceEl = document.getElementById("usdcBalance");
    try {

      const provider = new ethers.BrowserProvider(window.ethereum); /* new ethers.providers.Web3provider(ethereum); */
      const signer = provider.getSigner();
      const Contract1 = new Contract(usdcAddress, usdcTknAbi.abi, provider);
      const transaction = await Contract1.balanceOf(account);
      console.log("sirvio");
      /* const balance = await usdcTkContract.balanceOf(account);*/

      balanceEl.innerHTML = ethers.formatUnits(transaction, 6); 
    } catch (error) {
      console.error("Error al obtener el balance de USDC:", error);
    }
  });

  // Bbites token Balance - balanceOf
  var Bbites = document.getElementById("bbitesTknUpdate");
  Bbites.addEventListener("click", async function () {
    //var balance = await usdcTkContract.balanceOf(account);
    var balanceEl = document.getElementById("bbitesTknBalance");
    try {

      const provider = new ethers.BrowserProvider(window.ethereum); /* new ethers.providers.Web3provider(ethereum); */
      const signer = provider.getSigner();
      const Contract1 = new Contract(bbitesTknAdd, bbitesTokenAbi.abi, provider);
      const transaction = await Contract1.balanceOf(account);
      console.log("sirvio");
      /* const balance = await usdcTkContract.balanceOf(account);*/

      balanceEl.innerHTML = ethers.formatUnits(transaction, 6); 
    } catch (error) {
      console.error("Error al obtener el balance de USDC:", error);
    }
  });


  // APPROVE BBTKN
  // bbitesTknContract.approve
  var bttn = document.getElementById("approveButtonBBTkn");

  // APPROVE USDC
  // usdcTkContract.approve
  var bttn = document.getElementById("approveButtonUSDC");

  // purchaseWithTokens
  var bttn = document.getElementById("purchaseButton");

  // purchaseWithUSDC
  var bttn = document.getElementById("purchaseButtonUSDC");

  // purchaseWithEtherAndId
  var bttn = document.getElementById("purchaseButtonEtherId");

  // send Ether
  var bttn = document.getElementById("sendEtherButton");

  // getPriceForId
  var bttn = document.getElementById("getPriceNftByIdBttn");

  // getProofs
  var bttn = document.getElementById("getProofsButtonId");
  bttn.addEventListener("click", async () => {
    var id;
    var address;
    var proofs = merkleTree.getHexProof(hashToken(id, address));
    navigator.clipboard.writeText(JSON.stringify(proofs));
  });

  // safeMintWhiteList
  var bttn = document.getElementById("safeMintWhiteListBttnId");
  // usar ethers.hexlify porque es un array de bytes
  // var proofs = document.getElementById("whiteListToInputProofsId").value;
  // proofs = JSON.parse(proofs).map(ethers.hexlify);

  // buyBack
  var bttn = document.getElementById("buyBackBttn");
}

function setUpEventsContracts() {
  var pubSList = document.getElementById("pubSList");
  // pubSContract - "PurchaseNftWithId"

  var bbitesListEl = document.getElementById("bbitesTList");
  // bbitesCListener - "Transfer"

  var nftList = document.getElementById("nftList");
  // nftCListener - "Transfer"

  var burnList = document.getElementById("burnList");
  // nftCListener - "Burn"
}

async function setUp() {
  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  setUpListeners();

  initSCsGoerli();

  // initSCsMumbai

  // setUpListeners

  setUpEventsContracts();

  buildMerkleTree();
}

setUp()
  .then()
  .catch((e) => console.log(e));
