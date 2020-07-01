var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var SquareVerifier = artifacts.require('Verifier');

const zokratesProof = {
	"proof":
	{
		"A":["0x1ed7210d9c79a127e64bc0d7b710138afbb04a7f082da4a1fe11942d2dade1d9", "0x263867f85742ef85eb3315c506a8cc94c0d7a963119d8c263e31e992e397bedd"],
		"A_p":["0x29bc69e28cb934692314fb0301122d0625dda3c62e1d9e6c200caeea70822d55", "0xc96b0814a13b28411f15bd725a3ab935ab386cedf7757381bc05d0ee56f9c7"],
		"B":
			[["0x29fc42b2ee19494e8ebc5680e9974acc0d7070e324e93a23fe3ab109736a919a", "0x11148f46439378e9964b2b80c856011d8e5676d82e7be47b6994e51399965ce6"], ["0x1909ffe9fd80f4ea0793ee38896c640c2cfa23b45cf51d383cd660365c28b959", "0xcb212bbabd0638e99fcfa3e2e6ead1ff792a35cc655b8b2ab6c902caedd3bcd"]],

		"B_p":["0x247bb963ec30bfe2016b980fb8e2d9eb5cc7b4728f7ad00481a2d4157b95cda", "0x2875b52f34e37623c6ebf8c65562b4c54419eb40ab033c7d9759c630d0ba58b5"],
		"C":["0x11ee2b32e435b8d4436afd18c53d267d90b837e8b36fdf924f35eec2a55e7f36", "0x76dfce254c7fe2c2ad47a4497f87c0240febb0f4a35c89148d741f32a7bad5"],
		"C_p":["0x2fa4942d5bdde5603616850dc33870fc088ca33797adabdc21f1fd6ac3b3d66b", "0x6ebf0223177b2cb12a5e7bc3878836ad4f16e7a60f310d12299994a31faff90"],
		"H":["0x1a94923ff73eee05fc4613d5f72ca75375c65cffd087fd8772a6db5df2b63ab2", "0x15156d883c4d97d807a841d39bb16715aef4f9f958b252ead0ed5420b47ad408"],
		"K":["0x2a190db6c7ba503f1001d117507187f7da5490113a31b8cc73098062d57621d9", "0x1cbaa79743b57bcb05b508d86b21adc7583c4d41dd42886e42145348a5d1b86d"]
	},
	"input":[9,1]}//.	let solutionKey = keccak256(abi.encodePacked(Object.values(zokratesProof.A), Object.values(zokratesProof.B), Object.values(zokratesProof.C), zokratesProof.input));

//console.log(...Object.values(zokratesProof.proof))

contract("TestSolnSquareVerifier", accounts => {
  const account1 = accounts[0];
  const account2 = accounts[1];
  const tokenID = 1;

 //let solutionKey = keccak256(abi.encodePacked(...Object.values(zokratesProof.proof["A"]), ...Object.values(zokratesProof.proof["B"], ...Object.values(zokratesProof.proof["C"], ));

  beforeEach(async() => {
    let squareVerifierContract = await SquareVerifier.new({from: account1});
    this.contract = await SolnSquareVerifier.new(squareVerifierContract.address, {from: account1});
  });

  it("should add new solution", async() => {
    let result=await this.contract.submitSolution(...Object.values(zokratesProof.proof),
    zokratesProof.input,
    account2,
    2,
    {from:account1})
    //console.log(result);
    assert.equal(result.logs[0].event,"SolutionSubmitted");
  });

  it("should not add new solution if the proof was used previously", async() => {
    let result1=await this.contract.submitSolution(...Object.values(zokratesProof.proof),
    zokratesProof.input,
    account2,
    2,
    {from:account1})
		try{
			let result1=await this.contract.submitSolution(...Object.values(zokratesProof.proof),
			zokratesProof.input,
			account2,
			2,
			{from:account1})
		} catch(err){
			assert.equal(err.reason,"solution has already been used previously; create a new one using ZoKrates")
		}
  //  console.log(result2)

  });

  it("should be able to mint new token after solution has been submitted", async() => {
		await this.contract.submitSolution(...Object.values(zokratesProof.proof),
		zokratesProof.input,
		account1,
		1,
		{from:account1})
    let result=await this.contract.mint(account1,1,{from:account1})
    assert(result.logs[0].event,"Transfer")
  });
});
