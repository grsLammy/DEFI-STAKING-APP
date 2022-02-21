const { assert } = require('console');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const Tether = artifacts.require("Tether");
const RewardToken = artifacts.require("RewardToken");
const DecentralBank = artifacts.require("DecentralBank");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', (accounts) => {
    //All of the code goes here for testing
    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            let tether = await Tether.new()
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token') 
        })
    })

    describe('Reward Token Deployment', async() => {
        it('name and symbol matches successfully', async() => {
            let rewardToken = await RewardToken.new()
            const name = await rewardToken.name()
            assert.equal(name,'Reward Token')
            const symbol = await rewardToken.symbol()
            assert.equal(symbol,'RWD')
        })
    })

})