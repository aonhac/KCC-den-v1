import React from 'react'
import styled from 'styled-components'
import { networks } from '../../constants/networks'
import { ChainId, ChainIds } from '../../connectors/index'
import { getNetworkInfo, web3Utils } from '../../utils/index'
import { Badge, message } from 'antd'
import { theme } from '../../constants/theme'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import { ConnectorNames } from '../../constants/wallet'

export interface NetworkListProps {}

const NetworkListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
`
const Name = styled.div`
  font-size: 12px;
  color: ${theme.colors.primary};
`

const NetworkListItem = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  &:hover ${Name} {
    color: #fff;
  }
`

const NetworkList: React.FunctionComponent<NetworkListProps> = () => {
  const { t } = useTranslation()

  const { login, logout } = useAuth()

  const switchNetwork = async (id: number, e: any) => {
    e.stopPropagation()
    const selectedNetworkInfo = getNetworkInfo(id as any)
    console.log(selectedNetworkInfo)
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3Utils.toHex(selectedNetworkInfo.chain_id).toString() }],
      })
      /*   if (selectedNetworkInfo.chain_id === 321) {
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
          /*  if (selectedNetworkInfo.chain_id === 321) {
            window.location.reload()
          } */
        } catch (addError) {
          message.error(t(`Switch Network failed`))
        }
      }
      // handle other "switch" errors
    }
  }

  const networkList = ChainIds.map((n, index) => {
    const network = getNetworkInfo(n as ChainId)
    if (n) {
      return (
        <NetworkListItem key={index} onClick={switchNetwork.bind(null, n)}>
          <Badge status="success" />
          <Name>{network.fullName}</Name>
        </NetworkListItem>
      )
    }
  })

  return <NetworkListWrap>{networkList}</NetworkListWrap>
}

export default NetworkList
