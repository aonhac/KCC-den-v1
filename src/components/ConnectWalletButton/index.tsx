import React from 'react'
import styled, {keyframes} from 'styled-components'
import {theme} from '../../constants/theme'
import {LanguageButton} from '../ChangeLanguage'
import {useWeb3React} from '@web3-react/core'
import {shortAddress} from '../../utils/format'
import {useTranslation} from 'react-i18next'
import {useWalletErrorInfo} from '../../state/wallet/hooks'
import LogoutModal from '../WalletCenter'
import {useDispatch} from 'react-redux'
import {toggleConnectWalletModalShow} from '../../state/wallet/actions'
import {getNetworkInfo} from '../../utils'
import {CenterRow} from '../Row'
import {Badge, Dropdown} from 'antd'
import {AlertOutlined} from '@ant-design/icons'
import NetworkList from '../NetworkList'
import i18next from 'i18next'

const ConnectButton = styled(LanguageButton)`
  width: auto;
  color: ${theme.colors.primary};
  margin-left: 10px;
  padding-left: 10px;
  cursor: pointer;
  height: 30px;
  border: none;
  background: #252528;
`
const Text = styled.span`
  user-select: none;
`
const HighlightText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 0 15px;
  border: 1px solid ${theme.colors.primary};
  user-select: none;
  height: 30px;
  font-weight: bold;
`

const ErrorButton = styled(ConnectButton)`
  color: #f00;
  border: 1px solid #fff;
  display: flex;
  padding-right: 15px;
  justify-content: center;
  align-items: center;

  ${Text} {
    color: #fff;
  }
`
const WalletIcon = styled.img`
  width: 18px;
  height: 14px;
  margin-right: 10px;
`

const NetworkWrap = styled(CenterRow)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: auto;
  padding-right: 5px;
  padding-left: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  background: #252528;
`

const Shining = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
`

const AnimationBadge = styled(Badge)`
  animation: ${Shining} 1s infinite ease-in-out;
`

const UnlockButton: React.FunctionComponent = () => {
    const {t} = useTranslation()

    const {account, chainId} = useWeb3React()

    const [logoutModalShow, setLogoutModalShow] = React.useState<boolean>(false)

    const dispatch = useDispatch()

    const {errorInfo, hasError} = useWalletErrorInfo()

    const hideLogout = (show: boolean) => {
        setLogoutModalShow(() => show)
    }

    const selectedNetworkInfo = React.useMemo(() => {
        return getNetworkInfo(chainId as any)
    }, [chainId])

    const connect = () => {
        dispatch(toggleConnectWalletModalShow({show: true}))
    }

    const btn = React.useMemo(() => {
        if (hasError) {
            return (
                <Dropdown overlay={<NetworkList/>}>
                    <ErrorButton>
                        <AlertOutlined style={{fontSize: '16px', color: '#fff', margin: '-2px 5px 0px 5px'}}/>
                        <Text>{i18next.t(`${errorInfo}`)}</Text>
                    </ErrorButton>
                </Dropdown>
            )
        } else if (account) {
            return (
                <ConnectButton>
                    <Dropdown overlay={<NetworkList/>} placement="bottomLeft">
                        <NetworkWrap>
                            <AnimationBadge status="success"/>
                            <Text>{selectedNetworkInfo?.abbr}</Text>
                        </NetworkWrap>
                    </Dropdown>
                    <HighlightText
                        onClick={() => {
                            setLogoutModalShow(() => true)
                        }}
                    >
                        {shortAddress(account)}
                    </HighlightText>
                </ConnectButton>
            )
        } else {
            return (
                <ConnectButton onClick={connect}>
                    <WalletIcon src={require('../../assets/images/bridge/wanllet@2x.png').default}/>
                    <Text style={{paddingRight: '15px'}}>{t(`Connect Wallet`)}</Text>
                </ConnectButton>
            )
        }
    }, [hasError, account, selectedNetworkInfo])

    return (
        <>
            {btn}
            {logoutModalShow ? (<LogoutModal visible={logoutModalShow} toggleVisible={hideLogout}/>) : null}
        </>
    )
}

export default UnlockButton
