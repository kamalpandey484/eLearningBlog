import Link from 'next/link';
import { FormControl, FormLabel, Input, Button, Box, Heading, List, ListItem, Checkbox, Text, Alert, AlertIcon, useToast, Divider } from '@chakra-ui/core';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { listCategories } from '../../actions/category';
import { listTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';
import { QuillFormats, QuillModules } from '../../helpers/quill';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';

const CreateBlog = ({ router }) => {

  const blogFromLocalStorage = () => {
    if(typeof window === 'undefined') {
      return false;
    }

    if(localStorage.getItem('blog')) {
      return JSON.parse(localStorage.getItem('blog'));
    } else {
      return false;
    }
  }
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const [body, setBody] = useState(blogFromLocalStorage());
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hidePublishButton: false,
  })

  const { error, sizeError, success, formData, title, hidePublishButton } = values;
  
  const token = getCookie('token');

  useEffect(() => {
    setValues({...values, formData: new FormData()})
    initCategories();
    initTags();
  }, [router]);

  const initCategories = () => {
    listCategories()
      .then(data => {
        if(data.error) {
          setValues({ ...values, error: data.error })
        } else{
          setCategories(data);
        }
      })
  };

  const initTags = () => {
    listTags()
    .then(data => {
      if(data.error) {
        setValues({ ...values, error: data.error })
      } else{
        setTags(data);
      }
    })
  }

  const publishBlog = (e) => {
    e.preventDefault();
    createBlog(formData, token)
      .then(data=>{
        if(data.error){
          setValues({ ...values, error:data.error });
        } else {
          setValues({ ...values, title: '', success: data.message});
          setBody('');
          setCategories([]);
          setTags([]);
        }
      })
  }

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '', success: '' })
  }

  const handleBody = e => {
    setBody(e);
    formData.set('body', e);
    if(typeof window !== 'undefined'){
      localStorage.setItem('blog', JSON.stringify(e));
    }
    setValues({ ...values, error: '', success: '' })
  }
  
  const handleCategories = (id) => () => {
    setValues({ ...values, error: '' });
    const clickedCategory = checkedCategories.indexOf(id);
    const allCategories = [...checkedCategories];

    if(clickedCategory === -1) {
      allCategories.push(id)
    } else {
      allCategories.splice(clickedCategory, 1)
    }
    setCheckedCategories(allCategories);
    formData.set('categories', allCategories);
  }

  const handleTags = (id) => () => {
    setValues({ ...values, error: '' });
    const clickedTag = checkedTags.indexOf(id);
    const allTags = [...checkedTags];

    if(clickedTag === -1) {
      allTags.push(id)
    } else {
      allTags.splice(clickedTag, 1)
    }
    setCheckedTags(allTags);
    formData.set('tags', allTags);
  }

  const showCategories = () => {
    return(
      categories && categories.map(
        (category, index) => (
          <ListItem key={index} ml={2}>
            <Checkbox onChange={handleCategories(category._id)}>{category.name}</Checkbox>
          </ListItem>
        )
      )
    )
  }


  const showTags = () => {
    return(
      tags && tags.map(
        (tag, index) => (
          <ListItem key={index} ml={2}>
            <Checkbox onChange={handleTags(tag._id)}>{tag.name}</Checkbox>
          </ListItem>
        )
      )
    )
  }

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            name="title"
            placeholder="Title"
            value={title}
            onChange={handleChange('title')}
          />
        </FormControl>
        <FormControl mt={5} maxWidth="fit-content">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write your blog..."
            onChange={handleBody}
          />
        </FormControl>
        <Button
          mt={4}
          variantColor="blue"
          type="submit"
        >
          Publish
        </Button>
      </form>
    )
  }
  
  let hiddenInput = null;

  const showError = () => {
    return (
      toast({
        title: `${error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    );
  }
  
  const showSuccess = () => {
    return (
      toast({
        title: `${success}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    );
  }

  return (
    <React.Fragment>
      <Box p={5} display={{ md: "flex" }}>
          <Box flexShrink="0" minWidth="70%" border="1px" borderRadius="md" borderColor="gray.200" p={5}>
            {createBlogForm()}
            <Box>
              {error && showError()}
              {success && showSuccess()}
            </Box>
          </Box>
          <Box mt={{ base: 4, md: 0 }} minwidth="30%" border="1px" borderRadius="md" borderColor="gray.200" p={5}>
            <Heading as="h5" size="sm" m={5}>
              Featured Image
            </Heading>
            <Box ml={5}>
              <Text fontSize="xs">Max size 1mb*</Text>
              <Button variantColor="blue" variant="outline" onClick={() => hiddenInput.click()}>
                Upload Featured Image
              </Button>
              <input
                  hidden
                  type='file'
                  ref={el => hiddenInput = el}
                  onChange={handleChange('photo')}
                />
            </Box>
            <Divider />
            <Heading as="h5" size="sm" m={5}>
              Categories
            </Heading>
            <Box>
              <List style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {showCategories()}
              </List>
            </Box>
            <Divider />
            <Heading as="h5" size="sm" m={5}>
              Tags
            </Heading>
            <Box>
              <List style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {showTags()}
              </List>
            </Box>
          </Box>
        </Box>
    </React.Fragment>
  )
}

export default withRouter(CreateBlog);
