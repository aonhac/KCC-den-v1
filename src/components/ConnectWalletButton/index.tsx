import React from 'react'
import styled from 'styled-components'
import { theme } from '../../constants/theme'
import { LanguageButton } from '../ChangeLanguage/index'
import { useWeb3React } from '@web3-react/core'
import { shortAddress } from '../../utils/format'
import { useTranslation } from 'react-i18next'
import { useWalletErrorInfo } from '../../state/wallet/hooks'
import LogoutModal from '../LogoutModal'
import { useDispatch } from 'react-redux'
import { toggleConnectWalletModalShow } from '../../state/wallet/actions'
import { getNetworkInfo } from '../../utils/index'
import { CenterRow } from '../Row/index'
import { Badge, Dropdown } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import NetworkList from '../NetworkList'
import i18next from 'i18next'

const ConnectButton = styled(LanguageButton)`
  width: auto;
  color: ${theme.colors.primary};
  margin-left: 10px;
  padding: 0 10px;
  cursor: pointer;
`
const Text = styled.span`
  user-select: none;
`

const ErrorButton = styled(ConnectButton)`
  color: #f00;
  border: 1px solid #fff;
  display: flex;
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
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-right: 1px solid ${theme.colors.primary};
  padding-right: 15px;
  margin-right: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const UnlockButton: React.FunctionComponent = () => {
  const { t } = useTranslation()

  const { account, chainId } = useWeb3React()

  const [logoutModalShow, setLogoutModalShow] = React.useState<boolean>(false)

  const dispatch = useDispatch()

  const { errorInfo, hasError } = useWalletErrorInfo()

  const hideLogout = (show: boolean) => {
    setLogoutModalShow(() => show)
  }

  const selectedNetworkInfo = React.useMemo(() => {
    return getNetworkInfo(chainId as any)
  }, [chainId])

  const connect = () => {
    dispatch(toggleConnectWalletModalShow({ show: true }))
  }

  const btn = React.useMemo(() => {
    if (hasError) {
      return (
        <Dropdown overlay={<NetworkList />}>
          <ErrorButton>
            <AlertOutlined style={{ fontSize: '16px', color: '#fff', margin: '-2px 5px 0px 5px' }} />
            <Text>{i18next.t(`${errorInfo}`)}</Text>
          </ErrorButton>
        </Dropdown>
      )
    } else if (account) {
      return (
        <ConnectButton>
          <Dropdown overlay={<NetworkList />} placement="bottomLeft">
            <NetworkWrap>
              <Badge status="success" />
              <Text>{selectedNetworkInfo?.name}</Text>
            </NetworkWrap>
          </Dropdown>
          <Text
            onClick={() => {
              setLogoutModalShow(() => true)
            }}
          >
            {shortAddress(account)}
          </Text>
        </ConnectButton>
      )
    } else {
      return (
        <ConnectButton onClick={connect}>
          <WalletIcon src={require('../../assets/images/bridge/wanllet@2x.png').default} />
          <Text>{t(`Connect Wallet`)}</Text>
        </ConnectButton>
      )
    }
  }, [hasError, account, selectedNetworkInfo])

  return (
    <>
      {btn}
      <LogoutModal visible={logoutModalShow} toggleVisible={hideLogout} />
    </>
  )
}

export default UnlockButton
