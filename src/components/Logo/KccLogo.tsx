import React, { CSSProperties } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import './kcc-logo.less'

export enum PictureType {
  'svg',
  'png',
}

const Image = styled.img`
  cursor: pointer;
  position: relative;
  z-index: 2;
`
interface KccLogoProps {
  abbr?: boolean
  lang?: string
  sourceType?: PictureType
  styles?: CSSProperties
}

//  default choose english logo，svg type，full logo.
const KccLogo: React.FunctionComponent<KccLogoProps> = ({
  abbr = false,
  lang = 'en',
  sourceType = PictureType.svg,
  styles,
}) => {
  const router = useHistory()

  const navToHome = () => {
    router.push('/')
  }

  const generateLogoPath = (abbr: boolean, lang: string, sourceType: PictureType) => {
    let folder = ''
    if (abbr) {
      folder = 'AbbreviatedLettersLogo'
    } else if (lang === 'zh-CN' || lang === 'zh-TW') {
      folder = 'ChineseLogo'
    } else {
      folder = 'EnglishLogo'
    }
    return `/logo/${folder}/beagleinu.${PictureType[sourceType]}`
  }

  const logoSource = React.useMemo(() => {
    return generateLogoPath(abbr, lang, sourceType)
  }, [lang, abbr, sourceType])

  return <Image src={logoSource} style={styles} onClick={navToHome} />
}

export default React.memo(KccLogo)
