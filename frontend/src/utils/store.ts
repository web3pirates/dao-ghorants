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
    'https://df25-2001-b07-6464-31f4-f437-16c5-b88f-41e0.ngrok-free.app/logingithub', //@dev change this with your api ngroked
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
        redirect_uri: 'https://localhost:3000',
      }
    }
    default:
      return state
  }
}
