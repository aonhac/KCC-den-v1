import React from 'react'
import styled from 'styled-components'
import { KCC } from '../../constants/index'

import './index.less'

export interface AppHeaderLogoProps {}

const AppHeaderLogoWrap = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`
const Text = styled.span`
  font-size: 20px;
  margin-left: 8px;
  font-family: URWDIN-Demi;
  vertical-align: middle;
  padding-top: 8px;
`

const AppHeaderLogo: React.FunctionComponent<AppHeaderLogoProps> = () => {
  return (
    <AppHeaderLogoWrap>
      <img src="/logo/Icon/beagleinu.png" width="35px" height="auto" />
      <Text className="kcc-name">{KCC.FULLNAME}</Text>
    </AppHeaderLogoWrap>
  )
}

export default AppHeaderLogo
