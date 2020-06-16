import { useState, useEffect } from 'react';
import { Input, Stack, InputLeftElement, Icon, InputGroup, Button, Flex, Alert, AlertIcon } from '@chakra-ui/core';
import { signup, isAuth } from '../../actions/auth';
import Router from 'next/router';

const Signupcomponent = () => {
  const [values, setValues] = useState({
    name: 'kamal',
    email: 'kamal@gmail.com',
    password: 'kkkkkk',
    error: '',
    isLoading: false,
    message: '',
  })

  useEffect(()=>{
    isAuth() && Router.push('/')
  }, [])

  const { name, email, password, error, isLoading, message } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.table({name, email, password, error, isLoading, message});
    setValues({ ...values, isLoading: true })
    const user = { name, email, password }
    signup(user)
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, isLoading: false })
        } else {
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            error: '',
            isLoading: false,
            message: data?.message
          });
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

  const signupForm = () => {
    return (
      <Flex align="center" justify="center" mt={4}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <InputGroup>
              <InputLeftElement children={<Icon name="info" />} />
              <Input
                value={name}
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
              />
            </InputGroup>
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
              Signup
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
      {signupForm()}
    </>
  )
}

export default Signupcomponent;
