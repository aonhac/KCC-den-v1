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
        title: 'Developer Docs',
        subTitle: 'Start building on KuCoin Community Chain',
        route: KCC.DOCS_URL,
        icon: require('../assets/images/Icons/menu/docs@2x.png').default,
      },
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
        title: 'Testnet Faucet',
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
            subTitle: 'View information on the KCC public chain',
            route: KCC.EXPLORER,
            icon: require('../assets/images/Icons/menu/chrome@2x.png').default,
          },
        ],
      },
      {
        groupName: 'Dapp',
        groupMember: [
          /*  {
            title: 'KCC BRIDGE TITLE',
            subTitle: 'KCC BRIDGE DESC',
            route: '/bridge/transfer',
            icon: require('../assets/images/Icons/menu/bridge.svg').default,
          }, */
          {
            title: 'Submit a Dapp',
            subTitle: 'Submit your dapp to the community',
            route: KCC.DAPP_URL,
            icon: require('../assets/images/Icons/menu/submit@2x.png').default,
          },
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
        title: 'Activites',
        subTitle: 'View the exciting activites information, Includes hackathons,meetups,and more',
        route: '/community/activity',
        // route: '',
        // subTitle: 'Coming Soon...',
        icon: require('../assets/images/Icons/menu/activity@2x.png').default,
      },
      {
        title: 'Grant Program',
        subTitle: 'support for community development and research',
        route: '/community/grants',
        icon: require('../assets/images/Icons/menu/grant@2x.png').default,
      },
    ],
  },
]
