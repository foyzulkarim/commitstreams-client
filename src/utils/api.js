import axios from 'axios';

axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchWrapperAxios(url, options = {}) {
  try {
    const fullUrl = `${apiUrl}${url}`;
    const response = await axios({
      method: options.method || 'GET', // Default to GET
      url: fullUrl,
      data: options.data, // Include optional payload
      headers: options.headers, // Include optional headers
    });

    return response.data;
  } catch (error) {
    // More refined error handling (consider error structure)
    //  if the response is 401, redirect to login page
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.errorMessage || 'Request failed');
  }
}
