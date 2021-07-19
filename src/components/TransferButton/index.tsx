import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { theme } from '../../constants/theme'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { toggleConnectWalletModalShow } from '../../state/wallet/actions'
import { withRouter } from 'react-router-dom'
import { useHistory } from 'react-router'
import { CheckListType } from '../../pages/bridge/transfer'
import { getPairInfo, getNetworkInfo, web3Utils } from '../../utils/index'
import { message } from 'antd'
import { switchNetwork } from '../../utils/wallet'

export interface TransferButtonProps {
  applyApprove: any
  generateOrder: any
  checkList: CheckListType
  pairId: number
  amount: string
  bridgeStatus: string
}

const TransferButtonWrap = styled.div`
  margin-top: 20px;
`
export const BaseButton = styled.div`
  height: 48px;
  background: ${theme.colors.bridgePrimay};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  user-select: none;
  letter-space: 1px;
`
const HistoryText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #00dea9;
  line-height: 22px;
  text-align: center;
  cursor: pointer;
  &:hover {
    font-weight: bold;
    text-decoration: underline;
  }
`
const DisabledButton = styled(BaseButton)`
  background: #e4f3f2;
  cursor: not-allowed;
  color: #ccc;
`

const TransferButton: React.FunctionComponent<TransferButtonProps> = ({
  applyApprove,
  generateOrder,
  checkList,
  pairId,
  amount,
  bridgeStatus,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const history = useHistory()

  const dispatch = useDispatch()

  const connect = () => {
    dispatch(toggleConnectWalletModalShow({ show: true }))
  }

  const next = () => {
    generateOrder()
    history.push('/bridge/confirm')
  }

  const selectedPairInfo = React.useMemo(() => {
    return getPairInfo(pairId)
  }, [pairId])

  const selectedNetworkInfo = React.useMemo(() => {
    return getNetworkInfo(selectedPairInfo?.srcChainInfo.chainId as any)
  }, [selectedPairInfo])

  const allStatus = React.useMemo(() => {
    console.log(checkList)
    const keys = Reflect.ownKeys(checkList)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (!checkList[key as keyof CheckListType]) {
        return false
      }
    }
    return true
  }, [checkList])

  const switchSrcChain = async () => {
    await switchNetwork(selectedNetworkInfo.chain_id)
  }

  // not connect
  if (!account) {
    return (
      <TransferButtonWrap>
        <BaseButton onClick={connect}>{t(`Connect your wallet`)}</BaseButton>
      </TransferButtonWrap>
    )
  }

  if (!bridgeStatus) {
    return (
      <TransferButtonWrap>
        <DisabledButton>{t(`KCC bridge under maintenance`)}</DisabledButton>
      </TransferButtonWrap>
    )
  }

  // not select pair
  if (pairId === -1) {
    return (
      <TransferButtonWrap>
        <DisabledButton>{t(`No Available Network`)}</DisabledButton>
      </TransferButtonWrap>
    )
  }

  // switch network
  if (!checkList.network) {
    return (
      <TransferButtonWrap>
        <BaseButton onClick={switchSrcChain}>
          {t(`Switch Network`)} {selectedNetworkInfo?.fullName}
        </BaseButton>
        <HistoryText onClick={() => history.push('/bridge/list')}>{t(`Transaction History`)}</HistoryText>
      </TransferButtonWrap>
    )
  }

  if (!allStatus || amount === '') {
    let key = ''
    if (!checkList.senderWhite) {
      key = `Sender is not in whiteList`
    } else if (!checkList.receiverWhite) {
      key = `Receiver is not in whiteList`
    } else if (!checkList.senderBlack) {
      key = `Sender is in blackList`
    } else if (!checkList.receiverBlack) {
      key = `Receiver is in blackList`
    } else if (!checkList.totolSupply) {
      key = `Get bridge balance failed`
    } else if (!checkList.swapFee) {
      key = `Get transfer fee failed`
    } else if (!checkList.available) {
      key = `Get account available balance failed`
    } else {
      // not approve
      if (!checkList.approve && amount !== '') {
        return (
          <TransferButtonWrap>
            <BaseButton onClick={applyApprove}>{t(`Approved`)}</BaseButton>
            <HistoryText onClick={() => history.push('/bridge/list')}>{t(`Transaction History`)}</HistoryText>
          </TransferButtonWrap>
        )
      }
      key = `Next`
    }

    return (
      <TransferButtonWrap>
        <DisabledButton>{t(`${key}`)}</DisabledButton>
        <HistoryText onClick={() => history.push('/bridge/list')}>{t(`Transaction History`)}</HistoryText>
      </TransferButtonWrap>
    )
  }

  // all check is pass
  return (
    <TransferButtonWrap>
      <BaseButton onClick={next}>{t(`Next`)}</BaseButton>
      <HistoryText onClick={() => history.push('/bridge/list')}>{t(`Transaction History`)}</HistoryText>
    </TransferButtonWrap>
  )
}

export default withRouter<any, any>(React.memo(TransferButton))
