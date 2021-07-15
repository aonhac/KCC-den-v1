import React from 'react'
import styled from 'styled-components'
import { TransferWrap } from './transfer'
import BridgeTitlePanel from '../../components/BridgeTitlePanel/index'
import { useHistory } from 'react-router'
import { Progress } from 'antd'
import { CenterRow } from '../../components/Row/index'
import { useTranslation } from 'react-i18next'
import { useQuery } from '../../hooks/useQuery'
import { Base64 } from '../../utils/base64'
import { getNetworkInfo, getPairInfo } from '../../utils/index'
import { BridgeService } from '../../api/bridge'
import { useWeb3React } from '@web3-react/core'
import { useInterval } from '../../hooks/useInterval'

export interface BridgeDetailPageProps {}

const BridgeDetaiPageWrap = styled.div`
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  min-height: calc(100vh - 400px);
`

const OrderDetailWrap = styled(TransferWrap)`
  // background: linear-gradient(180deg, #f5fffc 0%, #feffff 100%);
  background: #fff;
  height: 520px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`

const StepIcon = styled.img`
  width: 24px;
  height: 24px;
`

const Icon1 = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0px;
  top: -24px;
  z-index: 4;
  background: #fff;
`

const Icon2 = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0px;
  top: 112px;
  z-index: 4;
  background: #fff;
`
const Icon3 = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0px;
  top: 250px;
  z-index: 4;
  background: #fff;
`

const StepsWrap = styled.div`
  margin-top: 40px;
  width: 100%;
  height: 250px;
  background: #fff;
  position: relative;
  z-index: 1;
`

const Line = styled.div`
  position: absolute;
  z-index: 3;
  background: rgba(1, 8, 30, 0.38);
  width: 1px;
  height: 250px;
  top: 0;
  left: 12px;
`

const NetworkWrap = styled.div`
  height: 120px;
  padding-left: 40px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
`

const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  background: #d8d8d8;
  border-radius: 50%;
`

const NetworkName = styled.span`
  margin-left: 5px;
  padding-top: 2px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #000426;
`
const StatusText = styled.span`
  font-size: 14px;
  padding-top: 2px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #01081e;
  white-space: nowrap;
`

const LinkText = styled(StatusText)`
  cursor: pointer;
  font-weight: 400;
  &:hover {
    font-weight: 500;
    text-decoration: underline;
  }
`
const LinkIcon = styled.img`
  width: 15px;
  height: 15px;
`

const BetweenBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const SuccessIconWrap = styled.img`
  width: 10px;
  height: 10px;
  margin-right: 5px;
`
const SuccessIcon = require('../../assets/images/bridge/success-process.png').default
const ProcessingIcon = require('../../assets/images/bridge/in-process.png').default

const BridgeDetailPage: React.FunctionComponent<BridgeDetailPageProps> = (props) => {
  const { t } = useTranslation()

  const { account } = useWeb3React()

  const icon = (current: number, nth: number) => {
    return <StepIcon src={nth < current ? SuccessIcon : ProcessingIcon} />
  }

  const [percent1, setPercent1] = React.useState<number>(0)
  const [statusText1, setStatusText1] = React.useState<string>('')
  const [percent2, setPercent2] = React.useState<number>(0)
  const [statusText2, setStatusText2] = React.useState<string>('')
  const [order, setOrder] = React.useState<any>(null)

  const history = useHistory()

  const query = useQuery()

  const network = React.useMemo(() => {
    const selectedPairInfo = getPairInfo(order?.pairId as any)
    return {
      src: getNetworkInfo(selectedPairInfo?.srcChainInfo.chainId as any),
      dist: getNetworkInfo(selectedPairInfo?.dstChainInfo.chainId as any),
    }
  }, [order])

  // src chain
  React.useEffect(() => {
    if (!order?.id) {
      setStatusText1(() => 'Process')
      setPercent1(() => 0)
    } else {
      setStatusText1(() => 'Completed')
      setPercent1(() => 100)
    }
  }, [order])

  // dist chain
  React.useEffect(() => {
    if (statusText1 === 'Process') {
      setStatusText2(() => 'Pending')
      setPercent2(() => 0)
    } else if (order?.status === 'SUCCESS' || order?.status === 'CONFRIMED') {
      setStatusText2(() => 'Completed')
      setPercent2(() => 100)
    } else if (order?.status === 'CANCELLED') {
      setStatusText2(() => 'CANCELLED')
      setPercent2(() => 0)
    } else {
      setStatusText2(() => 'PROCESSING')
      setPercent2(() => 30)
    }
  }, [order, statusText1])

  const current = React.useMemo(() => {
    if (order?.status === 'SUCCESS' || order?.status === 'CONFRIMED') {
      return 3
    } else if (statusText1 === 'Process') {
      return 1
    } else if (statusText1 === 'Completed' || order?.status === 'CANCELLED') {
      return 2
    } else {
      return 0
    }
  }, [statusText1, statusText2, order])

  const nav2list = () => {
    history.push('/bridge/list')
  }

  const nav2Scan = (url: string) => {
    window.open(url, '_blank')
  }

  const getTransactionDetail = async (account: string, hash: string) => {
    let localOrder: any = null
    try {
      localOrder = JSON.parse(Base64.decode(query.get('o')))
    } catch {
      console.log('parse url error')
      history.push('/bridge/list')
    }
    try {
      const res = await BridgeService.transitionList(account, 1, 1, hash)
      console.log(res.data?.data?.list)
      if (res.data?.data?.list?.length) {
        setOrder(() => res.data.data.list[0])
      } else {
        setOrder(() => localOrder)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useInterval(() => {
    if (!account) return
    const hash = order?.srcTxHash ?? order?.saveHash
    order?.status !== 'SUCCESS' && getTransactionDetail(account, hash)
  }, 1000 * 15)

  React.useEffect(() => {
    const hash = JSON.parse(Base64.decode(query.get('o')))?.saveHash
    getTransactionDetail(account as any, hash)
  }, [])

  return (
    <BridgeDetaiPageWrap>
      <OrderDetailWrap>
        <BridgeTitlePanel title="Details" iconEvent={nav2list} />
        <StepsWrap>
          <Line />
          <Icon1>{icon(current, 0)}</Icon1>
          <Icon2>{icon(current, 1)}</Icon2>
          <Icon3>{icon(current, 2)}</Icon3>
          <NetworkWrap>
            <BetweenBox>
              <CenterRow>
                <NetworkIcon src={network?.src?.logo} />
                <NetworkName>{network?.src?.fullName}</NetworkName>
              </CenterRow>
              <StatusText style={{ color: statusText1 === 'Completed' ? '#31D7A0' : '#01081E' }}>
                {t(`${statusText1}`)}
              </StatusText>
            </BetweenBox>
            <Progress
              percent={percent1}
              type="line"
              strokeWidth={4}
              style={{ margin: '8px 0' }}
              status="active"
              strokeColor={{
                '0%': '#00FFA8',
                '100%': '#31D7A0',
              }}
            />
            <CenterRow>
              {order?.srcTxHash ? (
                <>
                  <LinkText onClick={nav2Scan.bind(null, `${network?.src.browser}/tx/${order.srcTxHash}`)}>
                    {t(`View hash`)}
                  </LinkText>
                  <LinkIcon src={require('../../assets/images/bridge/link.svg').default} />
                </>
              ) : null}
            </CenterRow>
          </NetworkWrap>
          <NetworkWrap style={{ marginTop: '20px' }}>
            <BetweenBox>
              <CenterRow>
                <NetworkIcon src={network?.dist?.logo} />
                <NetworkName>{network?.dist?.fullName}</NetworkName>
              </CenterRow>
              <StatusText style={{ color: statusText2 === 'Completed' ? '#31D7A0' : '#01081E' }}>
                {t(`${statusText2}`)}
              </StatusText>
            </BetweenBox>
            <Progress
              percent={percent2}
              type="line"
              strokeWidth={4}
              style={{ margin: '8px 0' }}
              status="active"
              strokeColor={{
                '0%': '#00FFA8',
                '100%': '#31D7A0',
              }}
            />
            <CenterRow>
              {order?.dstTxHash ? (
                <>
                  <LinkText onClick={nav2Scan.bind(null, `${network.dist.browser}/tx/${order.dstTxHash}`)}>
                    {t(`View hash`)}
                  </LinkText>
                  <LinkIcon src={require('../../assets/images/bridge/link.svg').default} />
                </>
              ) : null}
            </CenterRow>
          </NetworkWrap>
          <CenterRow style={{ marginTop: '20px' }}>
            {order?.status === 'SUCCESS' ? (
              <>
                <SuccessIconWrap src={require('../../assets/images/bridge/selected@2x.png').default} />
                <StatusText style={{ color: '#31D7A0' }}>{t(`SUCCESS`)}!</StatusText>
              </>
            ) : (
              <StatusText>{t(`${order?.status}`)}</StatusText>
            )}
          </CenterRow>
        </StepsWrap>
      </OrderDetailWrap>
    </BridgeDetaiPageWrap>
  )
}

export default BridgeDetailPage
