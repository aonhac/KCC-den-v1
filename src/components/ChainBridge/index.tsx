import React from 'react'
import ChainCard from '../ChainCard'
import styled from 'styled-components'
import { BridgeTitle } from '../../pages/bridge/transfer'
import { useTranslation } from 'react-i18next'
import { ChainBridgeType } from '../../pages/bridge/confirm'
import { useTokenSupporChain, usePariList } from '../../state/bridge/hooks'
import { Tooltip } from 'antd'
import { findPair } from '../../utils/index'
import { useDispatch } from 'react-redux'
import { updateCurrentPairId } from '../../state/bridge/actions'

export interface ChainBridgeProps {
  srcId: any
  distId: any
  pairId?: number
  type: ChainBridgeType
  changeSrcId?: any
  changeDistId?: any
  currency?: any
  changeNetwork?: any
}

const ChainBridgeWrap = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`
const SwapIcon = styled.img<{ disabled: boolean }>`
  width: 20px;
  height: 20px;
  margin: 0 10px;
  cursor: pointer;
  opacity: ${({ disabled }) => {
    if (disabled) {
      return 0.2
    }
    return 1
  }};
  &:hover {
    cursor: ${({ disabled }) => {
      if (disabled) {
        return 'not-allowed'
      }
      return 'pointer'
    }};
  }
`
const ToIcon = styled.img`
  width: 16px;
  height: 8px;
  margin: 0 10px;
  cursor: pointer;
`
export const Box = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    height: auto;
    width: 40%;
    flex: 0;
  }
`

export enum ChainDirection {
  'From',
  'To',
}

const Swap = require('../../assets/images/bridge/transfer.png').default
const To = require('../../assets/images/bridge/to.png').default

const ChainBridge: React.FunctionComponent<ChainBridgeProps> = (props) => {
  const { t } = useTranslation()

  const { srcChainIds, distChainIds } = useTokenSupporChain()

  const dispatch = useDispatch()

  const pairList = usePariList()

  const swapStatus = React.useMemo(() => {
    return srcChainIds.includes(props.distId) && distChainIds.includes(props.srcId)
  }, [props.distId, props.srcId, distChainIds, srcChainIds])

  const swap = () => {
    if (swapStatus) {
      let d = props.distId
      let s = props.srcId
      const id = findPair(d, s, props.currency)
      dispatch(updateCurrentPairId(id))
    }
  }

  const cuclDistChainIds = React.useMemo(() => {
    const ids: number[] = []
    for (let i = 0; i < pairList.length; i++) {
      const chain = pairList[i]
      const srcChainInfo = chain.srcChainInfo
      const distChainInfo = chain.dstChainInfo
      if (srcChainInfo.chainId === props.srcId && !ids.includes(distChainInfo.chainId)) {
        ids.push(distChainInfo.chainId)
      }
    }
    return ids
  }, [props.srcId])

  return (
    <ChainBridgeWrap>
      <Box>
        <BridgeTitle>{t('From')}</BridgeTitle>
        <ChainCard
          direction={ChainDirection.From}
          availableChainIds={srcChainIds}
          networkId={props.srcId}
          oppsiteId={props.distId}
          type={props.type}
          pairId={props.pairId}
          changeNetwork={props.changeSrcId}
          currency={props.currency}
        />
      </Box>
      {props.type === ChainBridgeType.OPERATE ? (
        <>
          {swapStatus ? (
            <SwapIcon disabled={false} src={Swap} onClick={swap} />
          ) : (
            <Tooltip placement="top" title={t(`Can not swap`)}>
              <SwapIcon disabled={!swapStatus} src={Swap} />
            </Tooltip>
          )}
        </>
      ) : (
        <ToIcon src={To} />
      )}

      <Box>
        <BridgeTitle>{t('To')}</BridgeTitle>
        <ChainCard
          direction={ChainDirection.To}
          networkId={props.distId}
          availableChainIds={cuclDistChainIds}
          oppsiteId={props.srcId}
          pairId={props.pairId}
          type={props.type}
          changeNetwork={props.changeDistId}
          currency={props.currency}
        />
      </Box>
    </ChainBridgeWrap>
  )
}

export default ChainBridge
