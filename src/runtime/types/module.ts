import type { AxiosHeaders } from 'axios'

export interface ModuleOptions {
  loginPage: string
  homePage: string
  baseUrl?: string
  login: {
    url: string
    method: 'POST' | 'GET'
    token: {
      field: string
      field_expires: string
    }
    headers?: AxiosHeaders
  }
  logout: {
    url: string
    method: 'POST' | 'GET' | 'DELETE'
    headers?: AxiosHeaders
  }
  refresh: {
    url: string
    method: 'POST' | 'GET' | 'PUT'
    token: {
      field: string
      field_expires: string
    }
    headers?: AxiosHeaders
  }
  me: {
    url: string
    method: 'POST' | 'GET'
    userField?: string
    headers?: AxiosHeaders
  }
}
