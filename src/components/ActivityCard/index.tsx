import styled from 'styled-components'
import Column from '../Column'
import { useTranslation } from 'react-i18next'

export interface ActivityCardProps {
  deadline: string
  thumbnail_en: string
  thumbnail_ch: string
  url_en?: string
  url_ch?: string
  valid?: boolean
}

const Title = styled.div`
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
`
export const Button = styled.div`
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: auto;
  height: 32px;
  background: #49ffa1;
  border-radius: 4px;
  padding: 0 10px;
  color: #000;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  box-shadow: 1px 1px 5px #000;
  @media (max-width: 1200px) {
    opacity: 1;
  }
`
const InvalidButton = styled(Button)`
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
`

const ActivityCardWrap = styled(Column)<{ lng: string; enBg: string; chBg: string }>`
  width: 280px;
  height: 208px;
  background: ${({ lng, enBg, chBg }) => {
    if (lng === 'zh-CN') {
      return `url(${chBg}) top center no-repeat`
    }
    return `url(${enBg}) top center no-repeat`
  }};
  background-size: 100% 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
  box-shadow: 1px 1px 5px #222;
  &:hover ${Button} {
    opacity: 1;
  }
`

const ActivityCard: React.FunctionComponent<ActivityCardProps> = (props) => {
  const { t, i18n } = useTranslation()

  const nav2Activity = () => {
    if (i18n.language === 'zh-CN') {
      props.url_ch && window.open(props.url_ch, '_blank')
    } else {
      props.url_en && window.open(props.url_en, '_blank')
    }
  }
  return (
    <ActivityCardWrap lng={i18n.language} enBg={props.thumbnail_en} chBg={props.thumbnail_ch}>
      {props.valid ? (
        <Button onClick={nav2Activity}>{t('Participate now')}</Button>
      ) : (
        <Button onClick={nav2Activity}>{t(`View Event`)}</Button>
      )}
    </ActivityCardWrap>
  )
}

export default ActivityCard
