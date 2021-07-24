import React from 'react'
import styled from 'styled-components'
import { ColumnCenter } from '../Column/index'
import { useTranslation } from 'react-i18next'
import { theme } from '../../constants/theme'
export interface ContactCardProps {
  icon: string
  app: string
  route: string
  styles: any
}

const ContactCardWrap = styled(ColumnCenter)`
  align-items: center;
  justify-content: flex-start;
  height: 160px;
  @media (max-width: 768px) {
    justify-content: center;
    max-width: 163px;
    max-height: 163px;
  }
  @media (max-width: 320px) {
    border: none;
  }
`

const AppIcon = styled.img`
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`

const AppText = styled.div`
  height: 20px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN, PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fff;
  margin-top: 10px;
  line-height: 20px;
`
const AccountText = styled.span`
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: ${theme.colors.primary};
  line-height: 22px;
`
const CopyIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 7px;
  cursor: pointer;
`

const ContactCard: React.FunctionComponent<ContactCardProps> = (props) => {
  const { t } = useTranslation()

  const nav2Target = () => {
    if (props.route) {
      window.open(props.route, '_blank')
    }
  }

  return (
    <ContactCardWrap style={props.styles}>
      <ColumnCenter>
        <AppIcon src={props.icon} onClick={nav2Target} />
        <AppText>{t(props.app)}</AppText>
      </ColumnCenter>
    </ContactCardWrap>
  )
}

export default ContactCard
