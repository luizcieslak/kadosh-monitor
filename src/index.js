import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import { ModalProvider } from 'styled-react-modal'

const apolloClient = new ApolloClient({
	uri: 'https://kadosh-hasura.herokuapp.com/v1/graphql',
})

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<ModalProvider>
			<App />
		</ModalProvider>
	</ApolloProvider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
