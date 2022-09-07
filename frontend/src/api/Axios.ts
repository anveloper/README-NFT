import baseAxios from 'axios';

export const baseURL = process.env.REACT_APP_API_BASE_URL;

const Axios = baseAxios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Axios;