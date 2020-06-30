// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var CustomERC721Token = artifacts.require("./CustomERC721Token.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CustomERC721Token);
  const customERC721Token = await CustomERC721Token.deployed();

  await deployer.deploy(SquareVerifier);
  const verifierContract = await SquareVerifier.deployed();

  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
  const solnSquareVerifier = await SolnSquareVerifier.deployed();
};
