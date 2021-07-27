import React, { useEffect, useState } from 'react'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'
import { injected,network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import FullLoading from '../FullLoading'
import { useDispatch } from 'react-redux'
import { updateErrorInfo } from '../../state/wallet/actions'

export enum ConnectorNames {
  Injected = 'Injected',
}

export const connectorsByName: { [connectorName: string]: any } = {
  [ConnectorNames.Injected]: injected,
}

export function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export default function Web3ReactManager(props: any) {
  // handle logic to recognize the connector currently being activated
  const { active, account } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()

  const triedEager = useEagerConnect()

  const dispatch = useDispatch()

  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  useEffect(() => {
    if (account) {
      console.log('account', account)
      dispatch(updateErrorInfo({ hasError: false, errorInfo: '' }))
    }
  }, [account])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  /*  if (!active && networkError) {
    return <span>请选择正确的网络...</span>
  } */

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? <FullLoading /> : null
  }

  return props.children
}
