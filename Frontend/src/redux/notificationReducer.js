import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, userActions } from "./userReducer";
import { addTask, removeTask, updateTask } from "./taskReducer";

const INITIAL_STATE = {
  message: "",
  status: "idle", // Can be "idle", "loading", "success", "error"
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: INITIAL_STATE,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.status = action.payload.status || "success";
    },
    clearNotification: (state) => {
      state.message = "";
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.message = "Registering your details...";
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.message = "Registration Successful";
        state.status = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Registration Failed";
        state.status = "error";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.message = "Verifying your details...";
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.message = "Verification Successful";
        state.status = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Login Failed";
        state.status = "error";
      })

      // Logout
      .addCase(userActions.logoutUser, (state) => {
        state.message = "Logout Successful";
        state.status = "success";
      })
      // Add Task
      .addCase(addTask.pending, (state) => {
        state.message = "Adding task...";
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state) => {
        state.message = "Task added successfully";
        state.status = "success";
      })
      .addCase(addTask.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Failed to add task";
        state.status = "error";
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.message = "Updating task...";
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.message = "Task updated successfully";
        state.status = "success";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Failed to update task";
        state.status = "error";
      })

      // Remove Task
      .addCase(removeTask.pending, (state) => {
        state.message = "Removing task...";
        state.status = "loading";
      })
      .addCase(removeTask.fulfilled, (state) => {
        state.message = "Task removed successfully";
        state.status = "success";
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Failed to remove task";
        state.status = "error";
      });
  },
});

export const notificationActions = notificationSlice.actions;
export const useNotification = (state) => state.notification;
export default notificationSlice.reducer;
