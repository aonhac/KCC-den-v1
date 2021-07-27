import React from 'react'
import {message, Badge} from 'antd'
import styled from 'styled-components'
import {useWeb3React} from '@web3-react/core'
import {useTranslation} from 'react-i18next'
import copy from 'copy-to-clipboard'
import BN from "bignumber.js"
import i18next from "i18next"

import {CopyOutlined, ChromeOutlined,PlusOutlined } from '@ant-design/icons'

import {theme} from '../../constants/theme'
import useAuth from '../../hooks/useAuth'
import {useResponsive} from '../../utils/responsive'
import {formatCurrency, shortAddress} from "../../utils/format"
import {getNetworkInfo, getWalletInfo} from "../../utils"
import {useBalance, useWalletId} from "../../state/wallet/hooks"
import {updateBalance} from "../../utils/wallet"
import {connectorLocalStorageKey} from "../../constants/wallet"


export interface LogoutModalProps {
    visible: boolean
    toggleVisible: any
}

const WalletCenterWrap = styled.div<{ visible: boolean }>`
  display: ${({visible}) => {
    if (visible) {
      return 'flex'
    }
    return 'none'
  }};
  position: fixed;
  width: 100%;
  height: 100vh;
  inset: 0;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.8);
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

const WalletInfoWrap = styled.div`
  position: relative;
  border-radius: 12px;
  background: #252528;
  width: 467px;
  height: auto;
  padding: 30px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 768px){
    width:96%;
  }
`
const SpaceRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const HighLightTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.bridgePrimay};
`
const NetworkNameWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 400;
`

const WalletName = styled.div`
  color: rgb(133, 133, 141);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  width: 100%;
`

const BalanceWrap = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid ${theme.colors.bridgePrimay};
  border-radius: 16px;
  margin-top: 20px;
`

const BalanceText = styled.div`
  font-size: 20px;
  color: rgb(255, 255, 255);
  text-shadow: rgb(0 0 0 / 80%) 0px 4px 9px;
`
const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
`
const ShiningBadge = styled(Badge)`
  .ant-badge-status-processing {
    background: ${theme.colors.primary};
  }
`

const OperateWrap = styled(SpaceRow)`
  margin-top:30px;
`

const OperateItem = styled.div`
  border-radius: 16px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #39393B;
  width: 70px;
  height: 70px;
  cursor: pointer;
`
const OperateIcon = styled.img`
  width: 20px;
  height: 20px;
`
const OperateText = styled.div`
  color: #fff;
  margin-top: 5px;
`
const CloseIconWrap = styled.div`
  width:44px;
  height:44px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background:#252528;
  border-radius: 50%;
  top:340px;
  left:50%;
  transform: translateX(-50%);
  cursor:pointer;
  transition: all 0.6s ease-in-out;
  &:hover{
    transform: translateX(-50%) rotate(180deg);
  }
`

const OperateList = [{
    key: '0',
    title: 'View',
    icon:  <ChromeOutlined style={{fontSize:'20px'}}/>
}, {
    key: '1',
    title: 'Copy',
    icon:<CopyOutlined style={{fontSize:'20px'}}/>
}, {
    key: '2',
    title: 'Logout',
    icon: <OperateIcon src={require('../../assets/images/bridge/logout.svg').default}/>
}]


const LogoutModal: React.FunctionComponent<LogoutModalProps> = (props) => {
    const {account, chainId, library,deactivate} = useWeb3React()

    const {t} = useTranslation()
    const {logout} = useAuth()
    const {isMobile} = useResponsive()

    const walletId = useWalletId()

    const balance = useBalance()

    React.useEffect(()=>{
        const body = document.getElementsByTagName('body')[0]
        body.style.height='100vh'
        body.style.overflow = 'hidden'
        return ()=>{
            body.style.height="auto"
            body.style.overflow = 'visible'
        }
    },[])

    const walletInfo = React.useMemo(() => {
        return getWalletInfo(walletId)
    }, [walletId])

    React.useEffect(() => {
        if (library && account && chainId) {
            updateBalance(library, chainId, account)
        }
    }, [library, chainId, account])


    const copyAddress = () => {
        if (account) {
            copy(account)
            message.success(i18next.t('Copy Success'))
        }
    }

    const networkInfo = React.useMemo(() => {
        return getNetworkInfo(chainId as any)
    }, [chainId])

    React.useEffect(() => {
        if (!chainId) {
            hideSelf()
        }
    }, [chainId])

    const nav2Scan = () => {
        const suffix = `/address/${account?.toLowerCase()}`
        if (chainId) {
            window.open(`${networkInfo.browser}${suffix}`, '_blank')
        }
    }

    const hideSelf = () => {
        props.toggleVisible(false)
    }

    const logoutAndLock = ()=>{
        window.localStorage.removeItem(connectorLocalStorageKey)
        logout()
        hideSelf()
    }

    const operateClick = (index: number) => {
        switch (index) {
            case 0:
                nav2Scan()
                break
            case 1:
                copyAddress()
                break
            case 2:
                logoutAndLock()
                break;
            default:
                console.log('call errored')
        }
    }

    const OperateListDom = OperateList.map((operate, index) => {
        return (
            <OperateItem key={index} onClick={operateClick.bind(null, index)}>
                {operate.icon}
                <OperateText>{t(`${operate.title}`)}</OperateText>
            </OperateItem>
        )
    })


    return (
        <WalletCenterWrap visible={props.visible} onScroll={(e)=>{e.preventDefault()}}>
            <WalletInfoWrap>
                <SpaceRow>
                    <HighLightTitle>
                        {account && shortAddress(account as any)}
                    </HighLightTitle>
                    <NetworkNameWrap>
                        <ShiningBadge status="processing"/>
                        {networkInfo?.abbr}
                    </NetworkNameWrap>
                </SpaceRow>
                <WalletName>{walletInfo?.name}</WalletName>
                <BalanceWrap>
                    <SpaceRow>
                        <NetworkNameWrap>
                            <NetworkIcon src={networkInfo?.logo}/>
                            {networkInfo?.symbol.toUpperCase()}
                        </NetworkNameWrap>
                        <BalanceText>{formatCurrency(new BN(balance).div(Math.pow(10, networkInfo.decimals)).toPrecision(6).toString())??'loading...'}</BalanceText>
                    </SpaceRow>
                </BalanceWrap>
                <OperateWrap>
                    {OperateListDom}
                </OperateWrap>
                <CloseIconWrap onClick={hideSelf}>
                    <PlusOutlined  style={{transform:`rotate(45deg)`,fontSize:'20px',color:'#fff'}} />
                </CloseIconWrap>
            </WalletInfoWrap>
        </WalletCenterWrap>
    )
}

export default LogoutModal
