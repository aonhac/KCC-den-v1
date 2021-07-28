import React from 'react'
import styled from 'styled-components'
import { Badge } from 'antd'
import { ChainId, ChainIds, ChainKeys } from '../../connectors'
import { getNetworkInfo } from '../../utils'
import { theme } from '../../constants/theme'
import { switchNetwork } from '../../utils/wallet'
import { MAIN_NETWORKS, networks, TEST_NETWORKS } from '../../constants/networks'

export interface NetworkListProps {}

const NetworkListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
  background: #1e1e21;
  border-radius: 8px;
  position: relative;
  top: 10px;
  left: -30px;
  @media (max-width: 768px) {
    box-shadow: 1px -1px 5px rgba(255, 255, 255, 0.5);
  }
`

export const Triangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom: 8px solid #1e1e21;
  top: -15px;
  left: 60px;
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
  const switchSrcChain = async (id: number, e: any) => {
    e.stopPropagation()
    const selectedNetworkInfo = getNetworkInfo(id as any)
    await switchNetwork(selectedNetworkInfo.chain_id as any)
  }

  const networkList = ChainKeys.map((key, index) => {
    const network = getNetworkInfo(Number(key) as any)
    const keys = Reflect.ownKeys(networks)
    if (keys.includes(key) && key !== '0') {
      return (
        <NetworkListItem key={index} onClick={switchSrcChain.bind(null, Number(key))}>
          <Badge status="success" />
          <Name>{network.fullName}</Name>
        </NetworkListItem>
      )
    }
  })

  return (
    <NetworkListWrap>
      <Triangle />
      {networkList}
    </NetworkListWrap>
  )
}

export default NetworkList
