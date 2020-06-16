import { useState, useEffect } from 'react';
import { Input, Stack, InputLeftElement, Icon, InputGroup, Button, Flex, Alert, AlertIcon } from '@chakra-ui/core';
import { signin, authenticate, isAuth } from '../../actions/auth';
import Router from 'next/router';

const Signincomponent = () => {
  const [values, setValues] = useState({
    email: 'kamal@gmail.com',
    password: 'kkkkkk',
    error: '',
    isLoading: false,
    message: '',
  })

  useEffect(()=>{
      isAuth() && Router.push('/admin');
  }, [])

  const { email, password, error, isLoading, message } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, isLoading: true, error: false })
    const user = { email, password }
    signin(user)
      .then(data => {
        if (data?.token) {
          authenticate(data, () => {
            if(isAuth() && isAuth().role === 1) {
              Router.push('/admin');
            }
          })
        } else {
          setValues({ ...values, error: data.error, isLoading: false })
        }
      })
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value, error: '' });
  }

  const showError = () => {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  const showSuccess = () => {
    return (
      <Alert status="success">
        <AlertIcon />
        {message}
      </Alert>
    )
  }

  const signinForm = () => {
    return (
      <Flex align="center" justify="center" mt={4}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <InputGroup>
              <InputLeftElement children={<Icon name="email" />} />
              <Input
                value={email}
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement children={<Icon name="password" />} />
              <Input
                value={password}
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </InputGroup>
            <Button
              isLoading={isLoading}
              loadingText="Loading"
              variantColor="teal"
              variant="outline"
              type="submit"
            >
              Signin
            </Button>
          </Stack>
        </form>
      </Flex>
    )
  }

  return (
    <>
      {error && showError()}
      {message && showSuccess()}
      {signinForm()}
    </>
  )
}

export default Signincomponent;
