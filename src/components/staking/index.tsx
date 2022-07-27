import { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import { makeStakingContract, makeERC20Contract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import {
  STAKING_POOL_ADDRESS,
  PLATFORM_TOKEN_ADDRESS,
} from '@/constants/index';
import { etherToWei, weiToEther } from '@/utils/format';
import toBN from '@/utils/toBN';

interface Props {}
const Staking = (props: Props) => {
  const { account, provider } = useWallet();
  const [value, setValue] = useState('');
  const [amount, setAmount] = useState(''); // 质押池中的质押量
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [allowance, setAllowance] = useState(''); // owner 授权给 spender 的额度

  const handleStake = async () => {
    if (account && provider && value) {
      if (toBN(allowance).lt(value)) {
        message.error('额度不够，请先授权');
        return;
      }
      try {
        setStakeLoading(true);
        const stakingContract = makeStakingContract(
          STAKING_POOL_ADDRESS,
          provider,
          account,
        );
        const tx = await stakingContract.stake(etherToWei(value).toFixed());
        const receipt = await tx.wait();
        if (receipt?.status === 1) {
          message.success('质押成功');
          getData();
        } else {
          message.error('质押失败');
        }
      } catch (error) {
        console.log('error', error);
        message.error('质押失败');
      } finally {
        setStakeLoading(false);
        setValue('');
      }
    }
  };

  const handleUnstake = async () => {
    if (account && provider && value) {
      try {
        setUnstakeLoading(true);
        const stakingContract = makeStakingContract(
          STAKING_POOL_ADDRESS,
          provider,
          account,
        );
        const tx = await stakingContract.unstake(etherToWei(value).toFixed());
        const receipt = await tx.wait();
        if (receipt?.status === 1) {
          message.success('解押成功');
          getData();
        } else {
          message.error('解押失败');
        }
      } catch (error) {
        console.log('error', error);
        message.error('解押失败');
      } finally {
        setUnstakeLoading(false);
        setValue('');
      }
    }
  };

  const getAllowance = () => {
    if (account && provider) {
      const erc20Contract = makeERC20Contract(PLATFORM_TOKEN_ADDRESS, provider);
      erc20Contract
        .allowance(account, STAKING_POOL_ADDRESS)
        .then((val) => {
          setAllowance(toBN(weiToEther(val)).toFixed());
          console.log(toBN(weiToEther(val)).toFixed());
        })
        .catch(() => message.error('查询失败'));
    }
  };

  const getAmount = async () => {
    if (account && provider) {
      try {
        const erc20Contract = makeERC20Contract(
          PLATFORM_TOKEN_ADDRESS,
          provider,
        );
        const amount = await erc20Contract.balanceOf(STAKING_POOL_ADDRESS);
        setAmount(weiToEther(amount).toFixed());
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const getData = () => {
    getAmount();
    getAllowance();
  };

  useEffect(() => {
    if (provider && account) {
      getData();
    }
  }, [provider, account]);

  return (
    <div>
      <div>
        质押/解押数量（IVLY）：
        <Input
          placeholder="请输入数量"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 200, marginTop: 10 }}
        />
      </div>
      <div style={{ margin: '10px 0' }}>当前质押量：{amount}</div>
      <Button
        type="primary"
        onClick={handleStake}
        loading={stakeLoading}
        style={{ marginRight: 10 }}
      >
        质押
      </Button>
      <Button
        type="primary"
        onClick={handleUnstake}
        loading={unstakeLoading}
        style={{ marginRight: 10 }}
      >
        解押
      </Button>
    </div>
  );
};
export default Staking;
