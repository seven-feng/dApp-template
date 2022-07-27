import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button, Input } from 'antd';
import { makeERC20Contract } from '@/hooks/useContract';
import toBN from '@/utils/toBN';
import { weiToEther } from '@/utils/format';

interface Props {}
const Info = (props: Props) => {
  const { account, provider } = useWallet();
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [decimals, setDecimals] = useState('');
  const [balance, setBalance] = useState('');

  const handleQuery = async () => {
    if (account && provider) {
      try {
        const erc20Contract = makeERC20Contract(address, provider);
        const name = await erc20Contract.name();
        setName(name);
        const symbol = await erc20Contract.symbol();
        setSymbol(symbol);
        const decimals = await erc20Contract.decimals();
        setDecimals(decimals.toString());
        const supply = await erc20Contract.totalSupply();
        setSupply(toBN(weiToEther(supply)).toFixed());
        const balance = await erc20Contract.balanceOf(account);
        setBalance(toBN(weiToEther(balance)).toFixed());
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  return (
    <div>
      <div>
        代币地址：
        <Input
          type="text"
          value={address}
          placeholder="请输入代币地址"
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: 400, marginTop: 10 }}
        />
        <Button
          type="primary"
          onClick={handleQuery}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          查询
        </Button>
      </div>
      <div style={{ marginTop: 10 }}>代币信息</div>
      <div>name：{name}</div>
      <div>symbol：{symbol}</div>
      <div>totalSupply：{supply}</div>
      <div>decimals：{decimals}</div>
      <div>balanceOf：{balance}</div>
    </div>
  );
};
export default Info;
