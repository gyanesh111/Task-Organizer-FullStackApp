import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userReducer';
import taskReducer from './redux/taskReducer';
import notificationReducer from './redux/notificationReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    notification: notificationReducer,
  }
});

export default store;