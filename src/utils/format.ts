import invariant from 'tiny-invariant'
import BN from 'bignumber.js'
export const shortAddress = (address: string): string => {
  invariant(address.length > 12, 'given address is valid?')
  const pre = address.substr(0, 6)
  const last = address.substr(-4)
  return `${pre}...${last}`
}

export function formatCurrency(amount: string, symbol?: string) {
  let fmt: any = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
  }
  if (symbol) fmt.suffix = symbol.toUpperCase()
  return new BN(amount).toFormat(fmt)
}
