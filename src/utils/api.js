import axios from 'axios';

axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

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

export async function fetchWrapperAxios(url, options = {}) {
  try {
    const fullUrl = `${apiUrl}${url}`;
    console.log('fullUrl', fullUrl);
    const response = await axios({
      method: options.method || 'GET', // Default to GET
      url: fullUrl,
      data: options.data, // Include optional payload
      headers: options.headers, // Include optional headers
    });

    return response.data;
  } catch (error) {
    console.error(error);
    // More refined error handling (consider error structure)
    throw new Error(error.response?.data?.errorMessage || 'Request failed');
  }
}
