import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Container, Content, Background } from './styles'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'
import * as Yup from 'yup'
import { useAuth } from '../../hooks/AuthContext'
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

				signIn({
					email: data.email,
					password: data.password
				})
			} catch (error) {
				formRef.current?.setErrors(getValidationErrors(error))
			}
		},
		[signIn]
	)

	return (
		<Container>
			<Content>
				<img src={logoImg} alt="GoBarber" />
				<Form onSubmit={handleSubmit} ref={formRef}>
					<h1>Faça seu logon</h1>
					<Input icon={FiMail} name="email" placeholder="Email" />
					<Input icon={FiLock} name="password" type="password" placeholder="Senha" />
					<Button type="submit">Entrar</Button>
					<a href="forgot">Esqueci minha senha</a>
				</Form>

				<a href="logon">
					<FiLogIn />
					Criar conta
				</a>
			</Content>
			<Background />
		</Container>
	)
}

export default SignIn
