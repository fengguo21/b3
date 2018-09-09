import store from 'store'

const APP_ID = '59ddbf71f8b1042a557cd94b'

export const appId = APP_ID

export const get = ( key ) => {
  return store.get( APP_ID+'-'+key )
}

export const set = ( key, value ) => {
  store.set( APP_ID+'-'+key, value)
}

export const remove = ( key, value ) => {
  store.remove( APP_ID+'-'+key)
}

export const clear = () => {
  store.clearAll()
}