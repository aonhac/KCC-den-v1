import React from 'react'
import {message, Badge} from 'antd'
import styled from 'styled-components'
import {useWeb3React} from '@web3-react/core'
import {useTranslation} from 'react-i18next'
import copy from 'copy-to-clipboard'
import BN from "bignumber.js"

import {CopyOutlined, ChromeOutlined} from '@ant-design/icons'

import {theme} from '../../constants/theme'
import useAuth from '../../hooks/useAuth'
import {useResponsive} from '../../utils/responsive'
import {formatCurrency, shortAddress} from "../../utils/format"
import {getNetworkInfo, getWalletInfo} from "../../utils"
import {useBalance, useWalletId} from "../../state/wallet/hooks"
import {updateBalance} from "../../utils/wallet"


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
  border-radius: 12px;
  background: #252528;
  width: 467px;
  height: auto;
  padding: 30px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
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
  top:60px;
  left:50%;
  transform: translateX(-50%);
`

const OperateList = [{
    key: '0',
    title: 'View',
    icon: <CopyOutlined style={{fontSize:'20px'}}/>
}, {
    key: '1',
    title: 'Copy',
    icon: <ChromeOutlined style={{fontSize:'20px'}}/>
}, {
    key: '2',
    title: 'Logout',
    icon: <OperateIcon src={require('../../assets/images/bridge/logout.svg').default}/>
}]


const LogoutModal: React.FunctionComponent<LogoutModalProps> = (props) => {
    const {account, chainId, library} = useWeb3React()

    const {t} = useTranslation()
    const {logout} = useAuth()
    const {isMobile} = useResponsive()

    const walletId = useWalletId()

    const balance = useBalance()

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
            message.success(t('Copy Success'))
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
        console.log('hahah')
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
                <OperateText>{operate.title}</OperateText>
            </OperateItem>
        )
    })


    return (
        <WalletCenterWrap visible={props.visible}>
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
                            {networkInfo?.abbr}
                        </NetworkNameWrap>
                        <BalanceText>{formatCurrency(new BN(balance).div(Math.pow(10, networkInfo.decimals)).toPrecision(6).toString())}</BalanceText>
                    </SpaceRow>
                </BalanceWrap>
                <OperateWrap>
                    {OperateListDom}
                </OperateWrap>
            </WalletInfoWrap>
            <CloseIconWrap>

            </CloseIconWrap>
        </WalletCenterWrap>


        // <MyModal
        //   visible={props.visible}
        //   footer={null}
        //   centered
        //   width={isMobile ? '100%' : '560px'}
        //   title={t('Your Wallet')}
        //   style={{ borderRadius: '8px' }}
        //   onCancel={hideSelf}
        // >
        //   <ModalWrap>
        //     <Text>{account}</Text>
        //     <LinkGroup>
        //       <Link onClick={nav2Scan}>
        //         {t(`View on Browser`)}
        //         <ChromeOutlined style={{ fontSize: '16px', marginLeft: '5px' }} />
        //       </Link>
        //       <Link>
        //         {t(`Copy Address`)} <CopyOutlined onClick={copyAddress} style={{ fontSize: '16px', marginLeft: '5px' }} />
        //       </Link>
        //     </LinkGroup>
        //     {/*  <LogoutButton>
        //       <Button
        //         type="primary"
        //         ghost
        //         style={{ borderRadius: '12px', border: `2px solid ${theme.colors.second}` }}
        //         onClick={handleLogout}
        //       >
        //         <ButtonText>{t(`Logout`)}</ButtonText>
        //       </Button>
        //     </LogoutButton> */}
        //   </ModalWrap>
        // </MyModal>
    )
}

export default LogoutModal
