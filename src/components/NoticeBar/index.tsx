import React from 'react'
import styled from 'styled-components'
import { SoundFilled } from '@ant-design/icons'
import { AutoRow, RowBetween } from '../Row/index'
import axios from 'axios'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import Slider from 'react-slick'

import { KCC } from '../../constants'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.less'
import { theme } from '../../constants/theme'
import { MobileView } from '../Common'
import { BrowserView } from '../Common/index'

export interface NoticeBarProps {}

const BG = require('../../assets/images/home/why-top-cover.png').default

const NoticeBarWrap = styled(AutoRow)`
  flex-flow: row nowrap;
  height: 44px;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  @media (max-width: 768px) {
    height: 44px;
    margin: 0 24px;
    padding: 12px;
    width: calc(100% - 48px);
    transform: translateY(-50%);
    background: #242525;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    padding: 0 24px;
  }
`

const NoticeBgWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.36);
  opacity: 0.08;
`

const Text = styled.div`
  padding: 0;
  font-family: URWDIN-Regular;
  font-size: 12px;
  color: #fff !important;
  margin-left: 8px;
  cursor: pointer;
  width: 750px;
  max-width: 750px;
  height: 20px;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    height: 20px;
    flex: 1;
  }
`

const DateText = styled.div`
  font-family: URWDIN-Regular;
  font-size: 12px;
  color: #fff;
  height: 20px;
  line-height: 20px;
  margin-left: 8px;
  width: 120px;
  text-align: right;
`

interface Announcement {
  title: string
  pubDate: string
  link: string
  thumbnail?: string
}

/* export function formatDate(timestamp: number) {
  const now = new Date(timestamp)
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var date = now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
} */

const NoticeBar: React.FunctionComponent<NoticeBarProps> = () => {
  const { t, i18n } = useTranslation()

  const [announcementList, setAnnoucementList] = React.useState<Announcement[]>([
    {
      title: '...',
      pubDate: '',
      link: '',
    },
  ])

  const enRiskAnnouncement = {
    title:
      '<Risk Statement> KCC officially will not release any Swap project because all projects are developed by the community.So KCC is not responsible for any inconvenience caused by these projects. Also, KCC does not serve as customer service for relevant projects.',
    pubDate: '',
    link: 'https://docs.kcc.io/#/en-us/?id=risk-statement',
  }

  const cnRiskAnnouncement = {
    title:
      '<风险提示> KCC官方不会发布任何Swap项目，因为所有项目都是由社区开发的，所以KCC对这些项目造成的问题不承担任何责任。此外，KCC不为相关项目提供客户服务。',
    pubDate: '2021-06-16 20:00:00',
    link: 'https://docs.kcc.io/#/zh-cn/?id=%e9%a3%8e%e9%99%a9%e6%8f%90%e7%a4%ba',
  }

  const getAnnouncemet = async () => {
    try {
      const res = await axios({
        url: KCC.MEDIA_API,
      })
      const list = [...res?.data?.items]
      // filter by language
      let announcment: any[] = []
      if (i18n.language === 'zh-CN') {
        announcment.push(cnRiskAnnouncement)
        for (let i = 0; i < list.length; i++) {
          if (list[i].categories.includes('zh') || list[i].categories.includes('Zh')) {
            const validDate = list[i]?.pubDate.replace(/-/g, '/') // competible ios
            const t = new Date(validDate).getTime() + 1000 * 60 * 60 * 8
            const temp: any = { ...list[i] }
            temp.pubDate = t && moment(new Date(t)).format('YYYY-MM-DD HH:mm:ss')
            announcment.push(temp)
          }
        }
      } else {
        announcment.push(enRiskAnnouncement)
        for (let i = 0; i < list.length; i++) {
          if (!list[i].categories.includes('zh') || list[i].categories.includes('Zh')) {
            announcment.push(list[i])
          }
        }
      }
      const arr = announcment.length > 3 ? announcment.splice(0, 3) : announcment
      console.log('arr', arr)
      setAnnoucementList(() => arr)
    } catch {
      message.error(t(`Get Announcement Faied`))
    }
  }

  React.useEffect(() => {
    getAnnouncemet()
  }, [i18n.language])

  const nav2Announcement = (route: string) => {
    if (route) {
      window.open(route, '_blank')
    }
  }

  const List = React.useMemo(() => {
    return announcementList.map((item, index) => {
      return (
        <div key={index}>
          <RowBetween
            style={{
              width: '100%',
              marginTop: '10px',
              alignItems: 'cetner',
            }}
          >
            <Text onClick={nav2Announcement.bind(null, item.link)}>
              {item.title}
              <MobileView> {item.pubDate}</MobileView>
            </Text>
            <BrowserView>
              <DateText>{item.pubDate}</DateText>
            </BrowserView>
          </RowBetween>
        </div>
      )
    })
  }, [announcementList])

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    pauseOnHover: true,
    autoplay: true,
    speed: 1000,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  }

  return (
    <NoticeBarWrap>
      <NoticeBgWrap />
      <SoundFilled style={{ color: theme.colors.primary }} />
      <div style={{ maxWidth: '940px', height: '40px', overflow: 'hidden' }}>
        <Slider {...settings}>{List}</Slider>
      </div>
    </NoticeBarWrap>
  )
}

export default NoticeBar
