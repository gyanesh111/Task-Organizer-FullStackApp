import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import apiClient from '../api/api'

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post('/user/signup', userData);
      const data = await response.data;
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post('/user/signin', userData);
      const data = await response.data;
      console.log(data);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  'user/update',
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.put('/user/update', userData);
      const data = await response.data;
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('userDetails')) || null,
  token: localStorage.getItem('token') || null,
  loading: null,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    logoutUser: (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      console.log("logout succesfully");
    }
  },
  extraReducers: (builder) => {
    builder
      // register user thunk operations
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login user thunk operations
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.userDetails;
        state.token = action.payload.token;
        localStorage.setItem('token', state.token);
        localStorage.setItem('userDetails', JSON.stringify(state.user));
        state.loading = false;
        state.error = null;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('userDetails', JSON.stringify(state.user));
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const userActions = userSlice.actions;
export const selectUser = (state) => state.user;
const userReducer = userSlice.reducer;
export default userReducer;