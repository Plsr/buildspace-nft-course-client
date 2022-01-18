import './styles/App.css';
import Footer from './Footer'
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers'
import myEpicNft from "./utils/MyEpicNFT.json"

export const CONTRACT_ADDRESS = "0xFB60408d96473857b3bD787d803AE3127Bf7f651"

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [totalNFTsMinted, setTotalNFTsMinted] = useState(0)
  const [connectedToWrongNetwork, setConnectedToWrongNetwork] = useState(false)

  useEffect(() => {
    checkIfWalletIsConnected()
    checkWalletNetwork()
    getTotalNFTsMinted()
    setEthereumListeners()
  }, [])

  const setEthereumListeners = () => {
    const ethereum = getEthereumObj()
    if (!ethereum) return 

    ethereum.on('chainChanged', (chainId) => checkWalletNetwork(chainId));
  }

  const getTotalNFTsMinted = async () => {
    if (connectedToWrongNetwork) return
    try {
      const contract = getContract()
      const nftsMinted = await contract.getTotalNFTsMinted()
      setTotalNFTsMinted(nftsMinted.toNumber())
    } catch (error) {
      console.log(error)
    }
  }

  const getEthereumObj = () => {
    const { ethereum } = window
    if (!ethereum) console.log("Get Metamask")
    return ethereum
  }

  const checkWalletNetwork = async (chainId) => {
    const ethereum = getEthereumObj()
    if (!ethereum) return

    let cId = !chainId ? await ethereum.request({ method: 'eth_chainId' }) : chainId;

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    setConnectedToWrongNetwork(cId !== rinkebyChainId)
  }

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObj()
      if (!ethereum) return

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      setupEventListener()

      if(accounts.lenght !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account: ", account)
        setCurrentAccount(account)
        checkWalletNetwork()
      } else {
        console.log("No authorized account found")
      }

    } catch(error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const ethereum = getEthereumObj()
    if (!ethereum) return

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if(accounts.lenght !== 0) {
      const account = accounts[0]
      console.log("Found an authorized account: ", account)
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const askContractToMintNFT = async () => {
    try {
      const contract = getContract()
      console.log("going to pop wallet now to pay for gas... ")
      let nftTxn = await contract.makeEpicNFT()

      console.log("Mining... please wait....")
      await nftTxn.wait()
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    } catch(error) {
      console.log(error)
    }
  }

  const getContract = () => {
    try {
      const ethereum = getEthereumObj()
      if(!ethereum) return
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      return new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)      
    } catch (error) {
      console.log(error)
      return
    }
  }

  const setupEventListener = async () => {
    try {
      const contract = getContract()

      contract.on("NewEpicNFTMinted", (from, tokenId, totalNFTsMinted) => {
        console.log(from, tokenId.toNumber(), totalNFTsMinted.toNumber())
        setTotalNFTsMinted(totalNFTsMinted.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">CryptoSchemes</p>

          <p className="sub-text">
            Colorschemes. Each unique. Each beautiful. Discover your NFT today.
          </p>
          { connectedToWrongNetwork && (
            <div className="alert-box">
              <span>This site only works in the rinkeby network. You are not connected to the rinkeby network, please make sure you connect your wallet to rinkeby</span>
            </div>
          )}
          { !currentAccount ? (
            renderNotConnectedContainer()
          ) : (
            <>
              <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
                Mint NFT
              </button>
              {! connectedToWrongNetwork && (
                <p className="sub-text">Total NFTS minted: {totalNFTsMinted}/50</p>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
