const RewardToken = artifacts.require('RewardToken')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rewardToken, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        //Load Contracts
        tether = await Tether.new()
        rewardToken = await RewardToken.new()
        decentralBank = await DecentralBank.new(rewardToken.address, tether.address)

        //Transfer all tokens to DecentralBank (1 million)
        await rewardToken._transfer(decentralBank.address, tokens('1000000'))

        //_transfer 100 mock Tethers to Customer
        await tether._transfer(customer, tokens('100'), {from: owner})
    })
    

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether._name()
            assert.equal(name, 'Mock Tether Token') 
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rewardToken._name()
            assert.equal(name, 'Reward Token') 
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank._name()
            assert.equal(name, 'Decentral Bank') 
        })

        it('contract has tokens', async () => {
            let balance = await rewardToken._accountBalance(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

    })

    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {
            
            //Check Investor Balance
            let result = await tether._accountBalance(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
        
            //Check Staking For Customer of 100 tokens
            await tether._approval(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank._stakeTokens(tokens('100'), {from: customer})

            //Check Updated Balance of Customer
            result = await tether._accountBalance(customer)
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')     
            
            //Check Updated Balance of Decentral Bank
            result = await tether._accountBalance(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet balance after staking from customer')     
            
            //Is Staking Update
            result = await decentralBank._isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer is staking status after staking')

            //Issue Tokens
            await decentralBank._issueRewardTokens({from: owner})

            //Ensure Only The Owner Can Issue Tokens
            // await decentralBank.issueTokens({from: customer}).should.be.rejected;
            
        })

        it('unstaking tokens', async () => {
            //Unstake Tokens
            await decentralBank._unstakeTokens({from: customer})

            //Check Unstaking Balances
            result = await tether._accountBalance(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')     
            
            //Check Updated Balance of Decentral Bank
            result = await tether._accountBalance(decentralBank.address)
            assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after staking from customer')     
            
            //Is Staking Update
            result = await decentralBank._isStaking(customer)
            assert.equal(result.toString(), 'false', 'customer is no longer staking after unstaking')
        })
    })
})