const { ethers } = require("ethers");
const {
  DefenderRelaySigner,
  DefenderRelayProvider,
} = require("@openzeppelin/defender-relay-client/lib/ethers");

exports.handler = async function (data) {
  const payload = data.request.body.events;

  const provider = new DefenderRelayProvider(data);

  const signer = new DefenderRelaySigner(data, provider, { speed: "fast" });


  var onlyEvents = payload[0].matchReasons.filter((e) => e.type === "event");
  if (onlyEvents.length === 0) return;

  var event = onlyEvents.filter((ev) =>
    ev.signature.includes("Burn")
  );

  var { account, id } = event[0].params;

  var bbitesTokenAdd = "0xE255E418cd36f9F6Eae5374aABE0fB8b8D0ED302";
  var tokenAbi = ["function mint(address to, uint256 amount)"];
  var tokenContract = new ethers.Contract(bbitesTokenAdd, tokenAbi, signer);
  var tokens = ethers.utils.parseUnits("10000", 18);
  var tx = await tokenContract.mint(account, tokens);
  var res = await tx.wait();
  return res;
};