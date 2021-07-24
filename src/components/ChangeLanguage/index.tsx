import { Popover } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { DownOutlined } from '@ant-design/icons'
import { allLanguages } from '../../constants/languageCodes'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../Row'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state/index'
import { changeLanguage } from '../../state/application/actions'
import { useLanguage } from '../../state/application/hooks'
import { theme } from '../../constants/theme'
import { useResponsive } from '../../utils/responsive'
import { BrowserView, MobileView } from '../Common'

import './index.less'

export interface ChangeLanguageProps {}

const MenuWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  flex: 1;
  text-align: right;

  @media (max-width: 768px) {
    padding-left: 10px;
  }
`

const LanguageItem = styled.div``

const Text = styled.div`
  height: 22px;
  font-size: 14px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: ${() => theme.colors.primary};
  line-height: 24px;
  margin: 8px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`

export const LanguageButton = styled.div`
  cursor: pointer;
  width: 100px;
  height: 30px;
  line-height: none;
  padding: 0;
  border-radius: 20px;
  font-size: 12px;
  outline: none;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: #212124;
  &:hover {
    bacground: transparent !important;
  }
  @media (max-width: 768px) {
    background: none;
    border: none;
    width: 70px;
    margin-right: 10px;
  }
`

const ChangeLanguage: React.FunctionComponent<ChangeLanguageProps> = () => {
  const { isMobile } = useResponsive()
  const { i18n } = useTranslation()

  const [show, setShow] = useState(false)

  let timer: any = null

  const dispatch = useDispatch<AppDispatch>()

  const showPop = () => {
    timer && clearTimeout(timer)
    setShow(() => true)
  }

  const hidePopover = () => {
    timer = setTimeout(() => {
      setShow(() => false)
    }, 300)
  }

  const selectChange = (code: string) => {
    dispatch(changeLanguage({ lng: code }))
    i18n.changeLanguage(code)
    setShow(() => false)
  }

  const lang = useLanguage()

  const currentLanguage = React.useMemo(() => {
    for (let i = 0; i < allLanguages.length; i++) {
      if (allLanguages[i].code === i18n.language) {
        return allLanguages[i].language
      }
    }
    return 'English'
  }, [i18n.language, allLanguages, lang])

  const selectOptions = allLanguages.map((lng, index) => {
    return (
      <LanguageItem key={index} onClick={selectChange.bind(null, lng.code)} onMouseEnter={showPop}>
        <RowBetween>
          <Text> {lng.language}</Text>
        </RowBetween>
      </LanguageItem>
    )
  })
  return (
    <MenuWrap>
      <Popover style={{ background: '#000' }} placement="bottom" content={selectOptions} visible={show}>
        <BrowserView>
          <LanguageButton
            onMouseEnter={showPop}
            onMouseLeave={hidePopover}
            onClick={() => {
              setShow(() => !show)
            }}
            style={{ color: theme.colors.primary, fontSize: isMobile ? '14px' : '12px' }}
          >
            {currentLanguage}
            <DownOutlined style={{ fontSize: '10px', marginLeft: isMobile ? '2px' : '6px' }} />
          </LanguageButton>
        </BrowserView>
        <MobileView>
          <LanguageButton
            onClick={() => {
              setShow(() => !show)
            }}
            style={{ color: theme.colors.primary, fontSize: isMobile ? '14px' : '12px' }}
          >
            {currentLanguage}
            <DownOutlined style={{ fontSize: '10px', marginLeft: isMobile ? '2px' : '6px' }} />
          </LanguageButton>
        </MobileView>
      </Popover>
    </MenuWrap>
  )
}

export default React.memo(ChangeLanguage)
