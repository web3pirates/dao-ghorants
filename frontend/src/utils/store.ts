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
    'https://99d4-2a0e-41a-daec-0-c4e7-40b0-a19e-d079.ngrok-free.app/logingithub', //@dev change this with your api ngroked
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