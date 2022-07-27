import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button, Input } from 'antd';
import {
  PLATFORM_TOKEN_ADDRESS,
  PLATFORM_TOKEN_DECIMALS,
  PLATFORM_TOKEN_IMG,
  PLATFORM_TOKEN_SYMBOL,
} from '@/constants';

import style from './index.less';

interface Props {}
const Other = (props: Props) => {
  const { addTokenToWallet, signMessage } = useWallet();
  const [value, setValue] = useState('');
  const [signMsg, setSignMsg] = useState('');

  const handleAddToWallet = () => {
    addTokenToWallet({
      address: PLATFORM_TOKEN_ADDRESS,
      symbol: PLATFORM_TOKEN_SYMBOL,
      decimals: PLATFORM_TOKEN_DECIMALS,
      image: PLATFORM_TOKEN_IMG,
    });
  };

  const handleSignMessage = async () => {
    if (value) {
      const res = await signMessage(value);
      setSignMsg(res);
    }
  };

  return (
    <div className={style.otherContainer}>
      <div>
        <Button type="primary" onClick={handleAddToWallet}>
          添加平台币到钱包
        </Button>
      </div>
      <div>
        <Input
          type="text"
          value={value}
          placeholder="请输入要签名的内容"
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 400 }}
        />
        <Button
          type="primary"
          onClick={handleSignMessage}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          签名
        </Button>
        <div>{signMsg}</div>
      </div>
    </div>
  );
};
export default Other;
