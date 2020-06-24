import React from 'react'
import { useTransition } from 'react-spring'

import { Container } from './styles'
import Toast from './Toast'

import { ToastMessage, useToast } from '../../hooks/toast'

interface ToastContainerProps {
	messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
	const messagesWithTransitions = useTransition(messages, (message) => message.id, {
		from: { right: '-120%', transform: 'rotateZ(-340deg)' },
		enter: { right: '0%', transform: 'rotateZ(-360deg)' },
		leave: { right: '-120%', transform: 'rotateZ(-340deg)' }
	})

	return (
		<Container>
			{messagesWithTransitions.map(({ item, key, props }) => (
				<Toast key={key} message={item} style={props}></Toast>
			))}
		</Container>
	)
}

export default ToastContainer
