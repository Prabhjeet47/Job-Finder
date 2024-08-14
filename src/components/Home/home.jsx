import React from 'react';
import { app } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import h1img from '../images/h1.png';
import h2img from '../images/h2.png';
import mylogo from '../images/mylogo.png';
import './home.css'

const auth = getAuth(app);

const Home = () => {
	return (
	<>
		<div className="home1">
			<button className='button'>
				<span className="actual-text" style={{fontSize: '70px'}}>&nbsp;Job&nbsp;Finder&nbsp;</span>
				<span aria-hidden="true" className="hover-text">&nbsp;Job&nbsp;Finder&nbsp;</span>
			</button>
			<p className='home1tagline' style={{position: 'relative', left: '237px'}}>Find your dream job now</p>
			<p className='home1tagline'>Search from the posted jobs and apply as per your requirement </p>		
			<img src={h1img} alt="h1img" id='h1img' />
		</div>
		<div className="home2">
			<img src={h2img} alt="h2img" id='h2img'/>
			<p className='home2tagline'>Find your right Job now</p>
			<Link to='/jobListingPage'>
				<button id='findJobsh2Btn'>Search jobs</button>
			</Link>
		</div>
		<div className="home3"></div>
	</>
	)
}

export default Home;
