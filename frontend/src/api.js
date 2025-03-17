/**
 * I am going to write an intercepter for axios to add the token to the header of the request
 * Anytime I send a request it will check if the token is in the local storage and if it is it will add it to the header
 */

import { ACCESS_TOKEN } from './constants';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //This will load the api url from the .env file

});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  //Create an authorization header with the token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//api for getting the total funds
api.getFunds = () => api.get('/api/funds/');

//api for getting volunteer profiles
api.getVolunteerProfiles = () => api.get('/api/volunteer-profiles/');

export default api;