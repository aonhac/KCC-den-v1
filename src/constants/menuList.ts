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

    name: 'Pinksale',
    hasChildren: true,
    childrens: [

      {
        title: 'Beagle Sale',
        subTitle: 'support for community development and research',
        route: 'https://www.pinksale.finance/launchpad/0xb03B593C89AA23150E565F8f06e637b69CD75504?chain=BSC',
        icon: require('../assets/images/Icons/menu/grant@2x.png').default,
      },
    ],
  },
]
