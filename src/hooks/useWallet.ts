import { metaMask, hooks } from '@/connectors';

import { CHAIN_PARAMS_MAP, DEFAULT_CHAIN_ID } from '@/constants';
import { AddTokenParams } from '@/interfaces';

export function useWallet() {
  const { useChainId, useAccount, useIsActive, useProvider } = hooks;
  const isActive = useIsActive();
  const provider = useProvider();
  const chainId = useChainId();
  const account = useAccount();

  function connect(chainId: number = DEFAULT_CHAIN_ID) {
    metaMask.activate(chainId && CHAIN_PARAMS_MAP[chainId]);
  }

  function connectEagerly() {
    metaMask.connectEagerly();
  }

  function disconnect() {
    metaMask.resetState();
  }

  const addTokenToWallet = (params: AddTokenParams) => {
    const { address, symbol, decimals, image } = params;
    metaMask.provider &&
      metaMask.provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
      });
  };

  function signMessage(str: string) {
    if (provider?.getSigner) {
      const signer = provider?.getSigner();
      return signer?.signMessage(str);
    }
    return Promise.resolve('');
  }

  return {
    isActive,
    account,
    chainId,
    provider,
    connect,
    connectEagerly,
    disconnect,
    addTokenToWallet,
    signMessage,
  };
}
