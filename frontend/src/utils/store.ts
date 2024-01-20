import { useReducer } from 'react'
import { createContainer } from 'react-tracked'

export const actions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_REDIRECT: 'SET_REDIRECT',
}

type State = {
  isLoggedIn: boolean
  user: any
  redirect_uri: string
  proxy_url: string
}
export const initialState: State = {
  isLoggedIn: false,
  user: null,
  redirect_uri: 'http://localhost:3000/login',
  proxy_url:
    'https://31ae-2001-b07-6464-31f4-3d27-af54-a695-3e5f.ngrok-free.app/logingithub',
}

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(() => useReducer(reducer, initialState))

type action = {
  type: string
  payload?: any
}

export const reducer = (state: State, action: action): State => {
  switch (action.type) {
    case 'LOGIN': {
      console.log('inside reducer')
      console.log(action.payload)
      localStorage.setItem(
        'isLoggedIn',
        JSON.stringify(action.payload.isLoggedIn)
      )
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      }
    }
    case 'LOGOUT': {
      localStorage.clear()
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    }
    case 'SET_REDIRECT': {
      return {
        ...state,
        redirect_uri: 'http://localhost:3000/login',
      }
    }
    default:
      return state
  }
}
