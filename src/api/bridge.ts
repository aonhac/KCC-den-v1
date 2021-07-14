import Axios, { HttpResponse } from './axios'

// bridge-list

export class BridgeService {
  /**
   * @description get pair list
   * @return {HttpResponse} result
   */
  static pairList(): Promise<any> {
    return Axios({
      method: 'get',
      url: '/pair/list',
    })
  }

  static inWhiteList(address: string): Promise<HttpResponse<any>> {
    return Axios({
      method: 'get',
      url: '/white/in',
      params: {
        addr: address,
      },
    })
  }

  static inBlackList(address: string): Promise<HttpResponse<any>> {
    return Axios({
      method: 'get',
      url: '/black/in',
      params: {
        addr: address,
      },
    })
  }

  static transitionList(
    address: string,
    start: number,
    page: number,
    limit = 50,
    hash = ''
  ): Promise<HttpResponse<any>> {
    return Axios({
      method: 'get',
      url: '/trans/list',
      params: {
        srcAccount: address,
        start,
        page,
        limit,
        srcTxHash: hash,
      },
    })
  }

  static getBridgeStatus(): Promise<HttpResponse<any>> {
    return Axios({
      method: 'get',
      url: '/fusing',
    })
  }
}
