import React from 'react'
import styled from 'styled-components'
import { BridgeTitle, CheckListType } from '../../pages/bridge/transfer'
import { useTranslation } from 'react-i18next'
import { Input, Button } from 'antd'
import { CenterRow } from '../Row/index'
import { Currency, PairInfo } from '../../state/bridge/reducer'
import BN from 'bignumber.js'
import { getPairInfo, getDecimals } from '../../utils/index'
import { useWeb3React } from '@web3-react/core'
import { getNetWorkConnect } from '../../connectors/index'
import Web3 from 'web3'
import { theme } from '../../constants/theme'

export interface AmountInputProps {
  amount: string
  setAmount: any
  totalSupply: string
  checkList: CheckListType
  setCheckList: any
  available: string
  pairId: number
  swapFee: string
  supplyLoading: boolean
  availabelLoading: boolean
  swapFeeLoading: boolean
  receiveAddress: string
}

const AmountInputWrap = styled.div`
  margin-top: 16px;
  width: 100%;
  .ant-input {
    background-color: #f5f5f6;
    height: 38px;
  }
`

export const TextWrap = styled(CenterRow)`
  align-items: center;
  justify-content: space-between;
`

const SuffixText = styled.span`
  font-family: URWDIN-Regular;
  height: 16px;
  font-weight: 400;
  color: rgba(1, 8, 30, 0.38);
  font-size: 16px;
`
const Max = styled(SuffixText)`
  font-size: 14px;
  color: ${theme.colors.bridgePrimay};
  position: relative;
  top: 1px;
  right: 18px;
  padding-left: 5px;
`

export const ErrorText = styled.span`
  font-family: URWDIN-Regular;
  color: #f00;
  font-size: 12px;
  flex: 1;
  width: 400px;
  text-align: right;
`
export enum TransferType {
  'NATIVE',
  'TOKEN',
}

const AmountInput: React.FunctionComponent<AmountInputProps> = ({
  amount,
  setAmount,
  checkList,
  setCheckList,
  totalSupply,
  available,
  pairId,
  swapFee,
  supplyLoading,
  availabelLoading,
  swapFeeLoading,
  receiveAddress,
}) => {
  const { t, i18n } = useTranslation()
  const { account } = useWeb3React()
  const [errorInfo, setErrorInfo] = React.useState<string>('Invalid number')
  const [maxAvailableBalance, setMaxAvailableBalance] = React.useState<string>('')

  const pairInfo = React.useMemo(() => {
    return getPairInfo(pairId)
  }, [pairId])

  /* get info from chain */
  const maxLimit = new BN(pairInfo?.max as any).toNumber() === 0 ? false : true

  // the the min decimals between two chains
  const decimalsLimit = React.useMemo(() => {
    if (!pairInfo) return 0
    return pairInfo?.srcChainInfo.decimals > pairInfo?.dstChainInfo.decimals
      ? pairInfo?.dstChainInfo.decimals
      : pairInfo?.srcChainInfo.decimals
  }, [pairInfo?.srcChainInfo.decimals, pairInfo?.dstChainInfo.decimals])

  const maxAvailable = React.useMemo(() => {
    async function getAvailable() {
      if (!pairInfo) return
      if (pairInfo.srcChainInfo.tag !== 0) {
        setMaxAvailableBalance(() =>
          new BN(available).div(Math.pow(10, pairInfo.srcChainInfo.decimals)).toFixed(decimalsLimit, 1)
        )
      } else {
        const connector = getNetWorkConnect(pairInfo.srcChainInfo.chainId) as any
        const web3 = new Web3(connector.provider)
        const gasLimit = await web3.eth.estimateGas({ to: receiveAddress, from: account as string, value: available })
        const gasPrice = await web3.eth.getGasPrice()
        const operateFee = new BN(gasPrice).multipliedBy(gasLimit).toString()
        let max = new BN(available)
          .minus(operateFee)
          .div(Math.pow(10, pairInfo.srcChainInfo.decimals))
          .toFixed(decimalsLimit, 1)
        if (new BN(max).lt(0)) {
          max = '0'
        }
        setMaxAvailableBalance(() => max)
      }
    }
    getAvailable()
  }, [pairInfo, available, decimalsLimit])

  const isMax = React.useMemo(() => {
    if (!amount) return false
    console.log('maxAvailable', maxAvailable)
    return maxAvailableBalance === amount
  }, [amount, maxAvailableBalance, pairInfo])

  const setErrorInfoPrehandle = (key: string): string => {
    switch (key) {
      case 'errorFormatText':
        return t(`Invalid number`)
      case 'decimalErrorText':
        return t(`The decimal point cannot exceed`)
      case 'insufficientText':
        return t(`Insufficient available balance`)
      case 'insufficientFeeText':
        return t(`Insufficient transfer fee`)
      case 'minAmountText':
        return t(`The minimum exchange quantity is`) + ' ' + new BN(pairInfo?.min ?? 0).toNumber().toString()
      case 'maxAmountText':
        return t(`The maximum exchange quantity is`) + ' ' + new BN(pairInfo?.max ?? 0).toNumber().toString()
      case 'insufficienBridgeText':
        return t(`Input amount is bigger than bridge available balance`)
      case 'lessThanFeeText':
        return t(`Input amount should bigger than transfer fee`)
      default:
        return t('Invalid amount')
    }
  }

  const updateAddressStatus = (status: boolean, text?: string) => {
    setCheckList((list: any) => {
      return { ...list, amount: status }
    })
    text && setErrorInfo(() => text)
  }

  const hasSufficientSwapFee = async () => {
    if (!account || !pairInfo) return false
    /*  console.log('swapfee', swapFee)
    console.log('available', available) */

    // native check
    if (pairInfo.srcChainInfo.tag === 0) {
      if (new BN(swapFee).gte(available)) {
        return false
      }
    }
    // token check
    // check chian
    const connector = getNetWorkConnect(pairInfo.srcChainInfo.chainId)
    const web3 = new Web3(connector.provider as any)
    const nativeBalance = await web3.eth.getBalance(account)
    if (new BN(swapFee).gt(nativeBalance)) {
      return false
    }
    return true
  }

  const checkAmountOverflow = (inputAmount: string, input: string, pair: PairInfo) => {
    // check swapFee
    if (!hasSufficientSwapFee()) {
      updateAddressStatus(false, setErrorInfoPrehandle('insufficientFeeText'))
      return
    }

    // check native
    if (pair.srcChainInfo.tag === 0) {
      // available > input
      if (new BN(inputAmount).gte(available)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficientText'))
        return
      }

      // input > fee
      if (new BN(inputAmount).lte(swapFee)) {
        updateAddressStatus(false, setErrorInfoPrehandle('lessThanFeeText'))
        return
      }
    }

    // check token availble
    if (pair.srcChainInfo.tag === 1) {
      if (new BN(inputAmount).gt(available)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficientText'))
        return
      }
    }

    // check supply
    if (pair.limitStatus) {
      // if is native token,should minus swapFee first
      let amountWithoutFee = new BN(0)
      if (pair.srcChainInfo.tag === 0) {
        const swapFeeEther = new BN(swapFee).div(Math.pow(10, pair.srcChainInfo.decimals))
        amountWithoutFee = new BN(input).minus(swapFeeEther)
      } else {
        amountWithoutFee = new BN(input)
      }

      if (amountWithoutFee.multipliedBy(Math.pow(10, pair.dstChainInfo.decimals)).gt(totalSupply)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficienBridgeText'))
        return
      }
    }

    // check min
    if (new BN(input).lt(new BN(pair.min as any))) {
      updateAddressStatus(false, setErrorInfoPrehandle('minAmountText'))
      return
    }

    // check max
    if (maxLimit && new BN(input).gt(new BN(pair.max as any))) {
      updateAddressStatus(false, setErrorInfoPrehandle('maxAmountText'))
      return
    }

    updateAddressStatus(true, '')
  }

  const changeAmount = (e: any) => {
    if (!pairInfo?.srcChainInfo) return

    const input = typeof e === 'string' ? e : e.target.value.trim()
    const inputAmount = new BN(input).multipliedBy(Math.pow(10, pairInfo?.srcChainInfo.decimals)).toString()

    const decimal = getDecimals(input)

    if (input[0] === '.' || new BN(input).lte(0)) {
      // invalid number format
      updateAddressStatus(false, setErrorInfoPrehandle('errorFormatText'))
    } else if (decimalsLimit && decimal > decimalsLimit) {
      // invalid decimal
      updateAddressStatus(false, setErrorInfoPrehandle('decimalErrorText') + decimalsLimit)
    } else {
      checkAmountOverflow(inputAmount, input, pairInfo)
    }

    setAmount(() => input)
  }

  React.useEffect(() => {
    if (!swapFeeLoading && !supplyLoading && !swapFeeLoading) {
      changeAmount(String(amount))
    }
  }, [
    pairInfo,
    i18n.language,
    pairId,
    available,
    swapFee,
    totalSupply,
    swapFeeLoading,
    availabelLoading,
    supplyLoading,
  ])

  const keyPress = (e: any) => {
    const validKeys = '0,1,2,3,4,5,6,7,9,.'.split(',')
    if (!validKeys.includes(e.key) || (e.key === '.' && amount.indexOf('.') !== -1)) {
      e.preventDefault()
    }
  }

  return (
    <AmountInputWrap>
      <TextWrap>
        <BridgeTitle style={{ width: '100px' }}>{t(`Amount`)}</BridgeTitle>
        {!checkList.amount && account && !swapFeeLoading && !supplyLoading && !availabelLoading ? (
          <ErrorText> * {errorInfo}</ErrorText>
        ) : null}
      </TextWrap>
      <Input
        value={amount}
        maxLength={8}
        min={0}
        onInput={changeAmount}
        onKeyPress={keyPress}
        style={{ background: '#F5F5F6' }}
        suffix={
          <CenterRow>
            {!isMax ? (
              <Button
                size="small"
                type="link"
                style={{ width: '40px' }}
                onClick={() => {
                  setAmount(() => maxAvailableBalance)
                }}
              >
                <Max>{t(`Max`)} | </Max>
              </Button>
            ) : null}

            <SuffixText>{pairInfo?.srcChainInfo.currency.toUpperCase()}</SuffixText>
          </CenterRow>
        }
      />
    </AmountInputWrap>
  )
}

export default React.memo(AmountInput)
