import axios from 'axios';
import { API } from '../config';

export const createTag = (tag, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  return (
    axios.post(`${API}/tag`, tag, {headers: headers})
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const listTags = () => {
  return (
    axios.get(`${API}/tags`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const readTag = (slug) => {
  return (
    axios.get(`${API}/tag/${slug}`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const removeTag = (slug, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  return (
    axios.delete(`${API}/tag/${slug}`, {headers: headers})
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}
