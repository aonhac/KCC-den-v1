import { KCC } from './index'

export interface NavItemType {
  name: string
  hasChildren?: boolean
  hasGroup?: boolean
  route?: string
  childrens?: NavItemChildrenType[] | NavItemGroupType[]
}

export interface NavItemChildrenType {
  title: string
  subTitle: string
  route: string
  icon: string
  setOpenKeys?: any
}

export interface NavItemGroupType {
  groupName: string
  groupMember: NavItemChildrenType[]
}

export const MENU_LIST = [
  {
    name: 'Home',
    route: '/',
    hasChildren: false,
  },
  {
    name: 'Developers',
    hasChildren: true,
    childrens: [

      {
        title: 'Github',
        subTitle: 'Visit our Github community',
        route: KCC.GITHUB_URL,
        icon: require('../assets/images/Icons/menu/github@2x.png').default,
      },
      {
        title: 'Testnet Explorer',
        subTitle: 'View information on the KCC public chain（testnet）',
        route: KCC.TEST_EXPLORER,
        icon: require('../assets/images/Icons/menu/chrome@2x.png').default,
      },
      {
        title: 'Testnet faucet',
        subTitle: 'Get KCC testnet tokens',
        route: KCC.FAUCET,
        icon: require('../assets/images/Icons/menu/faucet@2x.png').default,
      },
    ],
  },
  {
    name: 'Ecosystem',
    hasChildren: true,
    hasGroup: true,
    childrens: [
      {
        groupName: 'Explorer',
        groupMember: [
          {
            title: 'Explorer',
            subTitle: 'View information on the Binance Smart Chain',
            route: KCC.EXPLORER,
            icon: require('../assets/images/Icons/menu/chrome@2x.png').default,
          },
        ],
      },
      {
        groupName: 'Dapp',
        groupMember: [

          {
            title: 'Defi Box',
            subTitle: 'Coming Soon...',
            route: '',
            icon: require('../assets/images/Icons/menu/chrome@2x.png').default,
          },
        ],
      },
      {
        groupName: 'Wallet',
        groupMember: [
          {
            title: 'Metamask',
            subTitle: 'Visit and link to metamask',
            route: 'https://metamask.io',
            icon: require('../assets/images/Icons/menu/metamask@2x.png').default,
          },
          {
            title: 'ImToken',
            subTitle: 'Visit and link to ImToken',
            route: 'https://token.im/',
            icon: require('../assets/images/Icons/menu/imtoken@2x.png').default,
          },
          {
            title: 'Shield Protocol',
            subTitle: 'Visit and link to Shield Protocol',
            route: 'https://shieldprotocol.org',
            icon: require('../assets/images/Icons/menu/shield.png').default,
          },
          {
            title: 'More Wallet',
            subTitle: 'Coming Soon...',
            route: '',
            icon: require('../assets/images/Icons/menu/wallet@2x.png').default,
          },
        ],
      },
    ],
  },
  {
    name: 'Community',
    hasChildren: true,
    childrens: [

      {
        title: '',
        subTitle: 'support for community development and research',
        route: '/community/grants',
        icon: require('../assets/images/Icons/menu/grant@2x.png').default,
      },
    ],
  },
]
