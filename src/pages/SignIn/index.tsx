import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import { Container, Content, AnimationContainer, Background } from './styles'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImg from '../../assets/logo.svg'

interface SignInFormData {
	email: string
	password: string
}

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null)

	const { signIn } = useAuth()
	const { addToast } = useToast()
	const history = useHistory()

	const handleSubmit = useCallback(
		async (data: SignInFormData) => {
			try {
				formRef.current?.setErrors({})
				const schema = Yup.object().shape({
					email: Yup.string().email('Digite um e-mail válido.').required('E-mail obrigatório.'),
					password: Yup.string().required('Senha obrigatória.')
				})

				await schema.validate(data, {
					abortEarly: false
				})

				await signIn({
					email: data.email,
					password: data.password
				})

				history.push('/dashboard')
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					formRef.current?.setErrors(getValidationErrors(error))
					return
				}

				addToast({
					type: 'error',
					title: 'Authentication Error',
					description: 'An error occurred while logging in, check credentials'
				})
			}
		},
		[signIn, addToast, history]
	)

	return (
		<Container>
			<Content>
				<AnimationContainer>
					<img src={logoImg} alt="GoBarber" />
					<Form onSubmit={handleSubmit} ref={formRef}>
						<h1>Faça seu logon</h1>
						<Input icon={FiMail} name="email" placeholder="Email" />
						<Input icon={FiLock} name="password" type="password" placeholder="Senha" />
						<Button type="submit">Entrar</Button>
						<a href="forgot">Esqueci minha senha</a>
					</Form>

					<Link to="/signup">
						<FiLogIn />
						Criar conta
					</Link>
				</AnimationContainer>
			</Content>
			<Background />
		</Container>
	)
}

export default SignIn
