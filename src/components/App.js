import React, {Component} from 'react';
import Navbar from './Navbar'
import Web3 from 'web3'
import './App.css'
import Tether from '../truffle_abis/Tether.json'
import RewardToken from '../truffle_abis/RewardToken.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'

class App extends Component {

	async UNSAFE_componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	constructor(props) {
		super(props) 
		this.state = {
			tether: {},
			rewardToken: {},
			decentralBank: {},
			tetherBalance: '0',
			rewardTokenBalance: '0',
			stakingBalance: '0',
			account: '0x0',
			loading: true
		}
	}

	async loadWeb3() {
		if(window.ethereuem) {
			window.web3 = new Web3(window.ethereuem)
			try{
				await window.web3.enable()
			} catch(error) {
				window.alert('User account access denied by the user.')
			}
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert('Opps! It seems like Ehereuem browser was nowhere to be found. You can check out MetaMask!')
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3 
		const account = await web3.eth.requestAccounts()
		this.setState({account: account[0]})
		//console.log('Account:', this.state.account)
		const networkId = await web3.eth.net.getId()

		//load Tether Contract
		const tetherData = Tether.networks[networkId]
		if(tetherData) {
			const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
			this.setState({tether})
			let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
			this.setState({tetherBalance: tetherBalance.toString()})
			console.log('Tether balance:',this.state.tetherBalance)
		} else {
			window.alert('Tether not deployed to the network')
		}

		//load RewardToken Contract
		const rewardTokenData = RewardToken.networks[networkId]
		if(rewardTokenData) {
			const rewardToken = new web3.eth.Contract(RewardToken.abi,rewardTokenData.address)
			this.setState({rewardToken})
			let rewardTokenBalance = await rewardToken.methods.balanceOf(this.state.account).call()
			this.setState({rewardTokenBalance: rewardTokenBalance.toString()})
			//console.log('Reward Token balance:',this.state.rewardTokenBalance)
		} else {
			window.alert('Reward Token not deployed to the network')
		}

		//load DecentralBank Contract
		const decentralBankData = DecentralBank.networks[networkId]
		if(decentralBankData) {
			const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
			this.setState({decentralBank})
			let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
			this.setState({stakingBalance: stakingBalance.toString()})
			//console.log('Staking balance:',this.state.stakingBalance)
		} else {
			window.alert('Decentral Bank not deployed to the network')
		}

		this.setState({loading: false})

	}

	//Our react code goes in here!
	render() {
		return(
			<div>
				<Navbar account={this.state.account}/>
				<div>
					<h1>

					</h1>
				</div>
			</div>
		)
	}
	
}

export default App;