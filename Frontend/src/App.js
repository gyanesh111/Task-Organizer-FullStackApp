import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from './redux/userReducer';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import NotificationModel from './components/NotificationModel';
import PasswordReset from './components/PasswordReset';

// Lazy imports
const Homepage = lazy(() => import('./pages/Homepage'));
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const Task = lazy(() => import('./components/Task'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UpdateTask = lazy(() => import('./components/UpdateTask'));
const Profile = lazy(() => import('./components/Profile'));
const TaskDetails = lazy(() => import('./components/TaskDetails'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));

function App() {
  const { user } = useSelector(selectUser);

  useEffect(() => {
    document.title = "Task Manager";
  }, []);

  return (
    <div className="App">
      <Navbar />
      <NotificationModel />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/task" element={user ? <Task /> : <Homepage />} />
          <Route path="/task/:id" element={<UpdateTask />} />
          <Route path='/profile' element={user ? <Profile /> : <Homepage />} />
          <Route path='/task-details/:id' element={user ? <TaskDetails /> : <Homepage />} />
          <Route path='/reset-password' element={<PasswordReset />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
