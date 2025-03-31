import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/api";

const INITIAL_STATE = {
  tasks: [],
  loading: null,
  error: null
}

export const addTask = createAsyncThunk(
  'task/addTask',
  async (task) => {
    try {
      const response = await apiClient.post("/api/task/add", task);
      const data = await response.data;
      return data;
    } catch (error) {
      console.log("Error from adding task :", error);
    }
  }
);

export const removeTask = createAsyncThunk(
  'task/removeTask',
  async (task) => {
    try {
      const response = await apiClient.delete("/api/task/delete", {
        data: task,
      });
      return await response.data;
    } catch (error) {
      console.log("Error from the removing task : ", error);
    }
  }
)

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (task) => {
    try {
      const response = await apiClient.put("/api/task/update", task);
      const data = await response.data;
      console.log(data);
      return data;
    } catch (err) {
      console.log("Error from the updating the task : ", err);
    }
  }
)

export const fetchAllTask = createAsyncThunk(
  'task/fetchTasks',
  async () => {
    try {
      const response = await apiClient.post('/api/tasks');
      return await response.data;
    } catch (err) {
      console.log("Error while fetching the tasks : ", err);
    }
  }
)

const taskSlice = createSlice(
  {
    name: 'tasks',
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder) => {
      builder.addCase(fetchAllTask.pending, (state, action) => {
        state.loading = true;
      })
        .addCase(fetchAllTask.fulfilled, (state, action) => {
          state.loading = false;
          state.tasks = action.payload;
        })
        .addCase(fetchAllTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(addTask.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(addTask.fulfilled, (state, action) => {
          state.loading = false;
          state.tasks.push(action.payload);
        })
        .addCase(addTask.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        // for removing the task
        .addCase(removeTask.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(removeTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter((task, index) => {
            return task.id !== action.payload.id;
          })
        })
        .addCase(removeTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // update the task
        .addCase(updateTask.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(updateTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          );
        })
        .addCase(updateTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    }
  }
)

export const selectTask = (state) => state.tasks;
const taskReducer = taskSlice.reducer;
export default taskReducer;