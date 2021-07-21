import React from 'react'
import styled from 'styled-components'
import { RightOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { Currency } from '../../state/bridge/reducer'
export interface SelectTokenProps {
  list: any[]
  setCurrency: any
  currency: Currency
}

const SelectTokenWrap = styled.div`
  width: 100%;
  height: 48px;
  background: rgba(1, 8, 30, 0.04);
  border-radius: 4px;
  display: flex;
  flex-flow: row-nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  cursor: pointer;
`
const TokenWrap = styled.div`
  display: flex;
  flex-flow: row-nowrap;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
`

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
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
const TokenName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #01081e;
  height: 16px;
  text-align: left;
`

const TokenListModal = styled.div`
  z-index: 99;
  position: absolute;
  padding: 40px 32px;
  background: #fff;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0;
`
const Icon = styled.img`
  width: 16px;
  height: 16px;
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
  text-align: flex;
  height: 36px;
`

const ListWrap = styled.div`
  height: 500px;
  overflow-y: scroll;
`
const SelectItem = styled(TokenWrap)`
  padding: 0 14px;
  &:hover {
    background: #f1fcf8;
  }
`

const SelectToken: React.SFC<SelectTokenProps> = ({ list, currency, setCurrency }) => {
  const [show, setShow] = React.useState<boolean>(false)
  const [keyword, setKeyword] = React.useState<string>(' ')

  React.useEffect(() => {
    setKeyword(() => '')
  }, [list])

  const filterList = React.useMemo(() => {
    const key = keyword.toLowerCase()
    if (key === '') {
      return list
    }
    return list.filter((token) => token.name.toLowerCase().includes(key))
  }, [keyword])

  const filterChange = (e: any) => {
    setKeyword(() => e.target.value)
  }

  const selectToken = (currency: Currency) => {
    setCurrency(currency)
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
      {show ? (
        <TokenListModal>
          <SelectTokenWrap>
            <Input
              value={keyword}
              onChange={filterChange}
              style={{ paddingTop: '4px' }}
              prefix={<Icon src={require('../../assets/images/bridge/search@2x.png').default} />}
              suffix={<Icon onClick={close} src={require('../../assets/images//bridge/close@2x.png').default} />}
            />
          </SelectTokenWrap>
          <ListWrap>{tokenList}</ListWrap>
        </TokenListModal>
      ) : null}
    </SelectTokenWrap>
  )
}

export default React.memo(SelectToken)
