import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./components/login";
import {MemberHome} from "./components/memberhome";
import {AdminHome} from "./components/adminhome";
import {Navigation} from './components/navigations';
import {Logout} from './components/logout';
import AdminNav from "./components/AdminNav";

function App() {
  return (
    <BrowserRouter>
    <Navigation></Navigation>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/logout" element={<Logout/>}/>
    </Routes>
  </BrowserRouter>
  );
}
export default App;