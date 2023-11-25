import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const token = Cookies.get('refresh-token');

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401) {
      if (
        error.config.url &&
        (error.config.url.includes('/auth/login') ||
          error.config.url.includes(
            `/users?redirect_url=${import.meta.env.VITE_FRONTEND_URL}/login`,
          ))
      ) {
        return Promise.reject(error); // Don't refresh token for login requests
      }
      const response = await axios.post(
        `/auth/refresh-tokens?refresh_token_data=${token}`,
        {},
        // { withCredentials: true },
      );

      if (response.status === 200) {
        const resBody = JSON.parse(response.data.body);

        Cookies.set('token', resBody.access_token, { secure: true });
        Cookies.set('refresh-token', resBody.refresh_token, { secure: true });

        window.location.reload();
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${resBody.access_token}`;

        return axios(error.config);
      }
    }
    // return error;
    return Promise.reject(error);
  },
);
