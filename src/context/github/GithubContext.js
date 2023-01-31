import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const URL = process.env.REACT_APP_GITHUB_URL
const TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
	const initialState = {
		users: [],
		user: {},
		loading: false,
	}
	const [state, dispatch] = useReducer(githubReducer, initialState)

	const clearUsers = () => {
		dispatch({
			type: 'CLEAR_USERS',
		})
	}

	const searchUsers = async (text) => {
		setLoading()
		const params = new URLSearchParams({ q: text })
		const res = await fetch(`${URL}/search/users?${params}`, {
			headers: {
				Authorization: `token ${TOKEN}`,
			},
		})
		const { items } = await res.json()
		dispatch({ type: 'GET_USERS', payload: items })
	}

	const getUser = async (login) => {
		setLoading()
		const res = await fetch(`${URL}/users/${login}`, {
			headers: {
				Authorization: `token ${TOKEN}`,
			},
		})

		if (res.status === 404) {
			window.location = '/notfound'
		} else {
			const data = await res.json()
			dispatch({ type: 'GET_USER', payload: data })
		}
	}

	const setLoading = () => dispatch({ type: 'SET_LOADING' })
	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				loading: state.loading,
				user: state.user,
				searchUsers,
				clearUsers,
				getUser,
			}}
		>
			{children}
		</GithubContext.Provider>
	)
}

export default GithubContext
