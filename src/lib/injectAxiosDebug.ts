import { Axios } from 'axios'

let count = 0

function getRequestResult(response: any) {
  const method = response.config.method.toUpperCase()
  const url = (response.config.baseURL || '') + response.config.url
  const { headers, status, data } = response
  const { params, data: body } = response.config
  const result = { count, method, url, status, data, headers, params, body }
  count++
  return result
}

export function injectAxiosDebug(axios: Axios): void {
  axios.interceptors.response.use(
    (response) => {
      console.log(getRequestResult(response))
      return response
    },
    (error) => {
      if (error?.response?.config) {
        console.error(getRequestResult(error.response))
      }
      throw error
    },
  )
}
