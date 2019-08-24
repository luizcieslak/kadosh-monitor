import React from 'react'
import './App.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import styled from 'styled-components'

import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Card from './Card'

import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/esm/locale'

import Modal from 'styled-react-modal'

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 10px 20px;
`

const Button = styled.button`
	font-size: 30px;
	background-color: #a29802;
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	margin: 4px 2px;
	cursor: pointer;
`

const Wrapper = styled.div``

const Text = styled.p`
	font-size: 24px;
`

function App() {
	const [isOpen, setIsOpen] = React.useState(false)
	const [idToDeliver, setIdToDeliver] = React.useState()

	const toggleModal = () => setIsOpen(!isOpen)

	const { loading, error, data } = useQuery(gql`
		query getOrders {
			order(where: { delivered: { _eq: false } }) {
				client_name
				created_at
				id
				payment_type
				total
				relationship {
					product_relationship {
						id
						name
						price
					}
					quantity
				}
			}
		}
	`)

	const [setDelivered, mutationData] = useMutation(gql`
		mutation setDelivered($id: Int!) {
			update_order(where: { id: { _eq: $id } }, _set: { delivered: true }) {
				returning {
					id
				}
			}
		}
	`)

	const handleDeliverOrder = () => {
		setDelivered({
			variables: {
				id: idToDeliver,
			},
			refetchQueries: [`getOrders`],
    })
    
    setIsOpen(false)
	}

	const [orders, setOrders] = React.useState([])

	React.useEffect(() => {
		if (data.order) {
			const ordersWithTimeAndProducts = data.order
				.map(order => ({
					...order,
					date: new Date(order.created_at),
				}))
				.map(order => ({
					...order,
					dateFormatted: format(order.date, 'HH:mm', { locale: ptBR }),
					fromNow: formatDistanceToNow(order.date, { includeSeconds: true, locale: ptBR }),
				}))
				.map(order => {
					const relationship = order.relationship
					return {
						...order,
						products: relationship.map(relation => ({ ...relation.product_relationship, quantity: relation.quantity })).filter(product => product),
					}
				})

			setOrders(ordersWithTimeAndProducts)
		}
  }, [data])
  
  if (error) {
    console.warn("error when fetching product list", error)
  }
  if (mutationData.error) {
    console.warn("error when adding order", mutationData.error)
  }

	return (
		<Wrapper>
			{(loading || mutationData.loading) && <Text>Carregando..</Text>}
			{(error || mutationData.error) && <Text>Error :(</Text>}

			{orders.map(order => (
				<Card data={order} onClick={() => setIdToDeliver(order.id) || toggleModal(order.id)} />
      ))}
      
      {orders.length === 0 && <Text>Nenhum pedido em aberto.</Text>}

			<StyledModal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
				<Text>Confirmar entrega do pedido {idToDeliver}?</Text>
				<Button onClick={handleDeliverOrder}>Confirmar entrega</Button>
			</StyledModal>
		</Wrapper>
	)
}

export default App
