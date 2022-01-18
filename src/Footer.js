import twitterLogo from './assets/twitter-logo.svg';
import styled from 'styled-components';

const TWITTER_HANDLE = 'spacemoses1337';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = `https://testnets.opensea.io/collection/squarenft-mqkmyvulbn`

const Footer = () => {
  return (
    <div className='footer'>
      <div>
        <OpenSeaButton href={OPENSEA_LINK} className="opensea-button">
          🌊 View the collection on OpenSea
        </OpenSeaButton>
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>

  )
}

const OpenSeaButton = styled.a`
  background-color: lightblue;
  padding: 10px 20px;
  color: white;
  display: inline-block;
  text-decoration: none;
  margin-bottom: 20px;
  border-radius: 4px;
  cursor: pointer;
`

export default Footer