import React from 'react'
import styled from 'styled-components'
import { RightOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { Currency } from '../../state/bridge/reducer'
import { findPair } from '../../utils/index'
import { updateCurrentPairId } from '../../state/bridge/actions'
import { useDispatch } from 'react-redux'
import { toggleConnectWalletModalShow } from '../../state/wallet/actions'
import { useTranslation } from 'react-i18next'
import { CenterRow, RowBetween } from '../Row'
import { useResponsive } from '../../utils/responsive'

export interface SelectTokenProps {
  list: any[]
  currency: Currency
  srcId: number
  distId: number
  setCurrency: any
}

const SelectTokenWrap = styled.div`
  width: 100%;
  height: 48px;
  background: rgba(1, 8, 30, 0.04);
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
`
const TokenWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  height: 46px;
`

const TokenIcon = styled.img`
  width: 28px;
  height: 28px;
  background: #d8d8d8;
  border-radius: 50%;
`

const TokenText = styled.div`
  font-family: URWDIN-Regular, URWDIN;
  padding-top: 4px;
  font-size: 16px;
  font-weight: 400;
  color: #01081e;
  margin-left: 10px;
`

const ModalTitle = styled.div`
  font-family: URWDIN-Regular, URWDIN;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  color: #00142a;
`

const TokenName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #01081e;
  height: 16px;
  text-align: left;
`

const TokenListModal = styled.div`
  z-index: 99;
  position: relative;
  background: #fff;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`
const Icon = styled.img`
  width: 20px;
  height: 20px;
`

const FullName = styled.div`
  font-size: 12px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: rgba(0, 6, 33, 0.6);
`

const TokenDescriptionWrap = styled.div`
  margin-left: 12px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  height: 36px;
`

const ListWrap = styled.div`
  height: 450px;
  overflow-y: auto;
`
const SelectItem = styled(TokenWrap)`
  padding: 0 5px 0 5px;
  border-radius: 4px;
  &:hover {
    background: rgba(1, 8, 30, 0.04);
  }
`

const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const SelectToken: React.FunctionComponent<SelectTokenProps> = ({ list, currency, srcId, distId, setCurrency }) => {
  const { t } = useTranslation()

  const { isMobile } = useResponsive()

  const [show, setShow] = React.useState<boolean>(false)
  const [keyword, setKeyword] = React.useState<string>(' ')
  const dispatch = useDispatch()

  React.useEffect(() => {
    setKeyword(() => '')
  }, [list])

  const filterList = React.useMemo(() => {
    const key = keyword.toLowerCase()
    if (key === '') {
      return list
    }
    return list.filter((token) => token.name.toLowerCase().includes(key) || token.symbol.toLowerCase().includes(key))
  }, [keyword])

  const filterChange = (e: any) => {
    setKeyword(() => e.target.value?.trim())
  }

  const selectToken = (currency: Currency) => {
    setCurrency(currency)
    const pairId = findPair(srcId, distId, currency)
    dispatch(updateCurrentPairId(pairId))
    setShow(() => false)
  }

  const close = () => {
    setShow(() => false)
  }

  const tokenList = filterList.map((token: Currency, index) => {
    return (
      <SelectTokenWrap
        onClick={selectToken.bind(null, token)}
        style={{ background: '#fff', padding: '0px', borderRadius: '0px' }}
        key={index}
      >
        <SelectItem>
          <TokenWrap>
            <TokenIcon src={token?.logoUrl} />
            <TokenDescriptionWrap>
              <TokenName>{token?.symbol.toUpperCase()}</TokenName>
              <FullName>{token.name ?? token.symbol}</FullName>
            </TokenDescriptionWrap>
          </TokenWrap>
          {token?.symbol === currency?.symbol ? (
            <Icon src={require('../../assets/images/bridge/selected@2x.png').default} />
          ) : null}
        </SelectItem>
      </SelectTokenWrap>
    )
  })

  return (
    <>
      <SelectTokenWrap>
        <TokenWrap
          onClick={() => {
            setShow(() => true)
          }}
        >
          <TokenIcon src={currency?.logoUrl} />
          <TokenText>{currency?.symbol.toUpperCase()}</TokenText>
        </TokenWrap>
        <RightOutlined style={{ fontSize: '10px', color: '#01081e' }} />
      </SelectTokenWrap>
      <Modal
        visible={show}
        footer={null}
        width={isMobile ? '100%' : '600px'}
        style={{ borderRadius: '8px', marginTop: isMobile ? '0px' : '160px' }}
        destroyOnClose
        closable={false}
        onCancel={() => {
          dispatch(toggleConnectWalletModalShow({ show: false }))
        }}
      >
        <TokenListModal>
          <RowBetween>
            <ModalTitle> {t(`Asset`)} </ModalTitle>
            <CloseIcon src={require('../../assets/images/bridge/close@2x.png').default} onClick={close} />
          </RowBetween>
          <Input
            value={keyword}
            onChange={filterChange}
            style={{ paddingTop: '4px', height: '48px', margin: '12px 0' }}
            prefix={<Icon src={require('../../assets/images/bridge/search@2x.png').default} />}
            suffix={null}
            placeholder={t('Search')}
          />
          <ListWrap>{tokenList}</ListWrap>
        </TokenListModal>
      </Modal>
    </>
  )
}

export default React.memo(SelectToken)
