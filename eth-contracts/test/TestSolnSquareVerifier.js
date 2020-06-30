var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var SquareVerifier = artifacts.require('Verifier');
const zokratesProof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
  const account1 = accounts[0];
  const account2 = accounts[1];
  const tokenID = 1;

  beforeEach(async() => {
    let squareVerifierContract = await SquareVerifier.new({from: account1});
    this.contract = await SolnSquareVerifier.new(squareVerifierContract.address, {from: account1});
  });

  it("should add new solution", async() => {
    let result = false;

    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.input, account2, tokenID, { from: account2 });
      result = true;//if we are able to add solution the result becomes true
    }
    catch(e) {
      result = false;
    }
    assert.equal(result, true);
  });

  it("should not add new solution if the proof was used previously", async() => {
    let result = false;

    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.input, account2, tokenID, { from: account2 });
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.input, account2, tokenID+1, { from: account2 });
      result = true;
    } catch(e) {
      result = false;
    }
    assert.equal(result, false);
  });

  it("should be able to mint new token after solution has been submitted", async() => {
    let result = false;
    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.input, account2, tokenID, { from: account2 });
      await this.contract.mint(account2, tokenID, { from: account1 });
      result = true
    } catch(e) {
      console.log(false);
      result = false;
    }
    assert.equal(result, true);
  });
});
