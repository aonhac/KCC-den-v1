import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Web3ReactManager, { getLibrary } from './components/Web3ReactManager'
import FullLoading from './components/FullLoading'
import AppLayout from './layouts/AppLayout'
import Home from './pages/home/'
import NotFound from './pages/error'

import BridgeTransfer from './pages/bridge/transfer'
import BridgeHistoryList from './pages/bridge/list'
import BridgeOrderDetail from './pages/bridge/detail'
import BridgeOrderConfirm from './pages/bridge/detail'

const Grants = lazy(() => import(/* webpackChunkName:'Grant' */ './pages/grants/index'))
const Activity = lazy(() => import(/* webpackChunkName:'Activity' */ './pages/activities/index'))
const Bridge = lazy(() => import(/* webpackChunkName:'Bridge' */ './pages/bridge/index'))

import { clearConfirmAndOutdateOrder } from './utils/task'

import './App.less'

function RouteWithSubRoutes(route: { path: string; component: any; routes: any }) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}

export default function App() {
  const routes = [
    {
      path: '/bridge',
      component: Bridge,
      routes: [
        {
          path: '/bridge/transfer',
          component: BridgeTransfer,
        },
        {
          path: '/bridge/list',
          component: BridgeHistoryList,
        },
        {
          path: '/bridge/detail',
          component: BridgeOrderDetail,
        },
        {
          path: '/bridge/confirm',
          component: BridgeOrderConfirm,
        },
      ],
    },
  ]

  let timer: any = null
  //  task for clear unconfirm & outdate order
  clearConfirmAndOutdateOrder()
  React.useEffect(() => {
    timer = window.setInterval(() => {
      clearConfirmAndOutdateOrder()
    }, 1000 * 10 * 60)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Suspense fallback={<FullLoading />}>
      <Web3ReactManager getLibrary={getLibrary}>
        <AppLayout>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/community/grants" exact={true} component={Grants} />
            <Route path="/community/activity" exact={true} component={Activity} />
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
            <Route path="*" component={NotFound} />
          </Switch>
        </AppLayout>
      </Web3ReactManager>
    </Suspense>
  )
}
