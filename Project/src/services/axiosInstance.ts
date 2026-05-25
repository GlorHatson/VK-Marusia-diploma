import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://cinemaguide.skillbox.cc/',
  withCredentials: true, // важно для сессионных cookie
});