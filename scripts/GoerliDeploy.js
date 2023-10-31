require("dotenv").config();

const {
  getRole,
  verify,
  ex,
  printAddress,
  deploySC,
  deploySCNoUp,
} = require("../utils");

const { getRootFromMT } = require("../utils/merkleTree");

let MINTER_ROLE = getRole("MINTER_ROLE");
let BURNER_ROLE = getRole("BURNER_ROLE");


async function deployGoerli() {
  let bbitesContract = await deploySC("BBitesToken", []);
  let bbitesProxyAdd = await bbitesContract.getAddress();
  let impBT = await printAddress("BBitesToken", bbitesProxyAdd);

  const relGoerli = "0x9A5a587eBf8884d46D3c1f61069196d1C5228FFC";
  await bbitesContract.grantRole(MINTER_ROLE, relGoerli);
  await verify(impBT, "BBitesToken", []);

  let usdcContract = await deploySCNoUp("USDCoin", []);
  let usdcAdd = await usdcContract.getAddress();
  await verify(usdcAdd, "USDCoin", []);
}

async function deployPublicSale() {
  let bbitesTokAdd = "0xE255E418cd36f9F6Eae5374aABE0fB8b8D0ED302";
  let usdCoinAdd = "0x1Aaaa873cc3280DB38B94843D7642459DE2823Ea";
  let publicSale = await deploySC("PublicSale", [bbitesTokAdd, usdCoinAdd]);
  let publicSaleProxyAdd = await publicSale.getAddress();
  let impPS = await printAddress("PublicSale", publicSaleProxyAdd);

  let [owner] = await ethers.getSigners();

  let USDC = await ethers.getContractFactory("USDCoin");
  let usdc = USDC.attach(usdCoinAdd);
  let txApproveUsdc = await usdc.approve(
    await publicSale.getAddress(),
    100000000000n
  );
  await txApproveUsdc.wait();
  console.log(`Approve de USDC: ${txApproveUsdc.hash}`);

  let BBITES = await ethers.getContractFactory("BBitesToken");
  let bbites = BBITES.attach(bbitesTokAdd);
  let txApproveBbites = await bbites.approve(
    await publicSale.getAddress(),
    50000000000000000000000n
  );
  await txApproveBbites.wait();
  console.log(`Approve de BBites: ${txApproveBbites.hash}`);

  await verify(impPS, "PublicSale", []);
}

function roles() {
  console.log(`El minter role en bytes32 es: ${MINTER_ROLE}`);
  console.log(`El burner role en bytes32 es: ${BURNER_ROLE}`);
}

//deployGoerli()
deployPublicSale()
  //roles()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
