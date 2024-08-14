import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { app } from "../../firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	getAuth,
	onAuthStateChanged
} from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {

	const [user,setUser] = useState();
	const [crUser,setCrUser] = useState();
	const [password,setPassword] = useState();
	const [crPassword,setCrPassword] = useState();
	const [userFlag,setUserFlag] = useState(false);
	const navigate = useNavigate();

	const signInWithGoogle = async ()=>{
		await signInWithPopup(auth,provider).then(()=>{console.log('login successful')}).catch((err)=>{console.log(err)});
	}

	const signInWithMailID = async ()=>{
		await signInWithEmailAndPassword(auth,user,password).then(()=>{}).catch((err)=>{console.log(err)});
	}

	const createUserWithMailID = async ()=>{
		await createUserWithEmailAndPassword(auth,crUser,crPassword).then(()=>{alert('User created successfully')}).catch((err)=>{console.log(err)});
	}
	
	useEffect(()=>{
		onAuthStateChanged(auth, (user)=>{
			if(user){
				setUserFlag(true);
				// console.log(userFlag);
				// console.log(user);
				navigate('/');
			}
			else{
				console.log('no user signed in');
			}
		})
	},[userFlag]);


	return (
		<>
			<div className="loginPageContainer">

				<div className="title">Welcome Back</div>
				<div className="signInWithGoogle">
					<p>Sign in with Google</p>
					<button id="googleBtn" className="mybtn" onClick={signInWithGoogle}>Sign in</button>
				</div>

				<div className="signInWithMailID">
					<p>Sign in with Email ID</p>
					<input type="email" value={user} onChange={(e)=>{setUser(e.target.value)}} placeholder="enter mail ID" className="itag" required/>
					<input type="password" placeholder="enter password" value={password} className="itag" onChange={(e)=>{setPassword(e.target.value)}} />
					<button id="MailIDBtn" className="mybtn" onClick={signInWithMailID}>Sign in</button>
				</div>

				<div className="createUser">
					<p>Don't have an account Sign Up </p>
					<input type="email" value={crUser} placeholder="enter mail ID" className="itag" onChange={(e)=>{setCrUser(e.target.value)}} required/>
					<input type="password" value={crPassword} placeholder="enter password" className="itag" onChange={(e)=>{setCrPassword(e.target.value)}} />
					<button id="createUserBtn" className="mybtn" onClick={createUserWithMailID}>Sign up</button>
				</div>
				
			</div>
		</>
	);
};

export default Login;
