import { useState, useEffect } from 'react';
import { FormControl, FormLabel, Input, Button, Tag, TagLabel, TagCloseButton, Box, Alert, AlertIcon } from '@chakra-ui/core';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { createTag, listTags, readTag, removeTag } from '../../actions/tag';
import { confirmDeleteAlert } from '../../helpers/confirmDeleteAlert';

const Category = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
    isLoading: false,
    reload: false,
  })

  const {name, error, success, tags, removed, isLoading, reload} = values;
  const token = getCookie('token');

  useEffect(() => {
    loadTags()
  }, [reload])

  const loadTags = () => {
    listTags()
      .then(data => {
        if(data.error) {
          setValues({...values, error: data.error, success: false})
        } else {
          setValues({...values, tags: data})
        }
      })
  }

  const handleDelete = (e, slug) => {
    e.preventDefault();
    const data = confirmDeleteAlert('Tag');
    if (data) {
      removeTag(slug, token)
      .then(data => {
        if(data.error) {
          setValues({...values, error: data.error, success: false})
        } else {
          setValues({...values, error: false, success: data.message, name: '', removed: !removed, reload: !reload})
        }
      })
    }    
  }

  const showTags = () => {
    return tags.map((tag, index) => {
      return (
        <Tag
          size="lg"
          key={index}
          rounded="full"
          variant="solid"
          variantColor="pink"
          m={1}
        >
          <TagLabel>{tag.name}</TagLabel>
          <TagCloseButton onClick={(e) => handleDelete(e, tag.slug)} />
        </Tag>
      )
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createTag({name}, token)
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

  const newTagForm = () => (
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
      {newTagForm()}
      {error && showError()}
      {success && showSuccess()}
      <Box maxWidth="fit-content" mt={2}>
        {showTags()}
      </Box>
    </React.Fragment>
  )

}

export default Category;
