const Tether = artifacts.require("Tether");
const RewardToken = artifacts.require("RewardToken");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function (deployer, network, accounts) {
  //deploy mock Tether contract
  await deployer.deploy(Tether)
  const tether = await Tether.deployed()

  //deploy RewardToken contract
  await deployer.deploy(RewardToken)
  const rewardToken = await RewardToken.deployed()

  //deploy DecentralBank contract
  await deployer.deploy(DecentralBank, rewardToken.address, tether.address)
  const decentralBank = await DecentralBank.deployed()

  //Transfer RewardToken to Decentral Bank
  await rewardToken.transfer(decentralBank.address, '1000000000000000000000000')

  //Distribute 100 Tether tokens to investor
  await tether.transfer(accounts[1],'100000000000000000000')
};
