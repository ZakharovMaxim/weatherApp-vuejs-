const baseURL = 'http://localhost:3000/'
export default (url) => {
  return fetch(baseURL + url).then(response => {
    if (response.status === 200) return response.json()
    else throw new Error(response.statusText)
  })
}
