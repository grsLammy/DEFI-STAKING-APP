import './App.css'
import Web3 from 'web3'
import Main from './Main.js'
import Navbar from './Navbar'
import React, {Component} from 'react';
import Tether from '../truffle_abis/Tether.json'
import RewardToken from '../truffle_abis/RewardToken.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import ParticleSettings from './ParticleSettings';

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
			customerAccount: '0x0',
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
		const customerAccount = await web3.eth.requestAccounts()
		this.setState({customerAccount: customerAccount[0]})
		const networkId = await web3.eth.net.getId()

		//load Tether Contract
		const tetherData = Tether.networks[networkId]
		if(tetherData) {
			const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
			this.setState({tether})
			let tetherBalance = await tether.methods.balanceOf(this.state.customerAccount).call()
			this.setState({tetherBalance: tetherBalance.toString()})
		} else {
			window.alert('Tether not deployed to the network')
		}

		//load RewardToken Contract
		const rewardTokenData = RewardToken.networks[networkId]
		if(rewardTokenData) {
			const rewardToken = new web3.eth.Contract(RewardToken.abi,rewardTokenData.address)
			this.setState({rewardToken})
			let rewardTokenBalance = await rewardToken.methods.balanceOf(this.state.customerAccount).call()
			this.setState({rewardTokenBalance: rewardTokenBalance.toString()})
		} else {
			window.alert('Reward Token not deployed to the network')
		}

		//load DecentralBank Contract
		const decentralBankData = DecentralBank.networks[networkId]
		if(decentralBankData) {
			const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
			this.setState({decentralBank})
			let stakingBalance = await decentralBank.methods.stakingBalance(this.state.customerAccount).call()
			this.setState({stakingBalance: stakingBalance.toString()})
		} else {
			window.alert('Decentral Bank not deployed to the network')
		}

		this.setState({loading: false})
	}

	//staking function
	stakeTokens = (amount) => {
		this.setState({loading: true})
		this.state.tether.methods.approval(this.state.decentralBank._address, amount).send({from:this.state.customerAccount}).on('transactionHash', (hash) => {
			this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.customerAccount}).on('transactionHash', (hash) => {
				this.setState({loading: false})
				document.location.reload(true)
			})	
		})	
	}	

	//unstaking function
	unstakeTokens = () => {
		this.setState({loading: true})
		this.state.decentralBank.methods.unstakeTokens().send({from: this.state.customerAccount}).on('transactionHash',(hash) => {
			this.setState({loading: false})
			document.location.reload(true)
		})
	}

	//Our react code goes in here!
	render() {
		let content 
		{this.state.loading ? content =
		<p id='loader' className='text-center' style={{margin:'30', color:'white'}}>
		LOADING PLEASE...</p> : content = 
		<Main 
			tetherBalance={this.state.tetherBalance}
			rewardTokenBalance={this.state.rewardTokenBalance}
			stakingBalance={this.state.stakingBalance}
			stakeTokens={this.stakeTokens}
			unstakeTokens={this.unstakeTokens}
		/>}
		return(
			<div className='App' style={{position:'relative'}}>
				<div style={{position:'absolute'}}>
					<ParticleSettings/>
				</div>
				<Navbar customerAccount={this.state.customerAccount}/>
				<div className='container-fluid mt-5'>
					<div className='row'>
						<main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px',minHeight:'100vm'}}>
							<div>
								{content}
							</div>
						</main> 
					</div>
				</div>
			</div>
		)
	}
	
}

export default App;