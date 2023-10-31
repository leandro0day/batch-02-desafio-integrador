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
    ev.signature.includes("PurchaseNftWithId")
  );

  var { account, id } = event[0].params;

  var cuyCollectionAdd = "0x0643Bfa31a2041D580d22B505e019448d576c186";
  var tokenAbi = ["function safeMint(address to, uint256 tokenId)"];
  var tokenContract = new ethers.Contract(cuyCollectionAdd, tokenAbi, signer);
  var tx = await tokenContract.safeMint(account,id);
  var res = await tx.wait();
  return res;
};