import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Modal from './components/Modal/Modal';
import './App.css'
import { useGlobalContext } from './context/App';

import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login'
import Account from './components/Account/Account';
import MyCourses from './components/Mycourses/MyCourses';
import MyCourseView from './components/Mycourses/MyCourseView/MyCourseView';
import ClassView from './components/Classes/ClassView/ClassView';
import CourseView from './components/Courses/CourseView.js/CourseView';
import Wishlist from './components/wishlist/WishList'
import Classes from './components/Classes/Classes';
import Courses from './components/Courses/Courses';
import PostView from './components/Classes/Contents/Posts/Post/PostView/PostView';
import Tasks from './components/Tasks/Tasks'
import Notifications from './components/Notifications/Notifications'

import axios from 'axios';
import MeetViewTeacher from './components/MeetView/MeetViewTeacher';
axios.defaults.withCredentials = true;




function App() {
  const { isModal } = useGlobalContext();
  return (
    <Router>
      <NavBar />
      {isModal && <Modal />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/signup/:choice" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/mycourses" element={<MyCourses />} />
        <Route exact path="/mycourses/view/:id" element={<MyCourseView />} />
        <Route exact path="/class/view/:id" element={<ClassView />} />
        <Route exact path="/course/view/:id" element={<CourseView />} />
        <Route exact path="/post/view/:id/:postId" element={<PostView />} />
        <Route exact path="/wishlist" element={<Wishlist />} />
        <Route exact path="/classes" element={<Classes />} />
        <Route exact path="/courses/:filter" element={<Courses />} />
        <Route exact path="/courses" element={<Courses />} />
        <Route exact path="/tasks" element={<Tasks />} />
        <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/meet/:classId" element={<MeetViewTeacher />} />
      </Routes>
    </Router>
  );
}

export default App;
