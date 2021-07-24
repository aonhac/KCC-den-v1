import React from 'react'
import { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { theme } from '../../constants/theme'
import './index.less'

export interface BridgeLoadingProps {
  status: number
}

const BridgeLoading: React.FunctionComponent<BridgeLoadingProps> = ({ status }) => {
  return (
    <>
      {status === 0 ? (
        <LoadingOutlined
          style={{
            color: theme.colors.bridgePrimay,
            fontSize: '50px',
            animation: 'loadingCircle 1.5s infinite linear',
          }}
        />
      ) : (
        <CheckCircleTwoTone style={{ fontSize: '50px' }} twoToneColor={theme.colors.bridgePrimay} />
      )}
    </>
  )
}

export default BridgeLoading
