import { formatUnits, parseUnits } from '@ethersproject/units';
import toBN from '@/utils/toBN';
import { BigNumberLike } from '@/interface';

export function etherToWei(ether: BigNumberLike, decimals = 18) {
  const amount = toBN(ether).toFixed();
  return toBN(parseUnits(amount, decimals));
}

export function weiToEther(wei: BigNumberLike, decimals = 18) {
  const amount = toBN(wei).toFixed();
  return toBN(formatUnits(amount, decimals));
}
