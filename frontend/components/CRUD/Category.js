import { useState, useEffect } from 'react';
import { FormControl, FormLabel, Input, Button, Tag, TagLabel, TagCloseButton, Box, Alert, AlertIcon } from '@chakra-ui/core';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { createCategory, listCategories, readCategory, removeCategory } from '../../actions/category';
import { confirmDeleteAlert } from '../../helpers/confirmDeleteAlert';

const Category = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    isLoading: false,
    reload: false,
  })

  const {name, error, success, categories, removed, isLoading, reload} = values;
  const token = getCookie('token');

  useEffect(() => {
    loadCategories()
  }, [reload])

  const loadCategories = () => {
    listCategories()
      .then(data => {
        if(data.error) {
          setValues({...values, error: data.error, success: false})
        } else {
          setValues({...values, categories: data})
        }
      })
  }

  const handleDelete = (e, slug) => {
    e.preventDefault();
    const data = confirmDeleteAlert('Category');
    if (data) {
      removeCategory(slug, token)
      .then(data => {
        if(data.error) {
          setValues({...values, error: data.error, success: false})
        } else {
          setValues({...values, error: false, success: data.message, name: '', removed: !removed, reload: !reload})
        }
      })
    }    
  }

  const showCategories = () => {
    return categories.map((category, index) => {
      return (
        <Tag
          size="lg"
          key={index}
          rounded="full"
          variant="solid"
          variantColor="pink"
          m={1}
        >
          <TagLabel>{category.name}</TagLabel>
          <TagCloseButton onClick={(e) => handleDelete(e, category.slug)} />
        </Tag>
      )
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createCategory({name}, token)
      .then(data => {
        if(data.error){
          setValues({...values, error: data.error, success: false})
        } else {
          setValues({...values, error: false, success: data.message, name: '', reload: true})
        }
      })
  }

  const handleChange = (e) => {
    setValues({...values, name: e.target.value, error: false, success: false, removed: '', reload: false})
  }

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          name="name"
          placeholder="name"
          value={name}
          onChange={handleChange}
        />
      </FormControl>
      <Button
        mt={4}
        variantColor="blue"
        type="submit"
      >
        Create
      </Button>
    </form>
  )

  const showError = () => {
    return (
      <Alert status="error" mt={2}>
        <AlertIcon />
        { error }
      </Alert>
    );
  }
  
  const showSuccess = () => {
    return (
      <Alert status="success" mt={2}>
        <AlertIcon />
        { success }
      </Alert>
    )
  }

  return (
    <React.Fragment>
      {newCategoryForm()}
      {error && showError()}
      {success && showSuccess()}
      <Box maxWidth="fit-content" mt={2}>
        {showCategories()}
      </Box>
    </React.Fragment>
  )

}

export default Category;
