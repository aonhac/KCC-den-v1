import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Badge } from 'antd'
import { ChainId, ChainIds } from '../../connectors/index'
import { getNetworkInfo } from '../../utils/index'
import { theme } from '../../constants/theme'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import { switchNetwork } from '../../utils/wallet'

export interface NetworkListProps {}

const NetworkListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
  // border: 1px solid ${theme.colors.primary};
  background: #1e1e21;
  border-radius: 8px;
  position: relative;
  top: 10px;
  left: -30px;
  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 1);
  }
`

export const Triangle = styled.div`
  position: absolute;
  width: 0px;
  height: 0px;
  border: 8px solid transparent;
  border-bottom: 8px solid #1e1e21;
  top: -15px;
  left: 60px;
`
const Name = styled.div`
  font-size: 12px;
  color: ${theme.colors.primary};
  @media (max-width: 768px) {
    color: #000;
  }
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

const AnimationBadge = styled(Badge)``

const NetworkList: React.FunctionComponent<NetworkListProps> = () => {
  const { t } = useTranslation()

  const { login, logout } = useAuth()

  const switchSrcChain = async (id: number, e: any) => {
    e.stopPropagation()
    const selectedNetworkInfo = getNetworkInfo(id as any)
    await switchNetwork(selectedNetworkInfo.chain_id as any)
  }

  const networkList = ChainIds.map((n, index) => {
    const network = getNetworkInfo(n as ChainId)
    if (n) {
      return (
        <NetworkListItem key={index} onClick={switchSrcChain.bind(null, n)}>
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
