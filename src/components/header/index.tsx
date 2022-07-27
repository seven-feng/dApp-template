import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Tag } from 'antd';

import style from './index.less';

interface Props {}

const Header = (props: Props) => {
  const { account, chainId, isActive, connect, connectEagerly, disconnect } =
    useWallet();

  const handleConnect = () => {
    if (isActive) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    connectEagerly();
  }, []);

  return (
    <div className={style.headerContainer}>
      <div>Account:{account ? `${account}` : ''}</div>
      <div>chainId:{chainId ? `${chainId}` : ''}</div>
      <div onClick={handleConnect}>
        {isActive ? (
          <Tag color="success">已连接，点击断开</Tag>
        ) : (
          <Tag color="error">未连接，点击连接</Tag>
        )}
      </div>
    </div>
  );
};
export default Header;
