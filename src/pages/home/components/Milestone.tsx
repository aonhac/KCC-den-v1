import React from 'react'
import styled from 'styled-components'
import { KCC } from '../../../constants'

const MilestoneEventListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`

const MileItem = styled.div<{ even: boolean }>`
  border-top: 2px solid #15492e;
  height: 200px;
  width: 940px;
  border-top-right-radius: ${({ even }) => {
    if (even) {
      return '100px'
    }
    return '0px'
  }};
  border-bottom-right-radius: ${({ even }) => {
    if (even) {
      return '100px'
    }
    return '0px'
  }};
  border-top-left-radius: ${({ even }) => {
    if (even) {
      return '0px'
    }
    return '100px'
  }};
  border-bottom-left-radius: ${({ even }) => {
    if (even) {
      return '0px'
    }
    return '100px'
  }};
  border-right: ${({ even }) => {
    if (even) {
      return '2px solid #49FFA1'
    }
    return 'none'
  }};
  border-left: ${({ even }) => {
    if (!even) {
      return '2px solid #49FFA1'
    }
    return 'none'
  }};
`

const MilestoneEventList = () => {
  const MilestoneList = KCC.MILESTONES.map((item, index) => {
    return (
      <MileItem key={index} even={index % 2 === 0}>
        11
      </MileItem>
    )
  })

  return <MilestoneEventListWrap>{MilestoneList}</MilestoneEventListWrap>
}

export default MilestoneEventList
