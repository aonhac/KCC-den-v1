import React from 'react'
import { Button, Modal, message } from 'antd'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ModalTitle } from '../Common'
import { useTranslation } from 'react-i18next'
import { theme } from '../../constants/theme'
import useAuth from '../../hooks/useAuth'
import { CopyOutlined, ChromeOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { networks } from '../../constants/networks'
import { ChainId } from '../../connectors'
import { useResponsive } from '../../utils/responsive'
export interface LogoutModalProps {
  visible: boolean
  toggleVisible: any
}

const MyModal = styled(Modal)`
  .ant-modal-header {
    border-radius: 8px !important;
  }
`

export const ModalWrap = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`

const Text = styled.div`
  color: #000;
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`
const LinkGroup = styled.div`
  margin-top: 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
`

const LogoutButton = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`

const Link = styled.div`
  color: ${theme.colors.bridgePrimay};
  font-weight: bold;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  & + & {
    margin-left: 20px;
  }
  @media (max-width: 768px) {
    font-size: 12px;
    font-weight: 400;
  }
`
const ButtonText = styled.span`
  color: ${theme.colors.bridgePrimay};
  font-weight: bold;
`

const LogoutModal: React.FunctionComponent<LogoutModalProps> = (props) => {
  const { account, chainId } = useWeb3React()

  const { t } = useTranslation()
  const { logout } = useAuth()

  const { isMobile } = useResponsive()

  const copyAddress = (e: any) => {
    e.stopPropagation()
    if (account) {
      copy(account)
      message.success(t('Copy Success'))
    }
  }

  const nav2Scan = () => {
    const sufix = `/address/${account?.toLowerCase()}`
    const id = chainId as ChainId
    if (id) {
      window.open(`${networks[id].browser}${sufix}`, '_blank')
    }
  }

  const hideSelf = () => {
    props.toggleVisible(false)
  }

  return (
    <MyModal
      visible={props.visible}
      footer={null}
      centered
      width={isMobile ? '100%' : '560px'}
      title={t('Your Wallet')}
      style={{ borderRadius: '8px' }}
      onCancel={hideSelf}
    >
      <ModalWrap>
        <Text>{account}</Text>
        <LinkGroup>
          <Link onClick={nav2Scan}>
            {t(`View on Browser`)}
            <ChromeOutlined style={{ fontSize: '16px', marginLeft: '5px' }} />
          </Link>
          <Link>
            {t(`Copy Address`)} <CopyOutlined onClick={copyAddress} style={{ fontSize: '16px', marginLeft: '5px' }} />
          </Link>
        </LinkGroup>
        {/*  <LogoutButton>
          <Button
            type="primary"
            ghost
            style={{ borderRadius: '12px', border: `2px solid ${theme.colors.second}` }}
            onClick={handleLogout}
          >
            <ButtonText>{t(`Logout`)}</ButtonText>
          </Button>
        </LogoutButton> */}
      </ModalWrap>
    </MyModal>
  )
}

export default LogoutModal
