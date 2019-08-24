import React from 'react'

import styled from 'styled-components'

const parsePaymentType = id => {
	switch (id) {
		case 0:
			return 'Dinheiro'
		case 1:
			return 'Cartao De Credito'
		case 2:
			return 'Cartao de Debito'
		case 3:
			return 'Vale Refeicao'
		default:
			throw new Error(`Error when parsing payment_type ${id}`)
	}
}

const parseFoodType = id => {
	switch (id) {
		case 0:
			return 'Comida'
		case 1:
			return 'Bebida'
		case 2:
			return 'Doce'
		default:
			throw new Error(`Error when parsing food type ${id}`)
			break
	}
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 200px;
	border: 1px solid #a29802;
	border-radius: 5px;
	padding: 10px 5px;
	margin: 10px 5px;

	&:active {
		opacity: 0.5;
	}
`

const Title = styled.p`
	font-size: 22px;
	font-weight: bold;
	line-height: 1.25;
	margin-bottom: 1rem;
`

const Text = styled.p`
	font-size: 18px;
	margin-block-end: 0.5;
	margin-block-start: 0;
`
const Money = styled(Text)`
  color: #2c590d;
  font-size: 20px;
`

const Grid = styled.div`
	display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  width: 100%;
	grid-gap: 5px;
`

const Time = styled.div`
  font-size: 14px;
  margin-block-end: 0;
  margin-block-start: 0%;
  font-style: italic;
`

export default function Card({ data, ...props }) {
	console.log(`card d`, data)
	return (
		<Wrapper {...props}>
        <Title>{`Pedido de ${data.client_name} - ${data.id}`}</Title>
      {data.products.map(product => (
				<Text>{`${product.quantity}x ${product.name}`}</Text>
			))}


			<Money>{`R$ ${data.total} - Pagamento em ${parsePaymentType(data.payment_type)}`}</Money>
      <Time>{`feito em: ${data.dateFormatted} - ${data.fromNow} atras`}</Time>
		</Wrapper>
	)
}
