const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function issueRewards(callback) {
    let decentralBank = await DecentralBank.deployed()
    await decentralBank._issueRewardTokens()
    console.log('Tokens have been issued successfully!')
    callback()
}