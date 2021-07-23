import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export interface BridgeTitlePanelProps {
  title: string
  iconEvent: any
}

const TitleWrap = styled.div`
  position: relative;
  text-align: center;
  width: 100%;
  top: 0;
`

const Title = styled.div`
  padding-top: 2px;
  height: 36px;
  font-size: 24px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #01081e;
  line-height: 36px;
  @media (max-width: 768px) {
    font-size: 16px;
    padding-top: 2px;
    font-weight: 400;
    height: 24px;
    line-height: 24px;
  }
`

const Back = styled.img`
  position: absolute;
  left: 0;
  top: 6px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    top: 0px;
    font-size: 14px;
    padding-top: 2px;
    line-height: 16px;
  }
`

const BridgeTitlePanel: React.SFC<BridgeTitlePanelProps> = (props) => {
  const { t } = useTranslation()

  return (
    <TitleWrap>
      <Title>{t(`${props.title}`)}</Title>
      <Back src={require('../../assets/images/bridge/back-icon.png').default} onClick={props.iconEvent} />
    </TitleWrap>
  )
}

export default BridgeTitlePanel
