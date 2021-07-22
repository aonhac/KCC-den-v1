import React from 'react'
import { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons'
export interface BridgeLoadingProps {
  status: number
}

import './index.less'
import { useTranslation } from 'react-i18next'
import { theme } from '../../constants/theme'

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
