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

async function deployMumbai() {
  let cuyCollectionContract = await deploySC("CuyCollectionNft", []);
  let cuyColproxyAdd = await cuyCollectionContract.getAddress();

  let implAdd = await printAddress("CuyCollectionNft", cuyColproxyAdd);

  const relMumbai = "0x4b8a6C8ADA8F3ea961b768ee97bEbB04eE4b5B9D";
  await cuyCollectionContract.grantRole(MINTER_ROLE, relMumbai);

  await verify(implAdd, "CuyCollectionNft", []);
}

deployMumbai().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
