import axios from 'axios';
import { API } from '../config';

export const createBlog = (data, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  return (
    axios.post(`${API}/blog`, data, {headers: headers})
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const listAllBlogsWithCategoriesAndTags = (skip, limit) => {
  return (
    axios.get(`${API}/blogs-categories-tags?skip=${skip}&limit=${limit}`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const singleBlog = slug => {
  return (
    axios.get(`${API}/blog/${slug}`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const showRelatedBlogs = blog => {
  return (
    axios.post(`${API}/blogs-related`,  blog)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}
