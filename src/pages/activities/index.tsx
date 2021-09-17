import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { BaseWrap, HomePageWrap } from '../home/index'
import Card from '../../components/ActivityCard'

export interface GrantsPageProps {}

const ActivitiesPageWrap = styled(HomePageWrap)`
  padding-top: 40px;
  padding-bottom: 40px;
  height: auto;
  min-height: calc(100vh - 320px);
  background: linear-gradient(0deg, #277453 0%, rgba(0, 0, 0, 1) 100%);
`
const ContentWrap = styled(BaseWrap)`
  margin-top: 68px;
  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

const ListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-column-gap: 50px;
  grid-row-gap: 50px;
  margin-top: 24px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      ${() => {
        const width = document.body.clientWidth
        return Math.floor(width / 300)
      }},
      1fr
    );
    justify-items: center;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    grid-template-columns: repeat(
      ${() => {
        const width = document.body.clientWidth
        return Math.floor(width / 300)
      }},
      1fr
    );
    justify-items: center;
  }
`

const Title = styled.div`
  height: 32px;
  font-size: 32px;
  font-family: URWDIN-Medium, URWDIN;
  font-weight: 500;
  color: #fff;
  line-height: 38px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`
const SubTitle = styled.div`
  height: 32px;
  font-size: 20px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #fff;
  line-height: 32px;
  margin-top: 30px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const ActivityWrap = styled.div`
  width: 280px;
  height: 208px;
  background: #f1f4f7;
  border-radius: 6px;
`

const ActivityImaga = styled.img`
  width: 280px;
  height: 208px;
  background: #f1f4f7;
  border-radius: 6px;
`

const ActivitiesPage: React.FunctionComponent<GrantsPageProps> = () => {
  const activities: any[] = [
    {
      thumbnail_ch: require('../../assets/images/activity/activity-1-ch.png').default,
      thumbnail_en: require('../../assets/images/activity/activity-1-en.png').default,
      deadline: '2023/07/07 10:57:33',
      url_ch:
        'https://kucoincommunitychain.medium.com/kcc%E5%A4%A7%E4%BD%BF%E8%AE%A1%E5%88%92-%E6%AD%A3%E5%BC%8F%E5%90%AF%E5%8A%A8-%E5%9B%9E%E6%8A%A5%E4%B8%B0%E5%8E%9A-%E6%9C%9F%E5%BE%85%E4%B8%93%E4%B8%9A%E7%9A%84%E6%82%A8%E5%8A%A0%E5%85%A5-f75791ffc6b9',
      url_en:
        'https://kucoincommunitychain.medium.com/the-kcc-ambassador-program-is-now-officially-initiated-783c4073c445',
    },
    {
      thumbnail_ch: require('../../assets/images/activity/KCC-AMA-CN.png').default,
      thumbnail_en: require('../../assets/images/activity/KCC-AMA-EN.png').default,
      deadline: '2021/08/09 10:57:33',
      url_ch: 'https://kccofficial.medium.com/kcc-ama-series-episode-1-whats-done-and-what-s-next-in-2021-4f50685a350c',
      url_en: 'https://kccofficial.medium.com/kcc-ama-series-episode-1-whats-done-and-what-s-next-in-2021-4f50685a350c',
    },
    {
      thumbnail_ch: require('../../assets/images/activity/kuswap-cn.jpg').default,
      thumbnail_en: require('../../assets/images/activity/kuswap-en.jpg').default,
      deadline: '2021/08/09 10:57:33',
      url_ch: 'https://kccofficial.medium.com/kcc-ama-series-episode2-kuswap-safety-and-security-c642a46015f8',
      url_en: 'https://kccofficial.medium.com/kcc-ama-series-episode2-kuswap-safety-and-security-c642a46015f8',
    },
    {
      thumbnail_ch: require('../../assets/images/activity/nft-cn.png').default,
      thumbnail_en: require('../../assets/images/activity/nft-en.png').default,
      deadline: '2021/09/10 10:57:33',
      url_ch: 'https://kccofficial.medium.com/kcc-ama-series-episode3-nfts-realm-nft-and-kcc-321d661d00f4',
      url_en: 'https://kccofficial.medium.com/kcc-ama-series-episode3-nfts-realm-nft-and-kcc-321d661d00f4',
    },
    {
      thumbnail_ch: require('../../assets/images/activity/stable-coin-cn.jpg').default,
      thumbnail_en: require('../../assets/images/activity/stable-coin-en.jpg').default,
      deadline: '2021/09/10 10:57:33',
      url_ch: 'https://kccofficial.medium.com/kcc-ama-series-episode4-paprprintr-stablecoin-and-kcc-63ce6c7401ce',
      url_en: 'https://kccofficial.medium.com/kcc-ama-series-episode4-paprprintr-stablecoin-and-kcc-63ce6c7401ce',
    },
  ]

  const [endedList, setEndedList] = React.useState([])
  const [onGoingList, setOnGoingList] = React.useState([])

  // group handle
  React.useEffect(() => {
    const end: any = []
    const ongoing: any = []
    for (let i = 0; i < activities.length; i++) {
      const activity = { ...activities[i], valid: false }
      const timestamp = new Date().getTime()
      const activityTimestamp = new Date(activity.deadline.replace('-', '/')).getTime()
      if (timestamp >= activityTimestamp) {
        end.push(activity)
      } else {
        ongoing.push({ ...activity, valid: true })
      }
    }
    setEndedList(() => end)
    setOnGoingList(() => ongoing)
  }, [])

  const { t } = useTranslation()

  const ActivityList = onGoingList.map((item, index) => {
    return <Card key={index} {...item} />
  })

  const overList = endedList.map((item, index) => {
    return <Card key={index} {...item} />
  })

  return (
    <ActivitiesPageWrap>
      {/* banner */}
      <ContentWrap>
        <Title>{t(`KCC Activity Center`)}</Title>
        <SubTitle>{t(`In Progress`)}</SubTitle>
        <ListWrap>{ActivityList}</ListWrap>
      </ContentWrap>
      {endedList.length ? (
        <ContentWrap>
          <SubTitle>{t(`The Event Is Over`)}</SubTitle>
          <ListWrap>{overList}</ListWrap>
        </ContentWrap>
      ) : null}
    </ActivitiesPageWrap>
  )
}

export default ActivitiesPage
