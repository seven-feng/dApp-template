import { useEffect, useState } from 'react';
import { Input, Button, Alert, message } from 'antd';
import {
  STAKING_POOL_ADDRESS,
  PLATFORM_TOKEN_ADDRESS,
} from '@/constants/index';
import { makeERC20Contract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { etherToWei, weiToEther } from '@/utils/format';
import toBN from '@/utils/toBN';

import style from './index.less';

interface Props {}
const Approve = (props: Props) => {
  const { account, provider } = useWallet();
  const [token, setToken] = useState(PLATFORM_TOKEN_ADDRESS); // 代币地址
  const [spender, setSpender] = useState(STAKING_POOL_ADDRESS); // spender 地址
  const [value, setValue] = useState(''); // 授权额度
  const [allowance, setAllowance] = useState(''); // owner 授权给 spender 的额度
  const [allowanceLoading, setAllowanceLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleApprove = async () => {
    if (account && provider && token && spender && value) {
      try {
        setApproveLoading(true);
        const erc20Contract = makeERC20Contract(
          PLATFORM_TOKEN_ADDRESS,
          provider,
          account,
        );
        const tx = await erc20Contract.approve(
          spender,
          etherToWei(value).toFixed(),
        );
        const receipt = await tx.wait();
        if (receipt?.status === 1) {
          message.success('授权成功');
          getAllowance();
        } else {
          message.error('授权失败');
        }
      } catch (error) {
        console.log('error', error);
        message.error('授权失败');
      } finally {
        setApproveLoading(false);
        setValue('');
      }
    }
  };

  const cancelApprove = async () => {
    if (account && provider && token && spender) {
      try {
        setCancelLoading(true);
        const erc20Contract = makeERC20Contract(
          PLATFORM_TOKEN_ADDRESS,
          provider,
          account,
        );
        const tx = await erc20Contract.approve(spender, '0');
        const receipt = await tx.wait();
        if (receipt?.status === 1) {
          message.success('取消授权成功');
          getAllowance();
        } else {
          message.error('取消授权失败');
        }
      } catch (error) {
        console.log('error', error);
        message.error('取消授权失败');
      } finally {
        setCancelLoading(false);
      }
    }
  };

  const getAllowance = () => {
    if (account && provider && token && spender) {
      setAllowanceLoading(true);
      const erc20Contract = makeERC20Contract(token, provider);
      erc20Contract
        .allowance(account, spender)
        .then((val) => {
          setAllowance(toBN(val).toFixed());
          setAllowanceLoading(false);
          message.success('查询成功');
        })
        .catch(() => message.error('查询失败'));
    }
  };

  useEffect(() => {
    getAllowance();
  }, [account, provider, token, spender]);

  return (
    <div className={style.approveContainer}>
      <div>
        <Alert
          message="授权 spender 可以从我们账户最多转移代币的数量
        value，可以多次转移，总量不超过 value"
          type="success"
        />
        <Alert message="取消授权：将授权额度 value 置为 0" type="warning" />
        <Alert
          message={`平台代币地址：${PLATFORM_TOKEN_ADDRESS}`}
          type="info"
        />
        <Alert message={`质押池地址：${STAKING_POOL_ADDRESS}`} type="info" />
      </div>
      <div>
        代币地址 token：
        <Input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: 500, marginTop: 10 }}
        />
      </div>
      <div>
        账户地址 spender：
        <Input
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
          style={{ width: 500, marginTop: 10 }}
        />
      </div>
      <div>
        授权额度 value（IVYL）：
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 500, marginTop: 10 }}
        />
      </div>
      <div>
        <Button
          type="primary"
          onClick={getAllowance}
          loading={allowanceLoading}
          style={{ marginRight: 10 }}
        >
          查询
        </Button>
        owner 授权给 spender 的额度：
        {`${weiToEther(allowance)} IVYL = ${allowance} wei`}
      </div>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" onClick={handleApprove} loading={approveLoading}>
          授权
        </Button>
        <Button
          onClick={cancelApprove}
          loading={cancelLoading}
          style={{ marginLeft: 10 }}
        >
          取消授权
        </Button>
      </div>
    </div>
  );
};
export default Approve;
