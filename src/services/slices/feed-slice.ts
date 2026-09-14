import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);
export const getOrders = createAsyncThunk('feed/getOrders', getOrdersApi);
export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

type TFeedState = {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  orderData: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  orderData: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
      });
  }
});

export default feedSlice.reducer;
