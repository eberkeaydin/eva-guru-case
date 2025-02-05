import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://iapitest.eva.guru', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
