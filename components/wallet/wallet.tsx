import {
  WalletCard,
  WalletCardBalance,
  WalletCardRow,
  WalletCardAccount,
} from 'components/walletCard';
import { Divider } from '@lidofinance/lido-ui';
import {
  useEthereumBalance,
  useSDK,
  useSTETHBalance,
  useTokenAddress,
} from '@lido-sdk/react';
import { useWeb3 } from '@lido-sdk/web3-react';
import FormatToken from 'components/formatToken';
import FallbackWallet from 'components/fallbackWallet';
import TokenToWallet from 'components/tokenToWallet';
import { WalletComponent } from './types';
import { TOKENS } from '@lido-sdk/constants';
import styled from 'styled-components';

const AprPercent = styled.span`
  color: rgb(97, 183, 95);
`;

const Wallet: WalletComponent = (props) => {
  const { account } = useSDK();
  const eth = useEthereumBalance();
  const steth = useSTETHBalance();

  const stethAddress = useTokenAddress(TOKENS.STETH);

  return (
    <WalletCard {...props}>
      <WalletCardRow>
        <WalletCardBalance
          title="Eth balance"
          loading={eth.initialLoading}
          value={<FormatToken amount={eth.data} symbol="ETH" />}
        />
        <WalletCardAccount account={account} />
      </WalletCardRow>
      <Divider />
      <WalletCardRow>
        <WalletCardBalance
          small
          title="Staked amount"
          loading={steth.initialLoading}
          value={
            <>
              <FormatToken amount={steth.data} symbol="stETH" />
              <TokenToWallet address={stethAddress} />
            </>
          }
        />
        <WalletCardBalance
          small
          title="Lido APR"
          value={<AprPercent>120.8%</AprPercent>}
        />
      </WalletCardRow>
    </WalletCard>
  );
};

const WalletWrapper: WalletComponent = (props) => {
  const { active } = useWeb3();
  return active ? <Wallet {...props} /> : <FallbackWallet {...props} />;
};

export default WalletWrapper;
