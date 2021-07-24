import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import BN from 'bignumber.js'
import { LoadingOutlined } from '@ant-design/icons'
import { getPairInfo } from '../../utils/index'
import { PairInfo } from '../../state/bridge/reducer'
import { formatCurrency } from '../../utils/format'
export interface TransferLimitProps {
  loading: boolean
  available: string
  pairId: number
}

const TransferLimitWrap = styled.div<{ show: boolean }>`
  display: ${({ show }) => {
    if (show) {
      return 'flex'
    }
    return 'none'
  }};
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`
const Title = styled.div`
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 1, 50, 0.6);
  line-height: 22px;
  @media (max-width: 768px) {
    height: auto;
    text-align: center;
  }
`

const TransferLimit: React.FunctionComponent<TransferLimitProps> = ({ loading, available, pairId }) => {
  const { t } = useTranslation()

  const selectedPairInfo = React.useMemo(() => {
    return getPairInfo(pairId)
  }, [pairId])

  return (
    <TransferLimitWrap show={Boolean(selectedPairInfo?.limitStatus)}>
      <Title>
        {t(`Available Bridge Balance`)}:
        {loading ? (
          <LoadingOutlined
            style={{
              margin: '4px 10px 0px 10px',
              width: '12px',
              height: '12px',
              color: '#000',
              fontSize: '10px',
            }}
          />
        ) : (
          <span>
            {formatCurrency(
              new BN(available).div(Math.pow(10, selectedPairInfo?.dstChainInfo.decimals as number)).toString()
            )}
          </span>
        )}
      </Title>
    </TransferLimitWrap>
  )
}

export default TransferLimit
