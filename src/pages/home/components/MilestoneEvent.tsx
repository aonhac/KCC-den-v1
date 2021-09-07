import React from 'react'
import styled from 'styled-components'
import DotComponent from '../../../components/Dot'
import Text from '../../../components/Text/index'
export interface MilestoneEventProps {
  date: string
  event: string
}

const EventWrap = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 180px;
`
const CupIcon = styled.img`
  width: 30px;
  height: auto;
`

const MilestoneEvent: React.FC<MilestoneEventProps> = ({ date, event }) => {
  return (
    <EventWrap>
      <CupIcon src={require('../../../assets/images/home/milestone-icon@2x').default} />
      <DotComponent />
      <Text>{date}</Text>
      <Text>{event}</Text>
    </EventWrap>
  )
}

export default MilestoneEvent
