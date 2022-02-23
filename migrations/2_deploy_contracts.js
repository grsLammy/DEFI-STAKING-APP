const RewardToken = artifacts.require('RewardToken')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function(deployer, network, accounts) {
  
  // Deploy Mock Tether Token
  await deployer.deploy(Tether)
  const tether = await Tether.deployed()

  // Deploy RewardToken Token
  await deployer.deploy(RewardToken)
  const rewardToken = await RewardToken.deployed()

  // Deploy DecentralBank
  await deployer.deploy(DecentralBank, rewardToken.address, tether.address)
  const decentralBank = await DecentralBank.deployed()

  // Transfer all tokens to DecentralBank (1 million)
  await rewardToken._transfer(decentralBank.address, '1000000000000000000000000')

  // Transfer 100 Mock Tether tokens to investor
  await tether._transfer(accounts[1], '100000000000000000000')
}
