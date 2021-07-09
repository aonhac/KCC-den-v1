import React from 'react'
import styled from 'styled-components'
import BridgeTitlePanel from '../../components/BridgeTitlePanel'
import { TransferWrap } from './transfer'
import { useHistory } from 'react-router-dom'
import { CenterRow } from '../../components/Row'
import { RightOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { getNetworkInfo, getPairInfo } from '../../utils/index'
import { PairInfo } from '../../state/bridge/reducer'
import { useTranslation } from 'react-i18next'
import BN from 'bignumber.js'
import { BridgeService } from '../../api/bridge'
import { useWeb3React } from '@web3-react/core'
import { BaseButton } from '../../components/TransferButton'

export interface BridgeListPageProps {}

const BridgeListWrap = styled.div`
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  min-height: calc(100vh - 400px);
`

const HistoryWrap = styled(TransferWrap)`
  background: linear-gradient(180deg, #f5fffc 0%, #feffff 100%);
  height: 520px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`

const HistoryListWrap = styled.div`
  width: 100%;
  margin-bottom: 0px;
  margin-top: 24px;
  overflow: scroll;
`

const Order = styled.div`
  height: 110px;
  padding: 17px 10px 0px 5px;

  & + & {
    border-top: 1px solid rgba(1, 8, 30, 0.08);
  }

  &:hover {
    cursor: pointer;
    background: rgba(49, 215, 160, 0.08);
  }
`

const Number = styled.span`
  font-size: 20px;
  font-family: URWDIN-Bold, URWDIN;
  font-style: italic;
  font-weight: normal;
  color: rgba(0, 6, 33, 0.87);
  margin-right: 12px;
  padding-top: 2px;
`

const NetworkWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`

const NetworkName = styled.span`
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #000426;
  width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`
const NetWorkDirectionIcon = styled.img`
  width: 16px;
  height: 7px;
  margin: 8px;
`
const Title = styled.div`
  font-size: 12px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: rgba(0, 0, 58, 0.6);
`

const Content = styled.div`
  font-size: 12px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #000132;
`
const Fee = styled.div`
  font-size: 12px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #31d7a0;
`

const EmptyWrap = styled.div`
  background: linear-gradient(180deg, #f5fffc 0%, #feffff 100%);
  width: 100%;
  height: 380px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

const EmptyIcon = styled.img`
  width: 84px;
  height: 71px;
`

const EmptyText = styled.div`
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: rgba(1, 8, 30, 0.6);
  margin-top: 18px;
`

const OrderDetailWrap = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`

const Left = styled.div`
  width: 50%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`

const OrderDetaiItem = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
`

const Right = styled.div`
  justify-self: flex-end;
  display: flex;
  flex-flow: column nowrap;
  ${OrderDetaiItem} {
    text-align: right;
    align-items: flex-end;
  }
`

const StatusRow = styled.div`
  display: flex;
  width: auto;
  align-items: center;
`

const ButtonText = styled.span`
  font-size: 14px;
  color: #ffffff;
  line-height: 16px;
  height: 16px;
  letter-spacing: 1px;
`
export interface History {
  createTime: string
  updateTime: string
  id: number
  orderSn: string
  pairId: number
  srcChain: string
  srcCurrency: string
  srcBlockNumber: number
  srcTxHash: string
  srcLogIndex: number
  srcAddress: string
  srcAmount: string
  srcFee: string
  srcContract: string
  dstChain: string
  dstCurrency: string
  dstBlockNumber: number
  dstTxHash: string
  dstLogIndex: number
  dstAddress: string
  dstAmount: string
  dstContract: string
  status: string
  comment: string
}

const DirectionIcon = require('../../assets/images/bridge/to.png').default

const BridgeListPage: React.FunctionComponent<BridgeListPageProps> = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [totalPage, setTotalPage] = React.useState<number>(0)
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [historyList, setHistoryList] = React.useState<History[]>([])

  const history = useHistory()

  const getHistoryList = async () => {
    if (!account) return
    try {
      setLoading(() => true)
      const res = await BridgeService.transitionList(account, 1, currentPage, 50)
      console.log(res.data.data)
      if (res?.data.data) {
        setHistoryList(() => res.data.data)
      }
    } finally {
      setLoading(() => false)
    }
  }

  React.useEffect(() => {
    getHistoryList()
  }, [])

  React.useEffect(() => {
    getHistoryList()
  }, [account])

  const nav2transfer = () => {
    history.push('/bridge/transfer')
  }

  const list = historyList.map((transaction, index) => {
    const no = index + 1
    const selectedPairInfo = getPairInfo(transaction.pairId) as PairInfo
    const srcNetworkInfo = getNetworkInfo(selectedPairInfo.srcChainInfo.chainId)
    const distNetworkInfo = getNetworkInfo(selectedPairInfo.dstChainInfo.chainId)

    return (
      <Order>
        <CenterRow>
          <Number>{no < 10 ? `0${no}` : `${no}`}</Number>
          <NetworkIcon />
          <NetworkName>{srcNetworkInfo.fullName}</NetworkName>
          <NetWorkDirectionIcon src={DirectionIcon} />
          <NetworkIcon />
          <NetworkName>{distNetworkInfo.fullName}</NetworkName>
        </CenterRow>
        <OrderDetailWrap>
          <Left>
            <OrderDetaiItem>
              <Title>{t(`Asset`)}:</Title>
              <Content>{transaction.srcCurrency.toUpperCase()}</Content>
            </OrderDetaiItem>
            <OrderDetaiItem>
              <Title>{t(`Amount`)}:</Title>
              <Content>{new BN(transaction.dstAmount).toFixed(6)}</Content>
            </OrderDetaiItem>
            <OrderDetaiItem>
              <Title>{t(`Transfer fee`)}:</Title>
              <Fee>
                {new BN(transaction.srcFee).toFixed(6)} {srcNetworkInfo.symbol.toUpperCase()}
              </Fee>
            </OrderDetaiItem>
          </Left>
          <Right>
            <OrderDetaiItem>
              <StatusRow>
                <Title>{t(`${transaction.status}`)}</Title>
                <RightOutlined style={{ color: 'rgba(0, 0, 58, 0.6)', fontSize: '10px', marginLeft: '5px' }} />
              </StatusRow>
              <Content>{transaction.createTime}</Content>
            </OrderDetaiItem>
          </Right>
        </OrderDetailWrap>
      </Order>
    )
  })

  return (
    <BridgeListWrap>
      <HistoryWrap>
        <BridgeTitlePanel title="Transaction History" iconEvent={nav2transfer} />
        {historyList.length ? (
          <Spin spinning={loading}>
            <HistoryListWrap>{list}</HistoryListWrap>
          </Spin>
        ) : (
          <EmptyWrap>
            {account ? (
              <>
                <EmptyIcon src={require('../../assets/images/bridge/empty.svg').default} />
                <EmptyText>{t(`No record`)}</EmptyText>
              </>
            ) : (
              <EmptyWrap>
                <EmptyIcon src={require('../../assets/images/bridge/empty.svg').default} />
                <EmptyText>{t(`Connect wallet first`)}</EmptyText>
              </EmptyWrap>
            )}
          </EmptyWrap>
        )}
      </HistoryWrap>
    </BridgeListWrap>
  )
}

export default BridgeListPage
