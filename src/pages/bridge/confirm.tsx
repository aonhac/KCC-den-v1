import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ChainBridge from '../../components/ChainBridge'
import { BaseButton } from '../../components/TransferButton'
import ConfirmItem from '../../components/ConfirmItem'
import { NoFeeText, TransferOrder, TransferWrap } from './transfer'
import { Button, notification, Tooltip } from 'antd'
import BridgeTitlePanel from '../../components/BridgeTitlePanel/index'
import { getPairInfo, getNetworkInfo } from '../../utils/index'
import { getBridgeContract } from '../../utils/contract'
import { useWeb3React } from '@web3-react/core'
import { updateBridgeLoading } from '../../state/application/actions'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'
import useLocalStorageState from 'react-use-localstorage'
import { UnconfirmOrderKey } from '../../utils/task'
import { PairInfo } from '../../state/bridge/reducer'
import { useHistory } from 'react-router-dom'
import { useBridgeLoading } from '../../state/application/hooks'
import i18next from 'i18next'
import { CenterRow } from '../../components/Row'
import { switchNetwork, addTokenToWallet } from '../../utils/wallet'

export enum ChainBridgeType {
  'DISPLAY',
  'OPERATE',
}
export interface BridgeTransferPageProps {}

const BridgeConfirmWrap = styled.div`
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  min-height: calc(100vh - 400px);
  @media (max-width: 768px) {
    min-height: 100%;
  }
`

const FeeAmmount = styled.span`
  padding-top: 2px;
  font-size: 14px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #31d7a0;
`

export const MoreInfo = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 3px;
  cursor: pointer;
  position: relative;
  top: -1px;
`

export const AddAssets = styled.div`
  position: relative;
  left: -20px;
`

const Box = styled.div`
  margin-top: 40px;
`

const ButtonText = styled.span`
  font-size: 16px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #ffffff;
  line-height: 16px;
  height: 16px;
  padding-top: 2px;
  letter-spacing: 1px;
`

export const Text = styled.div`
  color: #fff;
`

export type UnconfirmOrderListType = TransferOrder & { saveTime: number; saveHash: string }

const BridgeTransferPage: React.FunctionComponent<BridgeTransferPageProps> = () => {
  const { t } = useTranslation()

  const { library, account } = useWeb3React()

  const history = useHistory()

  const [unconfirmOrderList, setUnconfirmOrderList] = useLocalStorageState(UnconfirmOrderKey)

  const bridgeLoading = useBridgeLoading()

  let orderRaw: TransferOrder

  try {
    orderRaw = JSON.parse(localStorage.getItem('PRESEND_ORDER') as any) as TransferOrder
  } catch {
    history.push('/bridge/transfer')
    return null
  }

  if (!orderRaw) {
    history.push('/bridge/transfer')
    return null
  }

  const order: TransferOrder = orderRaw
  const selectedChainInfo = getPairInfo(order.pairId)
  const networkInfo = getNetworkInfo(selectedChainInfo?.srcChainInfo.chainId as any)

  React.useEffect(() => {
    if (!account) {
      history.push('/bridge/transfer')
    }
  }, [])

  const dispatch = useDispatch()

  const back2transfer = () => {
    history.push('/bridge/transfer', { a: 1 })
  }

  const receiveAmount = React.useMemo(() => {
    if (!selectedChainInfo?.srcChainInfo) return
    let receiveAmount = ''
    if (selectedChainInfo?.srcChainInfo.tag === 0) {
      receiveAmount = new BN(order.amount).minus(order.fee).toString()
      return new BN(receiveAmount).div(Math.pow(10, networkInfo.decimals)).toString()
    } else {
      receiveAmount = new BN(order.amount).toString()
      return new BN(receiveAmount).div(Math.pow(10, selectedChainInfo?.srcChainInfo.decimals)).toString()
    }
  }, [order.fee, order])

  const saveUnconfirmOrder = (order: TransferOrder, hash: string) => {
    setUnconfirmOrderList(
      JSON.stringify([...JSON.parse(unconfirmOrderList), { ...order, saveHash: hash, saveTime: new Date().getTime() }])
    )
  }

  const addTokenToMetaMask = async () => {
    if (!selectedChainInfo) return
    await switchNetwork(selectedChainInfo?.dstChainInfo.chainId as any).then((res) => {
      addTokenToWallet(selectedChainInfo?.dstChainInfo as any).then(() => {
        notification.destroy()
      })
    })
  }

  /**
   * @description  transfer native token
   */
  const nativeTransfer = (contract: any, selectedChainInfo: PairInfo) => {
    const amount = new BN(order.amount).toString()
    contract.methods
      .depositNative(order.receiver, selectedChainInfo.dstChainInfo.chain.toLowerCase())
      .send({
        from: `${account}`,
        value: amount,
      })
      .once('sending', () => {
        dispatch(updateBridgeLoading({ visible: true, status: 0 }))
      })
      .once('transactionHash', (hash: string) => {
        console.log('hash', hash)
        localStorage.removeItem('PRESEND_ORDER')
        saveUnconfirmOrder(order, hash)
      })
      .once('confirmation', (confirmations: number) => {
        if (bridgeLoading.visible) {
          dispatch(updateBridgeLoading({ visible: true, status: 1 }))
          setTimeout(() => {
            dispatch(updateBridgeLoading({ visible: false, status: 0 }))
            history.push('/bridge/list')
          }, 2000)
        } else {
          dispatch(updateBridgeLoading({ visible: false, status: 0 }))
          notification.success({ message: i18next.t(`App Tips`), description: i18next.t(`Transaction Confirmed`) })
        }
      })
      .on('error', () => {
        dispatch(updateBridgeLoading({ visible: false, status: 0 }))
      })
  }

  const tokenTransfer = (contract: any, selectedChainInfo: PairInfo) => {
    const tokenAddress = selectedChainInfo.srcChainInfo.contract
    contract.methods
      .depositToken(tokenAddress, `${order.amount}`, order.receiver, selectedChainInfo.dstChainInfo.chain.toLowerCase())
      .send({
        from: account,
        value: `${order.fee}`,
      })
      .once('sending', () => {
        dispatch(updateBridgeLoading({ visible: true, status: 0 }))
      })
      .once('transactionHash', (hash: string) => {
        console.log('hash', hash)
        localStorage.removeItem('PRESEND_ORDER')
        saveUnconfirmOrder(order, hash)
      })
      .once('confirmation', (confirmations: number) => {
        console.log(confirmations)

        // add  token to  dist chain metamask
        if (bridgeLoading.visible) {
          dispatch(updateBridgeLoading({ visible: true, status: 1 }))
          setTimeout(() => {
            dispatch(updateBridgeLoading({ visible: false, status: 0 }))
            history.push('/bridge/list')
          }, 2000)
        } else {
          dispatch(updateBridgeLoading({ visible: false, status: 0 }))
          notification.success({ message: i18next.t(`App Tips`), description: i18next.t(`Transaction Confirmed`) })
        }

        const addAsset = (
          <CenterRow>
            <Button type="link" onClick={addTokenToMetaMask}>
              <AddAssets>{t(`Add assets to the wallet list`)}</AddAssets>
            </Button>
          </CenterRow>
        )
        notification.success({
          message: i18next.t(`App Tips`),
          description: addAsset,
          duration: 0,
        })
      })
      .on('error', () => {
        dispatch(updateBridgeLoading({ visible: false, status: 0 }))
      })
  }

  /**
   * @description some condition check before transfer
   */
  const transfer = async () => {
    if (!selectedChainInfo?.srcChainInfo) return
    const contract = getBridgeContract(networkInfo.bridgeCoreAddress, library)
    if (selectedChainInfo)
      if (selectedChainInfo.srcChainInfo.tag === 0) {
        // native
        nativeTransfer(contract, selectedChainInfo)
      } else {
        // token
        tokenTransfer(contract, selectedChainInfo)
      }
  }

  return (
    <BridgeConfirmWrap>
      <TransferWrap>
        <BridgeTitlePanel title={t('Transfer confirmation')} iconEvent={back2transfer} />
        <ChainBridge srcId={order?.srcId} distId={order?.distId} type={ChainBridgeType.DISPLAY} />
        <Box>
          <ConfirmItem
            title={t('Amount')}
            content={`${new BN(order?.amount)
              .div(Math.pow(10, selectedChainInfo?.srcChainInfo.decimals as any))
              .toString()} ${order?.currency.symbol.toUpperCase()}`}
          />
          <ConfirmItem
            title={t('Amount received')}
            content={`${receiveAmount} ${order?.currency.symbol.toUpperCase()}`}
          />
          <ConfirmItem title={t('Transfer fee')}>
            <FeeAmmount>
              {networkInfo?.fee ? <NoFeeText>{networkInfo?.fee}</NoFeeText> : null}
              {`${new BN(order.fee)
                .div(Math.pow(10, networkInfo?.decimals))
                .toString()} ${networkInfo?.symbol.toUpperCase()}`}
            </FeeAmmount>
            {networkInfo?.fee ? (
              <Tooltip
                title={
                  <Text>{t(`During the trial operation period, the handling fee is free for a limited time.`)}</Text>
                }
              >
                <MoreInfo src={require('../../assets/images/bridge/question.png').default} />
              </Tooltip>
            ) : null}
          </ConfirmItem>
        </Box>
        <ConfirmItem title={t('Receiving address')} content={order.receiver} />
        <BaseButton onClick={transfer} style={{ marginTop: '32px' }}>
          <ButtonText>{t(`Transfer`)}</ButtonText>
        </BaseButton>
      </TransferWrap>
    </BridgeConfirmWrap>
  )
}

export default BridgeTransferPage
