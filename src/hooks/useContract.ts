import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Contract,
  ContractFactory,
  Overrides,
  ContractTransaction,
  ContractInterface,
} from '@ethersproject/contracts';
import { BytesLike } from '@ethersproject/bytes';

import ERC20ABI from '@/abi/erc20.json';
import StakingABI from '@/abi/staking.json';

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  // account存在返回signer，否则返回provider，交易需要signer签名
  return account ? library.getSigner(account) : library;
}

export function deployContract(
  ABI: ContractInterface,
  byteCode: BytesLike,
  library: Web3Provider,
  account?: string,
) {
  return new ContractFactory(ABI, byteCode, library.getSigner(account));
}

export function makeContract<T extends Contract>(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
): T {
  const provider = getProviderOrSigner(library, account) as Web3Provider;
  return new Contract(address, ABI, provider) as T;
}

// ERC20合约类型
export interface ERC20Contract extends Contract {
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<BigNumber>;
  totalSupply: () => Promise<BigNumber>;
  balanceOf: (account: string) => Promise<BigNumber>;
  transfer: (
    to: string,
    amount: string,
    overrides?: Overrides,
  ) => Promise<ContractTransaction>; // 转账
  approve: (address: string, amount: string) => Promise<ContractTransaction>; // 授权
  allowance: (
    accountAddress: string, // 用户账户地址
    spenderAddress: string, // 要授权的合约的地址
  ) => Promise<BigNumber>;
}

export function makeERC20Contract(
  address: string,
  library: Web3Provider,
  account?: string,
) {
  return makeContract<ERC20Contract>(address, ERC20ABI, library, account);
}

export interface StakingContract extends Contract {
  /** 质押 */
  stake: (amount: string) => Promise<ContractTransaction>;
  /** 解押 */
  unstake: (amount: string) => Promise<ContractTransaction>;
}

/** Staking合约 */
export function makeStakingContract(
  address: string,
  library: Web3Provider,
  account?: string,
) {
  return makeContract<StakingContract>(address, StakingABI, library, account);
}
