import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { getAuth,signOut } from 'firebase/auth';
import { UserContext } from '../../userContext';
import './navbar.css';
import avatarPlaceholder from '../../homePageBgImg.jpg'; 
import mylogo from '../images/sahimeifinal.png';

const auth = getAuth(app);

const Navbar = () => {
    
    const { company, normalUser, loading } = useContext(UserContext);
    const navigate = useNavigate();
    
    if(loading){
        <p>loading...</p>
    }

    const signoutandNavigate = ()=>{
        signOut(auth);
        navigate('/');
    }

    return(
        <>
            <div className="navbarContainer">
                <Link to='/' className='navbarItem'><img id='mylogo' src={mylogo}/></Link>
                <Link to='/jobListingPage' className='navbarItem'><button className='navbarItem n1n1'>Find Jobs</button></Link>
                {normalUser && (
                    <Link to='/userProfile'>
                        <img src={auth.currentUser.photoURL || avatarPlaceholder} alt={normalUser.displayName} id='avatar' />
                    </Link>
                )}
                {!normalUser && !company && (
                    <Link to='/loginPage'>
                        <button className="loginItem navbarItem n1n1">Login</button>
                    </Link>
                )}
                <Link to='/companyDashboard'><button className='navbarItem n1n1'>Company Dashboard</button></Link>
                {/* <button className='signOutBtnGlobal' onClick={signoutandNavigate}>Sign out</button> */}
            </div>
        </>
    )
}

export default Navbar;
