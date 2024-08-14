import React, { useState, useEffect, useContext } from 'react';
import { app } from '../../../firebase';
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../userContext';
import CompanyAbout from '../about/companyAbout';
import './companyDashboard.css';

const auth = getAuth(app);
const db = getFirestore(app);

const CompanyDashboard = () => {
  
    const [loginCompanyEmail,setLoginCompanyEmail] = useState();
    const [loginCompanyPassword,setLoginCompanyPassword] = useState();
    const [createCompanyEmail,setCreateCompanyEmail] = useState();
    const [createCompanyPassword,setCreateCompanyPassword] = useState();

    const { company } = useContext(UserContext);

    const createCompany = async (e)=>{
        e.preventDefault();
        const userCred = await createUserWithEmailAndPassword(auth,createCompanyEmail,createCompanyPassword);
        const user = userCred.user;
        await setDoc(doc(db,"users",`company-${user.uid}`),{isCompany: true});
    }

    const loginCompany = (e)=>{
        e.preventDefault();
        signInWithEmailAndPassword(auth,loginCompanyEmail,loginCompanyPassword)
        .then(()=>{console.log('sign in successfull')})
        .catch((err)=>{console.log(err)});
    }

    

    return (
        <>
            {
                (company)?(
                    <>
                        <CompanyAbout />
                    </>
                ):(
                    <div id='formContainer'>
                        <form className="form_main">
                            <div className="compform">
                                <p className="heading">Login as company</p>

                                <div className="inputContainer">
                                    <input type="email" required className="inputField" id="username33" placeholder="Company mail ID" onChange={(e)=>{setLoginCompanyEmail(e.target.value)}} value={loginCompanyEmail} />
                                </div>

                                <div className="inputContainer">
                                    <input type="password" className="inputField" id="password12" placeholder="Password" onChange={(e)=>{setLoginCompanyPassword(e.target.value)}} value={loginCompanyPassword}/>
                                </div>

                                <button type='submit' className="button222" onClick={loginCompany}>Login</button>
                            </div>
                        </form>

                        <div className="spinner"><div></div><div></div><div></div><div></div><div></div><div></div></div>

                        <form className='form_main'>
                            <div className="compform">
                            <p className="heading">Register a company</p>

                                <div className="inputContainer">
                                    <input type="email" required className="inputField" id="username" placeholder="Company mail ID" onChange={(e)=>{setCreateCompanyEmail(e.target.value)}} value={createCompanyEmail}/>
                                </div>

                                <div className="inputContainer">
                                    <input type="password" className="inputField" id="password" placeholder="Password" onChange={(e)=>{setCreateCompanyPassword(e.target.value)}} value={createCompanyPassword} />
                                </div>

                                <button type='submit'  className="button222" onClick={createCompany}>Register</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    )
}

export default CompanyDashboard;