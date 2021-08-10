import { Dropdown, Menu } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { networks } from '../../constants/networks'
import { ChainIds, ChainId } from '../../connectors/index'
import { ChainDirection } from '../ChainBridge'
import { ChainBridgeType } from '../../pages/bridge/confirm'
import { getNetworkInfo, findPair } from '../../utils/index'
import { FrownOutlined } from '@ant-design/icons'
import { Currency } from '../../state/bridge/reducer'
import { useDispatch } from 'react-redux'
import { updateCurrentPairId } from '../../state/bridge/actions'

interface ChainCardProps {
  dropdownShow?: boolean
  setDropdownShow?: any
  setOppsiteDropdownShow?: any
  networkId: ChainId
  direction: ChainDirection
  type: ChainBridgeType
  changeNetwork?: any
  oppsiteId?: ChainId
  pairId?: number
  availableChainIds?: number[]
  currency?: Currency
}

const ChainCardWrap = styled.div`
  width: 100%;
  height: 120px;
  background: rgba(1, 8, 30, 0.04);
  border-radius: 4px;
  padding: 12px;
  position: relative;
  flex: 1;
  @media (max-width: 768px) {
    height: auto;
    width: 130px;
  }
`
const ChainLogo = styled.img`
  width: 40px;
  height: 40px;
  background: #d8d8d8;
  border-radius: 50%;
`
const Name = styled.div`
  width: auto;
  max-width: 140px;
  border-radius: 4px;
  color: #000621;
  margin-top: 18px;
`

const SelectIcon = styled.img<{ show: boolean }>`
  width: 12px;
  height: 12px;
  transition: all 0.2s ease-in-out;
  transform: ${({ show }) => {
    if (show) {
      return 'rotate(180deg)'
    }
    return 'rotate(0deg)'
  }};
`
const SelectWrap = styled.div`
  position: absolute;
  padding-top: 20px;
  padding-left: 20px;
  width: 60px;
  height: 60px;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const ChainItem = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  width: 100%;
  padding: 4px 10px;
  opacity: ${({ disabled }) => {
    if (disabled) {
      return 0.3
    }
    return 1
  }};

  cursor: ${({ disabled }) => {
    if (disabled) {
      return 'no-drop !important'
    }
    return 'pointer'
  }};

  pointer-events: ${({ disabled }) => {
    if (disabled) {
      return 'none'
    }
    return ''
  }};

  &:hover {
    background: #f3f3f5;
  }
`
const ChainIcon = styled.img`
  width: 28px;
  height: 28px;
  background: #d8d8d8;
  border-radius: 50%;
`

const ChainName = styled.span`
  height: 22px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: rgba(1, 8, 30, 0.87);
  line-height: 22px;
  margin-left: 8px;
`
const DropdownWrap = styled.div`
  border-radius: 4px;
  background: #fff;
  width: 240px;
`

const ChainCard: React.FunctionComponent<ChainCardProps> = ({
  availableChainIds,
  type,
  networkId,
  changeNetwork,
  oppsiteId,
  direction,
  currency,
  setDropdownShow,
  dropdownShow,
  setOppsiteDropdownShow,
}) => {
  const network = React.useMemo(() => {
    return getNetworkInfo(networkId)
  }, [networkId])

  const dispatch = useDispatch()

  const getDisabledStatus = (id: number) => {
    if (id === networkId) {
      return true
    }
    if (id === oppsiteId) {
      return true
    }
    if (!availableChainIds?.includes(id)) {
      return true
    }
    return false
  }

  const clickNetwork = (id: number) => {
    // changeNetwork(id)
    if (!currency) return
    const findId =
      direction === ChainDirection.From ? findPair(id, oppsiteId, currency) : findPair(oppsiteId, id, currency)
    dispatch(updateCurrentPairId(findId))
    setDropdownShow(() => false)
  }

  const menuList = ChainIds.map((id: any, index) => {
    const net = (networks as any)[id]
    if (id !== 0) {
      return (
        <ChainItem key={id} disabled={getDisabledStatus(id)} onClick={clickNetwork.bind(null, id)}>
          <ChainIcon src={net?.logo} />
          <ChainName>{net?.fullName}</ChainName>
        </ChainItem>
      )
    }
  })

  const menu = <DropdownWrap onMouseLeave={() => setDropdownShow(() => false)}>{menuList}</DropdownWrap>

  return (
    <ChainCardWrap>
      {networkId === 0 ? (
        <FrownOutlined
          style={{ width: '40px', height: '40px', fontSize: '40px', color: '#000', borderRadius: '50%' }}
        />
      ) : (
        <ChainLogo src={network?.logo} />
      )}

      <Name>{network?.fullName}</Name>
      {type === ChainBridgeType.OPERATE ? (
        <SelectWrap>
          <Dropdown overlay={menu} placement={'bottomLeft'} visible={dropdownShow} trigger={['click']}>
            <SelectIcon
              show={dropdownShow ?? false}
              src={require('../../assets/images/bridge/down.png').default}
              onClick={() => {
                setOppsiteDropdownShow(false)
                setDropdownShow(() => true)
              }}
            />
          </Dropdown>
        </SelectWrap>
      ) : null}
    </ChainCardWrap>
  )
}

export default ChainCard
