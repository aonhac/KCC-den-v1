import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useConnectWalletModalShow } from '../../state/wallet/hooks'
import WalletListModal from '../../components/WalletListModal'
import BridgeLoading from '../../components/BridgeLoading'
import { useBridgeLoading } from '../../state/application/hooks'
import { updateBridgeLoading } from '../../state/application/actions'
import { BridgeService } from '../../api/bridge'
import { updatePairList } from '../../state/bridge/actions'
import { PairInfo } from '../../state/bridge/reducer'
import useAuth from '../../hooks/useAuth'
import { ChainIds } from '../../connectors'
import { updateErrorInfo } from '../../state/wallet/actions'

import BridgeTransfer from './transfer'
import BridgeHistoryList from './list'
import BridgeOrderDetail from './detail'
import BridgeOrderConfirm from './confirm'

import '../../styles/transition.css'

export interface BridgePageProps {}

const TopBg = require('../../assets/images/bridge/pic.png').default
const CenterBg = require('../../assets/images/bridge/center-bg@2x.png').default

const BridgeWrap = styled.div`
  position: relative;
  background: #000;
  color: #fff;
  min-height: calc(100vh - 200px);
  background: url(${TopBg}) center 80px no-repeat, #000;
  background-size: 500px auto;
  @media (max-width: 768px) {
    width: 100%;
    background: #000;
    background-size: 100% 100%;
    min-height: 100%;
  }
`

const NavBg = styled.div`
  height: 80px;
  width: 100%;
  background: rgba(0, 0, 0, 1);
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  padding-bottom: 80px;
  @media (max-width: 768px) {
    padding-bottom: 0;
  }
`

const CenterBgImg = styled.img`
  position: absolute;
  width: 80%;
  top: 250px;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%);
  @media (max-width: 768px) {
    top: 0;
  }
`

const ButtonBgImg = styled.img`
  position: absolute;
  width: 100%;
  heigth: 800px;
  bottom: 0;
  left: 0;
`

const LoadingBg = styled.div`
  margin: 200px auto;

  position: relative;
  width: 464px;
  height: 306px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 1);
  @media (max-width: 768px) {
    background: #fff;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    border-radius: 0px;
    padding: 240px 0 0 0;
    justify-content: flex-start;
  }
`

const Success = styled.div`
  margin-top: 20px;
  height: 36px;
  font-size: 24px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #000426;
  line-height: 36px;
  text-align: center;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`

const CloseIcon = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
  cursor: pointer;
`

const BridgePage: React.FunctionComponent<BridgePageProps> = ({ children }) => {
  const { t } = useTranslation()

  const { status, visible } = useBridgeLoading()

  const location = useLocation()

  const walletListModalShow = useConnectWalletModalShow()

  const [loading, setLoading] = React.useState<boolean>(false)

  const { active, account, chainId, error, deactivate, library } = useWeb3React()

  const { login, logout } = useAuth()

  const dispatch = useDispatch()

  const handleChainChanged = () => {
    if (ChainIds.includes(chainId as any)) {
      dispatch(updateErrorInfo({ hasError: false, errorInfo: '' }))
    } else {
      dispatch(updateErrorInfo({ hasError: false, errorInfo: 'Unsupported Network' }))
    }
  }

  React.useEffect(() => {
    const { ethereum } = window
    if (ethereum) {
      ethereum.on('chainChanged', handleChainChanged)
    }
    return () => {
      if (!window?.ethereum) return
      window?.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  // important, logout for refresh wallet data

  const getPairList = async () => {
    try {
      const res = await BridgeService.pairList()
      const list: PairInfo[] = []
      for (let i = 0; i < res.data.data.length; i++) {
        const chain: PairInfo = res.data.data[i]
        if ((chain?.status & 1) !== 1) {
          continue
        } else {
          chain.openStatus = true
          chain.limitStatus = (chain.status & 2) === 2
          chain.whiteListStatus = (chain.status & 4) === 4
          list.push({ ...chain })
        }
      }
      dispatch(updatePairList({ pairList: list }))
    } catch {
      console.log('get pairList error')
    }
  }

  const hideLoading = () => {
    dispatch(updateBridgeLoading({ visible: false, status: 0 }))
  }

  React.useEffect(() => {
    const init = async () => {
      try {
        setLoading(() => true)
        await getPairList()
      } finally {
        setLoading(() => false)
      }
    }
    init()
  }, [])

  React.useEffect(() => {
    if (account) {
      hideLoading()
    }
  }, [account])

  return (
    <BridgeWrap>
      <WalletListModal visible={walletListModalShow} />
      <NavBg />
      <Content>
        {visible || loading ? (
          <LoadingBg>
            <BridgeLoading status={status} />
            <CloseIcon src={require('../../assets/images/bridge/close@2x.png').default} onClick={hideLoading} />
            {loading ? (
              <Success>{t('Loading')}...</Success>
            ) : (
              <Success>{status !== 0 ? t(`SUCCESS`) + '!' : t('Waiting for confirmation')}</Success>
            )}
          </LoadingBg>
        ) : (
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={location.pathname}
              classNames="fade"
              addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            >
              <Switch>
                <Route path="/bridge/transfer" component={BridgeTransfer} />
                <Route path="/bridge/list" component={BridgeHistoryList} />
                <Route path="/bridge/detail" component={BridgeOrderDetail} />
                <Route path="/bridge/confirm" component={BridgeOrderConfirm} />
              </Switch>
            </CSSTransition>
          </SwitchTransition>
        )}
      </Content>

      <CenterBgImg src={CenterBg} />
      <ButtonBgImg src={require('../../assets/images/bridge/bottom-bg@2x.png').default} />
    </BridgeWrap>
  )
}

export default BridgePage
