import React from 'react'
import { message, Modal } from 'antd'
import { ModalTitle } from '../Common'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import ModelViewer from '@metamask/logo'
import { EllipsisOutlined } from '@ant-design/icons'
import { theme } from '../../constants/theme'
import { ConnectorNames, WalletList } from '../../constants/wallet'
import useAuth from '../../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { useWalletErrorInfo } from '../../state/wallet/hooks'
import { toggleConnectWalletModalShow, updateWalletId } from '../../state/wallet/actions'
import { updateBridgeLoading } from '../../state/application/actions'
import { useCurrentPairId } from '../../state/bridge/hooks'
import { switchNetwork } from '../../utils/wallet'
import { getPairInfo } from '../../utils'

export interface WalletListModalProps {
  visible: boolean
}

const WalletListWrap = styled.div``

const WalletItem = styled.div<{ selectedId: number; walletId: number }>`
  position: relative;
  margin-top: 16px;
  background: ${({ selectedId, walletId }) => {
    if (selectedId === walletId) {
      return 'rgba(49, 215, 160, 0.08)'
    }
    return '#ffffff'
  }};
  border: ${({ selectedId, walletId }) => {
    if (selectedId === walletId) {
      return `1px solid ${theme.colors.bridgePrimay}`
    }
    return '1px solid rgba(1, 8, 30, 0.1)'
  }};
  box-shadow: ${({ selectedId, walletId }) => {
    if (selectedId === walletId) {
      return `0px 1px 16px 0px rgba(0, 10, 30, 0.2), 0px 3px 4px 0px rgba(0, 10, 30, 0.16)`
    }
    return 'none'
  }};
  border-radius: 8px;
  height: 48px;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 13px 16px;
  &:hover {
    box-shadow: 0 1px 16px 0 rgba(0, 10, 30, 0.2), 0 3px 4px 0 rgba(0, 10, 30, 0.16);
    border: 1px solid ${theme.colors.bridgePrimay};
  }
`

const MoreWalletItem = styled.div`
  position: relative;
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid rgba(1, 8, 30, 0.1);
  box-shadow: none;
  border-radius: 8px;
  height: 48px;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: not-allowed;
  padding: 13px 16px;
`

const Name = styled.span`
  font-weight: 400;
  color: #01081e;
  line-height: 22px;
  font-size: 14px;
  flex: 1;
`
const Icon = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`

const ConnectButton = styled.div`
  margin-top: 16px;
  background: ${theme.colors.bridgePrimay};
  border-radius: 4px;
  height: 40px;
  line-height: 42px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  font-size: 14px;
`

const RightBottomWrap = styled.img`
  color: #fff;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 24px;
  width: 24px;
`

const WalletListModal: React.FunctionComponent<WalletListModalProps> = ({ visible }) => {
  const { t } = useTranslation()

  const [selectedId, setSelectedId] = React.useState<number>(0)

  const { login } = useAuth()

  const dispatch = useDispatch()

  const error = useWalletErrorInfo()

  const currentPairId = useCurrentPairId()

  const pairInfo = React.useMemo(() => {
    if (currentPairId > 0) {
      return getPairInfo(currentPairId)
    }
  }, [currentPairId])

  const initViewer = () => {
    const container = document.getElementById('metamask') as HTMLElement
    if (visible && container) {
      const viewer = ModelViewer({
        pxNotRatio: true,
        width: 28,
        height: 28,
        // To make the face follow the mouse.
        followMouse: true,
        // head should slowly drift (overrides lookAt)
        slowDrift: false,
      })
      container?.appendChild(viewer.container)
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      initViewer()
    }, 200)
  }, [visible])

  const connect = async () => {
    let timer: any = null
    if (selectedId !== -1) {
      switch (selectedId) {
        case 0:
          dispatch(updateBridgeLoading({ visible: true, status: 0 }))
          // switch supported chain first
          if (error.hasError) {
            await switchNetwork(pairInfo?.srcChainInfo.chainId ?? 321)
          }
          await login(ConnectorNames.Injected)
          dispatch(toggleConnectWalletModalShow({ show: false }))
          dispatch(updateBridgeLoading({ visible: false, status: 0 }))
          dispatch(updateWalletId({ walletId: 0 }))
          break
        default:
          console.log('No wallet is valid')
      }
    } else {
      message.warn(t(`Please select one of the wallets in the list`))
    }
    clearTimeout(timer)
  }

  const changeSelected = (id: number) => {
    if (id === selectedId) {
      setSelectedId(() => -1)
    } else {
      setSelectedId(() => id)
    }
  }

  const walletList = WalletList.map((item, index) => {
    const icon = index === 0 ? <Icon id="metamask" /> : null
    return (
      <WalletItem key={index} walletId={item.id} selectedId={selectedId} onClick={changeSelected.bind(null, item.id)}>
        <Name>{item.name}</Name>
        {icon}
        {selectedId === item.id ? <RightBottomWrap src={item.logo} /> : null}
      </WalletItem>
    )
  })

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      width="460px"
      style={{ borderRadius: '8px' }}
      destroyOnClose
      onCancel={() => {
        dispatch(toggleConnectWalletModalShow({ show: false }))
      }}
    >
      <ModalTitle>{t(`Connect Wallet`)}</ModalTitle>
      <WalletListWrap>
        {walletList}
        <MoreWalletItem>
          <Name>{t(`Coming Soon...`)}</Name>
          <EllipsisOutlined />
        </MoreWalletItem>
      </WalletListWrap>
      <ConnectButton onClick={connect}>
        {selectedId === -1 ? t(`Please select a wallet`) : t(`Connect Wallet`)}
      </ConnectButton>
    </Modal>
  )
}

export default WalletListModal
