var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account1 = accounts[0];
    const account2 = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account1});

            // TODO: mint multiple tokens
            for (var i = 0; i < 10; i++) {
                await this.contract.mint(account1, i, {from: account1});
            }
            for (var i = 10; i <20 ; i++) {
                await this.contract.mint(account2, i, {from: account1});
            }
        })

        it('should return total supply', async function () {
            let totalSupply=await this.contract.totalSupply.call();
            assert.equal(totalSupply,20);
        })

        it('should get token balance', async function () {
            let tokenBalance1=await this.contract.balanceOf(account1);
            assert.equal(tokenBalance1,10);

            let tokenBalance2=await this.contract.balanceOf(account2);
            assert.equal(tokenBalance2,10);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
          let result=await this.contract.tokenURI(1);
          assert.equal(result,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1");
        })

        it('should transfer token from one owner to another', async function () {
          await this.contract.transferFrom(account1,account2,3,{from:account1});
          let result=await this.contract.ownerOf(3);
          assert.equal(result,account2);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account1});
        })

        it('should fail when minting when address is not contract owner', async function () {
          try{
            await this.contract.mint(account2,1,{from:account2});
          }catch(e){
            assert.equal(e.reason,"caller must be the contract owner")
          }

        })

        it('should return contract owner', async function () {
          let result=await this.contract.owner.call();
          assert.equal(result,account1);
        })

    });
})
