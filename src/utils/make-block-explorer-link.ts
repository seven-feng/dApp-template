import { curry, get } from 'lodash';
import { CHAIN_PARAMS_MAP } from '@/constants';

export type LinkType = 'address' | 'block' | 'tx' | 'token';

export default function makeExplorerLink(
  type: LinkType,
  hash: string,
  chain: number,
) {
  if (Number.isNaN(chain)) return '';
  const blockExplorerUrls = get(
    CHAIN_PARAMS_MAP,
    [chain, 'blockExplorerUrls'],
    [],
  );
  const host = blockExplorerUrls[0];
  if (!host) return '';
  return `${host}/${type}/${hash}`;
}

const curried = curry(makeExplorerLink);

// 交易
export const makeTxLink = curried('tx');
// 账户
export const makeAddressLink = curried('address');
// 块
export const makeBlockLink = curried('block');
// 币种
export const makeTokenLink = curried('token');
