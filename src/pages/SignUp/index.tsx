import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import { Container, Content, AnimationContainer, Background } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImg from '../../assets/logo.svg'
import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/toast'

import api from '../../services/api'

interface SignUpFormData {
	name: string
	email: string
	password: string
}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null)

	const { addToast } = useToast()
	const history = useHistory()

	const handleSubmit = useCallback(
		async (data: SignUpFormData) => {
			try {
				formRef.current?.setErrors({})
				const schema = Yup.object().shape({
					name: Yup.string().required('Nome obrigatório.'),
					email: Yup.string().email('Digite um e-mail válido.').required('E-mail obrigatório.'),
					password: Yup.string().min(6, 'No mínimo 6 digitos.')
				})

				await schema.validate(data, {
					abortEarly: false
				})

				await api.post('users', data)

				addToast({
					type: 'success',
					title: 'User Registered',
					description: 'You can now login to GoBarber!'
				})

				history.push('/')
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					formRef.current?.setErrors(getValidationErrors(error))
					return
				}

				addToast({
					type: 'error',
					title: 'Registration Error',
					description: 'An error occurred while registering, please try again.'
				})
			}
		},
		[addToast, history]
	)

	return (
		<Container>
			<Background />
			<Content>
				<AnimationContainer>
					<img src={logoImg} alt="GoBarber" />
					<Form ref={formRef} onSubmit={handleSubmit}>
						<h1>Faça seu cadastro</h1>
						<Input icon={FiUser} name="name" placeholder="Nome" />
						<Input icon={FiMail} name="email" placeholder="Email" />
						<Input icon={FiLock} name="password" type="password" placeholder="Senha" />
						<Button type="submit">Cadastrar</Button>
					</Form>
					<Link to="/">
						<FiArrowLeft />
						Voltar para Logon
					</Link>
				</AnimationContainer>
			</Content>
		</Container>
	)
}

export default SignUp
