import { message } from 'antd'
import i18next from 'i18next'
import { getNetworkInfo, web3Utils } from './index'

export const switchNetwork = async (id: number) => {
  const selectedNetworkInfo = getNetworkInfo(id as any)
  console.log(selectedNetworkInfo)
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3Utils.toHex(selectedNetworkInfo.chain_id).toString() }],
    })
    /*  if (selectedNetworkInfo.chain_id === 321) {
      window.location.reload()
    } */
  } catch (error) {
    console.log(error)
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3Utils.toHex(selectedNetworkInfo.chain_id).toString(), // A 0x-prefixed hexadecimal string
              chainName: selectedNetworkInfo.fullName,
              nativeCurrency: {
                name: selectedNetworkInfo.symbol,
                symbol: selectedNetworkInfo.symbol.toUpperCase(), // 2-6 characters long
                decimals: selectedNetworkInfo.decimals,
              },
              rpcUrls: [selectedNetworkInfo.rpc],
              blockExplorerUrls: [selectedNetworkInfo.browser],
              iconUrls: [selectedNetworkInfo.logo],
            },
          ],
        })
        /* if (selectedNetworkInfo.chain_id === 321) {
          window.location.reload()
        } */
      } catch (addError) {
        message.error(i18next.t(`Switch Network failed`))
      }
    }
    // handle other "switch" errors
  }
}
