import axios from 'axios';
import { API } from '../config';

export const createCategory = (category, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  return (
    axios.post(`${API}/category`, category, {headers: headers})
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const listCategories = () => {
  return (
    axios.get(`${API}/categories`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const readCategory = (slug) => {
  return (
    axios.get(`${API}/category/${slug}`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const removeCategory = (slug, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  return (
    axios.delete(`${API}/category/${slug}`, {headers: headers})
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}
