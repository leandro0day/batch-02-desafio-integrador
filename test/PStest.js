let { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { expect } = require("chai");
let { ethers } = require("hardhat");

const { getRole, deploySC, deploySCNoUp, ex, pEth } = require("../utils");

const MINTER_ROLE = getRole("MINTER_ROLE");
const BURNER_ROLE = getRole("BURNER_ROLE");

describe("Testing", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const bbitesTok = await deploySC("BBitesToken");
    const usdCoin = await deploySCNoUp("USDCoin");
    const publicSale = await deploySC("PublicSale", [
      await bbitesTok.getAddress(),
      await usdCoin.getAddress(),
    ]);
    const cuyCollection = await deploySC("CuyCollectionNft");
    const relMumbai = "0x4b8a6C8ADA8F3ea961b768ee97bEbB04eE4b5B9D";
    const relayerSignerMumbai = await ethers.getImpersonatedSigner(relMumbai);
    await cuyCollection.grantRole(MINTER_ROLE, relMumbai);

    let ONE_ETHER = `0x${ethers.parseEther("1").toString(16)}`;
    await network.provider.send("hardhat_setBalance", [relMumbai, ONE_ETHER]);
    await network.provider.send("hardhat_setBalance", [
      owner.address,
      ONE_ETHER,
    ]);
    return {
      publicSale,
      cuyCollection,
      relayerSignerMumbai,
      bbitesTok,
      usdCoin,
      owner,
      addr1,
      addr2,
      ONE_ETHER,
    };
  }

  it("Compra con BBitesToken ", async function () {
    const { publicSale, cuyCollection, relayerSignerMumbai, bbitesTok, owner } =
      await loadFixture(deployTokenFixture);
    const precioId10 = await publicSale.getPriceForId(10);
    await bbitesTok.approve(await publicSale.getAddress(), precioId10);
    let tx = await publicSale.purchaseWithTokens(10);
    await expect(tx)
      .to.emit(publicSale, "PurchaseNftWithId")
      .withArgs(owner.address, 10);

    await cuyCollection
      .connect(relayerSignerMumbai)
      .safeMint(await owner.getAddress(), 10);
    expect(await cuyCollection.ownerOf(10)).to.equal(owner.address);
  });

  it("Compra con Ether ", async function () {
    const { publicSale, cuyCollection, relayerSignerMumbai, owner } =
      await loadFixture(deployTokenFixture);
    let tx = await publicSale.purchaseWithEtherAndId(700, {
      value: ethers.parseEther("0.01"),
    });
    await expect(tx)
      .to.emit(publicSale, "PurchaseNftWithId")
      .withArgs(owner.address, 700);

    await cuyCollection
      .connect(relayerSignerMumbai)
      .safeMint(await owner.getAddress(), 700);
    expect(await cuyCollection.ownerOf(700)).to.equal(owner.address);
  });

  it("Retira el Ether ", async function () {
    const { publicSale, ONE_ETHER } = await loadFixture(deployTokenFixture);
    await network.provider.send("hardhat_setBalance", [
      await publicSale.getAddress(),
      ONE_ETHER,
    ]);
    await publicSale.withdrawEther();
    expect(
      await ethers.provider.getBalance(await publicSale.getAddress())
    ).to.equal(0);
  });

  it("Retira los BBites Tokens depositados ", async function () {
    const { publicSale, bbitesTok } = await loadFixture(deployTokenFixture);
    await bbitesTok.mint(
      await publicSale.getAddress(),
      50000000000000000000000n
    );
    let tx = await publicSale.withdrawTokens();
    expect(await bbitesTok.balanceOf(await publicSale.getAddress())).to.equal(
      0
    );
  });

  it("Regresa el precio correcto para el NFT con ID 10 ", async function () {
    const { publicSale } = await loadFixture(deployTokenFixture);
    const precioId10 = await publicSale.getPriceForId(10);
    expect(precioId10).to.equal(1000000000000000000000n);
  });

  it("Regresa el precio correcto para el NFT con ID 250 ", async function () {
    const { publicSale } = await loadFixture(deployTokenFixture);
    const precioId10 = await publicSale.getPriceForId(250);
    expect(precioId10).to.equal(5000000000000000000000n);
  });
});
