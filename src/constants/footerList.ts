import { KCC } from '.'

// footer nanList
export const FOOTER_LIST = [
  {
    title: 'About KCC',
    children: [
      {
        navText: 'Announcement',
        navRoute: 'https://t.me/greendogeinuANN',
      },
      {
        navText: 'Telegram',
        navRoute: 'https://t.me/greendogeinu',
      },
      /* {
        navText: 'Proof of Assets',
        navRoute: '',
      }, */
      {
        navText: 'Disclaimers',
        navRoute: KCC.DISCLAIMER,
      },
    ],
  },
  {
    title: 'Development Tool',
    children: [
      {
        navText: '',
        navRoute: KCC.DOCS_URL,
      },
      {
        navText: '',
        navRoute: KCC.GITHUB_URL,
      },
      {
        navText: 'Testnet Explorer',
        navRoute: KCC.TEST_EXPLORER,
      },
      {
        navText: 'Testnet faucet',
        navRoute: KCC.FAUCET,
      },
    ],
  },
]
