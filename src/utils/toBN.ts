import { BigNumber } from 'bignumber.js';
import { BigNumberLike } from '@/interface';

export default function toBN(n: BigNumberLike) {
  if (!n) return new BigNumber(0);
  return new BigNumber(n.toString());
}
