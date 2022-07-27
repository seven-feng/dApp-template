import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button, Input } from 'antd';
import { deployContract } from '@/hooks/useContract';
import { parseUnits } from '@ethersproject/units';
import abi from '@/abi/testToken.json';
import { byteCode } from '@/constants/index';
import { makeTokenLink } from '@/utils/make-block-explorer-link';

interface Props {}
const Deploy = (props: Props) => {
  const { account, provider, chainId, addTokenToWallet } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    if (provider && account && supply && name && symbol) {
      try {
        setLoading(true);
        const factory = deployContract(abi, byteCode, provider, account);
        const contract = await factory.deploy(parseUnits(supply), name, symbol);
        const receipt = await contract.deployTransaction.wait();
        if (receipt.status === 1) {
          setAddress(contract.address);
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddToWallet = () => {
    if (address && symbol) {
      addTokenToWallet({
        address,
        symbol,
        decimals: 18,
        image: '',
      });
    }
  };

  return (
    <div>
      <div>
        代币名称：
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 200, marginTop: 10 }}
        />
      </div>
      <div>
        代币symbol：
        <Input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{ width: 200, marginTop: 10 }}
        />
      </div>
      <div>
        代币总供应量：
        <Input
          type="text"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          style={{ width: 200, marginTop: 10 }}
        />
      </div>
      <div style={{ width: 200, marginTop: 10 }}>部署合约地址：{address}</div>
      <div>
        <Button
          type="primary"
          loading={loading}
          onClick={handleDeploy}
          style={{ marginTop: 10 }}
        >
          部署
        </Button>
        <Button
          type="primary"
          onClick={handleAddToWallet}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          添加代币到钱包
        </Button>
        {address && chainId && (
          <Button type="link" href={`${makeTokenLink(address, chainId)}`}>
            查看区块链浏览器
          </Button>
        )}
      </div>
    </div>
  );
};
export default Deploy;
