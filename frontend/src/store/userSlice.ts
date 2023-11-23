import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.VITE_BASE_URL;

interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface LoginUser {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: User) => {
    const request = await axios.post(`${baseUrl}/api/users/register`, user);
    const response = await request.data.data;

    if (response.ok) {
      const { accessToken } = await response.json();

      // Set the access token as an HTTP-only cookie
      Cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
      });
    }
  },
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user: LoginUser) => {
    const request = await axios.post(`${baseUrl}/api/users/login`, user);
    const response = await request.data.data;

    if (response.ok) {
      const { accessToken } = await response.json();

      // Set the access token as an HTTP-only cookie
      Cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
      });
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    user: null as User | null,
    error: null as string | null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.user = null;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload as unknown as User;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.error.message as string;
    });
  },
});

export const { setLoading, setUser, setError } = userSlice.actions;
export default userSlice.reducer;
