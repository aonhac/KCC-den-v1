import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'
import SelectToken from '../../components/SelectToken/SelectToken'
import ChainBridge, { Box } from '../../components/ChainBridge'
import AmountInput, { ErrorText, TextWrap } from '../../components/AmountInput'
import Row from '../../components/Row'
import { useWeb3React } from '@web3-react/core'
import TransferButton from '../../components/TransferButton'
import { ChainBridgeType } from './confirm'
import TransferLimit from '../../components/TransferLimit'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'
import { LoadingOutlined } from '@ant-design/icons'
import { Currency, PairChainInfo } from '../../state/bridge/reducer'
import { updateCurrentCurrency, updateCurrentPairId } from '../../state/bridge/actions'
import { checkAddress, getApproveStatus, getNetworkInfo, getPairInfo, getSwapFee, web3Utils } from '../../utils'
import { getErc20Contract } from '../../utils/contract'
import { updateBridgeLoading } from '../../state/application/actions'
import { getNetWorkConnect } from '../../connectors'
import { useHistory } from 'react-router-dom'
import {
  useTokenList,
  useCurrentCurrency,
  useTokenSupporChain,
  usePariList,
  useCurrentPairId,
} from '../../state/bridge/hooks'
import Web3 from 'web3'
import { BridgeService } from '../../api/bridge'
import { theme } from '../../constants/theme'

export enum ListType {
  'WHITE',
  'BLACK',
}

export interface BridgeTransferPageProps {}

export interface TransferOrder {
  pairId: number
  currency: Currency
  srcId: number
  distId: number
  amount: string
  fee: string
  from: string
  receiver: string
  timestamp: string
}

export const BridgeTransferWrap = styled.div`
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-subtract;
  align-items: center;
  height: auto;
  min-height: calc(100vh - 400px);
`

export const TransferWrap = styled.div`
  margin-top: 156px;
  background: #fff;
  width: 516px;
  backgroud: #fff;
  padding: 32px;
  border-radius: 8px;
  position: relative;
  background: #f2fffd;
`
export const BridgeTitle = styled.div`
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: rgba(1, 8, 30, 0.6);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 200px;
`
const ReceiveText = styled.span`
  height: 14px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #00003a;
`

export const NoFeeText = styled(ReceiveText)`
  text-decoration: line-through;
  padding: 0px 5px;
  color: #000;
`

const ReceiveAmountText = styled(ReceiveText)`
  font-weight: bold;
`

export const ChainTag = styled.div`
  padding: 0 8px;
  background: rgba(49, 215, 160, 0.08);
  border-radius: 2px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`
export const ChainText = styled.span`
  padding-top: 2px;
  font-size: 12px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #31d7a0;
`

export const ReceiveAddressWrap = styled.div`
  margin-top: 17px;
  .ant-input {
    background: #f3f5f6;
    height: 48px;
  }
`

const NoticeText = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-family: URWDIN-Regular, URWDIN;
  font-weight: 400;
  color: #000132;
  line-height: 20px;
`

const statusList = {
  swapFee: false,
  totolSupply: false,
  available: false,
  pair: false,
  amount: false,
  address: false,
  approve: false,
  network: false,
  senderWhite: false,
  senderBlack: false,
  receiverWhite: false,
  receiverBlack: false,
}

export type CheckListType = typeof statusList

const BridgeTransferPage: React.FunctionComponent<BridgeTransferPageProps> = () => {
  const { t } = useTranslation()
  const { account, chainId, library } = useWeb3React()
  const [srcId, changeSrcId] = React.useState(0)
  const [distId, changeDistId] = React.useState(0)
  const [receiveAddress, setReceiveAddress] = React.useState<any>(account)
  const [amount, setAmount] = React.useState<string>('')
  const [available, setAvailable] = React.useState<string>('0')
  const [totalSupply, setTotalSupply] = React.useState<string>('0')
  const [swapFee, setSwapFee] = React.useState<string>('0')

  const [availableLoading, setAvailableLoading] = React.useState<boolean>(false)

  const [supplyLoading, setSupplyLoading] = React.useState<boolean>(false)
  const [swapFeeLoading, setSwapFeeLoading] = React.useState<boolean>(false)
  const [bridgeStatusLoading, setBridgeStatusLoading] = React.useState<boolean>(false)

  // important state
  const [bridgeStatus, setBridgeStatus] = React.useState<boolean>(false)

  const currency = useCurrentCurrency()

  const history = useHistory()

  const { srcChainIds, distChainIds } = useTokenSupporChain()

  // the status list of transfer asset rules
  const [checkList, setCheckList] = React.useState<typeof statusList>(statusList)

  const dispatch = useDispatch()
  const tokenList = useTokenList()
  const pairList = usePariList()
  const currentPairId = useCurrentPairId()

  const setSelectedCurrency = (currency: Currency) => {
    dispatch(updateCurrentCurrency({ currency: currency }))
  }

  const checkNetwork = (currentNetworkId: number, sendNetworkId: number) => {
    return currentNetworkId === sendNetworkId
  }

  // get bridgeStatus
  const initBridgeStatus = async () => {
    try {
      setBridgeStatusLoading(() => true)
      const fusingResponse = await BridgeService.getBridgeStatus()
      if (fusingResponse?.data.data.status === 0) {
        setBridgeStatus(() => true)
      } else {
        setBridgeStatus(() => false)
      }
    } catch {
      setBridgeStatusLoading(() => false)
    }
  }

  React.useEffect(() => {
    initBridgeStatus()
  }, [])

  // get selectedPairInfo
  const selectedPairInfo = React.useMemo(() => {
    if (currentPairId !== -1) {
      setCheckList((list) => {
        return {
          ...list,
          pair: currentPairId !== -1,
        }
      })
      return getPairInfo(currentPairId)
    }
  }, [currentPairId])

  /**
   * @description init swap fee
   */
  React.useEffect(() => {
    async function initFee() {
      if (!selectedPairInfo) return
      setSwapFeeLoading(() => true)
      try {
        const fee = await getSwapFee(selectedPairInfo, library, isSelectedNetwork)
        setSwapFee(() => new BN(fee).toNumber().toString())
        setCheckList((list) => {
          return {
            ...list,
            swapFee: true,
          }
        })
      } catch (e) {
        console.log(e)
        setSwapFee(() => '0')
        setCheckList((list) => {
          return {
            ...list,
            swapFee: false,
          }
        })
      } finally {
        setTimeout(() => {
          setSwapFeeLoading(() => false)
        }, 500)
      }
    }
    initFee()
  }, [selectedPairInfo, currentPairId])

  /**
   * @description init select network
   */

  React.useEffect(() => {
    if (srcChainIds.length && srcId === 0 && currentPairId === -1) {
      changeSrcId(srcChainIds[0])
    }
  }, [srcChainIds, distChainIds, currentPairId])

  /**
   * @description update receiver address
   */
  React.useEffect(() => {
    setReceiveAddress(() => account)
    if (account) {
      setCheckList((list) => {
        return {
          ...list,
          address: true,
        }
      })
    }
  }, [account])

  const isSelectedNetwork = React.useMemo(() => {
    return chainId === srcId
  }, [chainId, srcId])

  const changeReceiveAddress = (e: any) => {
    const address = e.target.value.trim()
    const isAddress = web3Utils.isAddress(address) && address !== '0x0000000000000000000000000000000000000000'
    setCheckList((list) => {
      return {
        ...list,
        address: isAddress,
      }
    })
    setReceiveAddress(() => address)
  }

  /**
   * @description init the asset selected
   */
  React.useEffect(() => {
    if (currency.symbol === '' && tokenList.length) {
      dispatch(updateCurrentCurrency({ currency: tokenList[0] }))
    }
  }, [tokenList])

  /**
   * @descriptionSelect choose the user selected token last time
   */
  React.useEffect(() => {
    if (currency.symbol !== '') {
      setSelectedCurrency(currency)
    }
  }, [])

  const selectedNetworkInfo = React.useMemo(() => {
    return getNetworkInfo(selectedPairInfo?.srcChainInfo.chainId as any)
  }, [selectedPairInfo])

  // update selected pairId
  React.useEffect(() => {
    console.log('currency', currency)
    if (srcId && distId && currency.name) {
      for (let i = 0; i < pairList?.length; i++) {
        const chain = pairList[i]
        const srcChainInfo = chain.srcChainInfo
        const distChainInfo = chain.dstChainInfo
        if (
          srcChainInfo.currency === currency.symbol &&
          srcChainInfo.chainId === srcId &&
          distChainInfo.chainId === distId
        ) {
          dispatch(updateCurrentPairId(chain.id))
          return
        }
      }

      if (srcChainIds.length) {
        changeSrcId(srcChainIds[0])
      } else {
        changeSrcId(() => 0)
      }
    } else {
      dispatch(updateCurrentPairId(-1))
      if (srcChainIds.length) {
        changeSrcId(srcChainIds[0])
      } else {
        changeSrcId(() => 0)
      }
    }
  }, [srcId, distId, currency.name])

  /**
   * @description get available status
   */
  React.useEffect(() => {
    async function callback() {
      if (account && currency.symbol && selectedPairInfo) {
        setAvailableLoading(() => true)
        const selectedSrcChainInfo = selectedPairInfo?.srcChainInfo as PairChainInfo
        const lib = getNetWorkConnect(selectedSrcChainInfo?.chainId) as any
        // debugger
        // chain token
        let timer: any = null
        try {
          if (selectedSrcChainInfo.tag === 0) {
            const web3 = new Web3(lib.provider)
            await web3.eth.getBalance(account).then(async (res: any) => {
              console.log('native available', res)
              await setTimeout(() => {
                setAvailable(() => new BN(res).toString(10))
              }, 500)
            })
          } else {
            const contract = getErc20Contract(selectedSrcChainInfo.contract, lib)
            await contract.methods
              .balanceOf(account)
              .call()
              .then((r: any) => {
                console.log('token available', r)
                setAvailable(() => r.toString())
              })
          }
          // debugger

          setCheckList((list) => {
            return {
              ...list,
              available: true,
            }
          })
        } catch {
          setAvailable(() => '0')
          setCheckList((list) => {
            return {
              ...list,
              available: false,
            }
          })
        } finally {
          setTimeout(() => {
            setAvailableLoading(() => false)
          }, 500)
        }
      }
    }
    callback()
  }, [account, selectedPairInfo])

  /**
   * @description get approve status of pairInfo
   */

  React.useEffect(() => {
    if (selectedPairInfo && account) {
      if (selectedPairInfo?.srcChainInfo.tag === 0) {
        setCheckList((list) => {
          return { ...list, approve: true }
        })
      } else {
        const chain = getNetworkInfo(chainId as any)
        getApproveStatus(account, selectedPairInfo.srcChainInfo.contract, chain.bridgeCoreAddress, library).then(
          (allowance) => {
            setCheckList((list) => {
              return { ...list, approve: Boolean(allowance) }
            })
          }
        )
      }
    } else {
      setCheckList((list) => {
        return { ...list, approve: false }
      })
    }
  }, [selectedPairInfo, account])

  const isTransferToSelf = React.useMemo(() => {
    if (account && receiveAddress) {
      return account === receiveAddress
    }
    return false
  }, [account, receiveAddress])

  /**
   * @description get status of address status
   * when receiver = sender,only check one,otherwise,check both address
   * when pair whiteListStatus is false, no check for whiteList
   */
  React.useEffect(() => {
    if (account && receiveAddress && checkList.address) {
      const cb = async () => {
        // check whiteList first
        if (selectedPairInfo?.whiteListStatus === false) {
          setCheckList((list) => {
            return { ...list, senderWhite: true, receiverWhite: true }
          })
        } else {
          const senderStatus = await checkAddress(account, ListType.WHITE)
          // when isTransferToSelf
          if (isTransferToSelf) {
            setCheckList((list) => {
              return { ...list, senderWhite: senderStatus, receiverWhite: senderStatus }
            })
          } else {
            const receiverStatus = await checkAddress(receiveAddress, ListType.WHITE)
            setCheckList((list) => {
              return { ...list, senderWhite: senderStatus, receiverWhite: receiverStatus }
            })
          }
        }

        // start to check blackList
        const senderStatus = await checkAddress(account, ListType.BLACK)
        // when isTransferToSelf
        if (isTransferToSelf) {
          setCheckList((list) => {
            return { ...list, senderBlack: !senderStatus, receiverBlack: !senderStatus }
          })
        } else {
          const receiverStatus = await checkAddress(receiveAddress, ListType.BLACK)
          setCheckList((list) => {
            return { ...list, senderBlack: !senderStatus, receiverBlack: !receiverStatus }
          })
        }
      }
      cb()
    }
  }, [account, receiveAddress, selectedPairInfo?.whiteListStatus])

  const generateOrder = () => {
    if (!selectedPairInfo) return
    const newOrder = {
      pairId: currentPairId,
      srcId: srcId,
      distId: distId,
      from: account as string,
      receiver: receiveAddress,
      fee: swapFee,
      amount: new BN(amount).multipliedBy(Math.pow(10, selectedPairInfo?.srcChainInfo.decimals)).toString(),
      timestamp: '',
      currency: currency,
    }
    localStorage.setItem('PRESEND_ORDER', JSON.stringify(newOrder))
  }

  const generateOrderAndConfirm = () => {
    generateOrder()
    history.push('/bridge/confirm')
  }

  const applyApprove = async () => {
    if (selectedPairInfo) {
      const contract = getErc20Contract(selectedPairInfo?.srcChainInfo.contract, library)
      const network = getNetworkInfo(selectedPairInfo?.srcChainInfo.chainId)
      await contract.methods
        .approve(
          network.bridgeCoreAddress,
          '115792089237316195423570985008687907853269984665640564039457584007913129639935'
        )
        .send({ from: account })
        .once('sending', () => {
          dispatch(updateBridgeLoading({ visible: true, status: 0 }))
        })
        .once('confirmation', (confirmations: number) => {
          console.log(confirmations)
          dispatch(updateBridgeLoading({ visible: true, status: 1 }))
          setTimeout(() => {
            setCheckList((list) => {
              return { ...list, approve: true }
            })
            dispatch(updateBridgeLoading({ visible: false, status: 0 }))
            generateOrderAndConfirm
          }, 2000)
        })
        .on('error', () => {
          dispatch(updateBridgeLoading({ visible: false, status: 0 }))
        })
    }
  }

  // get dist chain available

  const getTotalSupply = async (): Promise<any> => {
    try {
      setSupplyLoading(() => true)
      if (!selectedPairInfo) return
      const chain = getNetworkInfo(selectedPairInfo.dstChainInfo.chainId)
      const connector = getNetWorkConnect(selectedPairInfo.dstChainInfo.chainId)
      const contract = getErc20Contract(selectedPairInfo.dstChainInfo.contract, connector)
      // const supply = await contract.methods.totalSupply().call()
      let supply = '0'
      // navitve
      if (selectedPairInfo.dstChainInfo.tag === 0) {
        console.log('check the dist chain native available')
        const web3 = new Web3(connector.provider as any)
        supply = await web3.eth.getBalance(chain.bridgeCoreAddress)
      } else {
        // token
        console.log('check the dist chain token available')
        console.log(selectedPairInfo.dstChainInfo.contract, chain.bridgeCoreAddress)
        console.log(selectedPairInfo.dstChainInfo.chainId)
        supply = await contract.methods.balanceOf(chain.bridgeCoreAddress).call()
      }
      setTotalSupply(() => String(supply))
      setTimeout(() => {
        setSupplyLoading(() => false)
      }, 1000)
      setCheckList((list) => {
        return {
          ...list,
          totolSupply: true,
        }
      })
    } catch {
      setCheckList((list) => {
        return {
          ...list,
          totolSupply: false,
        }
      })
    }
  }

  React.useEffect(() => {
    getTotalSupply()
  }, [selectedPairInfo?.limitStatus, currentPairId])

  // component did mount
  React.useEffect(() => {
    const result = checkNetwork(chainId as number, selectedPairInfo?.srcChainInfo.chainId as number)
    setCheckList((list) => {
      return {
        ...list,
        network: result,
      }
    })
  }, [chainId, selectedPairInfo?.srcChainInfo.chainId])

  return (
    <BridgeTransferWrap>
      <TransferWrap>
        <TransferLimit pairId={currentPairId} available={totalSupply} loading={supplyLoading} />
        <BridgeTitle>{t(`Asset`)}</BridgeTitle>
        <SelectToken list={tokenList} setCurrency={setSelectedCurrency} currency={currency} />
        <ChainBridge
          pairId={currentPairId}
          srcId={srcId}
          distId={distId}
          changeDistId={changeDistId}
          changeSrcId={changeSrcId}
          currency={currency}
          type={ChainBridgeType.OPERATE}
        />
        <AmountInput
          currency={currency}
          amount={amount}
          setAmount={setAmount}
          totalSupply={totalSupply}
          checkList={checkList}
          available={available}
          setCheckList={setCheckList}
          pairId={currentPairId}
          swapFee={swapFee}
          supplyLoading={supplyLoading}
          availabelLoading={availableLoading}
          swapFeeLoading={swapFeeLoading}
        />
        <Row style={{ marginTop: '9px', justifyContent: 'space-between' }}>
          {account ? (
            <>
              <Box>
                <ReceiveText style={{ marginLeft: '10px' }}>{t(`Available`)}: </ReceiveText>
                {!availableLoading ? (
                  <ReceiveAmountText>
                    {new BN(available)
                      .div(Math.pow(10, selectedPairInfo?.srcChainInfo.decimals as any))
                      .toFixed(6)
                      .toString() ?? 0}
                    {currency.symbol.toUpperCase()}
                  </ReceiveAmountText>
                ) : (
                  <LoadingOutlined
                    style={{
                      margin: '4px 10px 0px 10px',
                      width: '12px',
                      height: '12px',
                      color: '#000',
                      fontSize: '10px',
                    }}
                  />
                )}
              </Box>
              <Box style={{ textAlign: 'right' }}>
                <ReceiveText style={{ marginLeft: '10px' }}>{t(`Transfer fee`)}: </ReceiveText>
                {!swapFeeLoading ? (
                  <>
                    {selectedNetworkInfo?.fee ? <NoFeeText>{selectedNetworkInfo?.fee}</NoFeeText> : null}
                    <ReceiveAmountText style={{ color: theme.colors.bridgePrimay }}>
                      {new BN(swapFee).div(Math.pow(10, selectedNetworkInfo?.decimals)).toNumber().toString() ?? '0'}
                      {selectedNetworkInfo?.symbol.toUpperCase()}
                    </ReceiveAmountText>
                  </>
                ) : (
                  <LoadingOutlined
                    style={{
                      margin: '4px 10px 0px 10px',
                      width: '12px',
                      height: '12px',
                      color: '#000',
                      fontSize: '10px',
                    }}
                  />
                )}
              </Box>
            </>
          ) : (
            <>
              <ReceiveText>{t(`You will receive`)}</ReceiveText>
              <ReceiveAmountText>
                {t(` ≈ ${amount ?? 0} ${selectedNetworkInfo?.symbol.toUpperCase()}`)}
              </ReceiveAmountText>
            </>
          )}
        </Row>
        <ReceiveAddressWrap>
          <TextWrap>
            <BridgeTitle>{t(`Receiving address`)}</BridgeTitle>
            {!checkList.address && account ? <ErrorText> * {t(`Invalid address`)}</ErrorText> : null}
          </TextWrap>
          <Input value={receiveAddress} onChange={changeReceiveAddress} placeholder={t(`Destination address`)} />
          <NoticeText>{t(`Invalid address notice`)}</NoticeText>
        </ReceiveAddressWrap>
        <TransferButton
          pairId={currentPairId}
          checkList={checkList}
          applyApprove={applyApprove}
          generateOrder={generateOrder}
          amount={amount}
          bridgeStatus={bridgeStatus}
        />
      </TransferWrap>
    </BridgeTransferWrap>
  )
}

export default BridgeTransferPage
