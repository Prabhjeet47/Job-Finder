import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './userContext';
import Home from './components/Home/home';
import JobListing from './components/JobListing/joblisting';
import Navbar from './components/navbar/navbar';
import LoginPage from './components/Login/login';
import UserProfile from './components/UserProfile/userprofile';
import CompanyDashboard from './components/Company/login/companyDashboard';
import CreateJobPost from './components/Company/createJob/createJob';
import './App.css';

const App = () => {	
  return (
	<BrowserRouter>
		<UserProvider>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/jobListingPage' element={<JobListing />} />
				<Route path='/loginPage' element={<LoginPage />} />
				<Route path='/userProfile' element={<UserProfile />} />
				<Route path='/companyDashboard' element={<CompanyDashboard />} />
				<Route path='/companyDashboard/createJobPost' element={<CreateJobPost />} />
			</Routes>
		</UserProvider>		
	</BrowserRouter>
  )
}

export default App;
