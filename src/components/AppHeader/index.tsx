import React from 'react'
import styled from 'styled-components'
import AppMenu from '../AppMenu'
import ChangeLanguage from '../ChangeLanguage/index'
import KccLogo, { PictureType } from '../Logo/KccLogo'
import { MobileView, BrowserView } from '../Common'
import { theme } from '../../constants/theme'
import { MenuOutlined, CloseOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useMobileMenuShow } from '../../state/application/hooks'
import { useDispatch } from 'react-redux'
import { changeMobileMenuShow } from '../../state/application/actions'
import { useResponsive } from '../../utils/responsive'
import UnlockButton from '../ConnectWalletButton'
import { withRouter } from 'react-router-dom'

const AppHeaderWrap = styled.div`
  display: flex;
  flex-flow: row no-wrap;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  padding: 0px 20px;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  z-index: 99;
`

const Box = styled.div`
  display: flex;
  align-items: center;
`

const HeaderLeftWrap = styled.div`
  display: flex;
  flex-flow: row no-wrap;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 1200px) {
    padding-left: 60px;
  }
`

const AppHeaderContent = styled(HeaderLeftWrap)<{ isMobile: boolean }>`
  justify-content: space-between;
  width: 100%;
  // max-width: 1200px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`

const AppHeader: React.FunctionComponent = (props: any) => {
  // const [mobileMenuShow, setMobileMenuShow] = React.useState(false)
  const show = useMobileMenuShow()
  const { isMobile } = useResponsive()

  const dispatch = useDispatch()

  const walletButtonShow = React.useMemo(() => {
    return props.location.pathname.startsWith('/bridge')
  }, [props.location.pathname])

  return (
    <AppHeaderWrap>
      <AppHeaderContent isMobile={isMobile}>
        <HeaderLeftWrap>
          <KccLogo abbr={true} sourceType={PictureType.svg} styles={{ width: '90px', textAlign: 'left' }} />
          <BrowserView>
            <AppMenu style={{ width: '600px', position: 'relative', top: '3px' }} />
          </BrowserView>
        </HeaderLeftWrap>

        <Box>
          {!walletButtonShow || !isMobile ? <ChangeLanguage /> : null}
          <ButtonGroup>{walletButtonShow ? <UnlockButton /> : null}</ButtonGroup>
          <MobileView style={{ width: '24px' }}>
            {!show ? (
              <MenuOutlined
                style={{ fontSize: '18px', color: theme.colors.primary }}
                onClick={() => {
                  dispatch(changeMobileMenuShow({ show: true }))
                }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: '20px', color: theme.colors.primary }}
                onClick={() => {
                  dispatch(changeMobileMenuShow({ show: false }))
                }}
              />
            )}

            {show ? <AppMenu style={{ width: '100%' }} /> : null}
          </MobileView>
        </Box>
      </AppHeaderContent>
    </AppHeaderWrap>
  )
}

export default withRouter(AppHeader)
