import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchWrapper = async (url) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('response', data);

    return data;
  } catch (error) {
    console.error(error.errorMessage || error.message);
    throw error;
  }
};

export const fetchWrapperAxios = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data.errorMessage);
  }
};
