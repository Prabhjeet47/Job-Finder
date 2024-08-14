import React, { useEffect, useState } from 'react';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import './userprofile.css';

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


const UserProfile = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [userCvLink,setUserCvLink] = useState(null);

    const [user, setUser] = useState(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const userDisplayName = user.displayName;
                    const userUid = user.uid;
                    const collectionRef = collection(db, "users",`${userDisplayName}-${userUid}`,"personal");
                    const querySnapshot = await getDocs(collectionRef);

					if(!querySnapshot.empty){
						const docRef = querySnapshot.docs[0].ref;
						const docData = await getDoc(docRef);

						if (docData.exists()) {
							const userData = docData.data();
							console.log("Fetched User Data: ", userData); // Debugging log
							setName(userData.fullname);
							setContact(userData.phoneno);
							setEmail(userData.emailId);
							setDob(userData.dob);
							setGender(userData.gender);
							setOriginalData(userData);
						} else {
							console.log("No such document!");
						}
					} else{
						console.log('No user of this name')
					}                   
                } 
				catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            };
            fetchUserData();

            const fetchUserCvURL = async () => {
                const docRef = doc(db,"users",`${user.displayName}-${user.uid}`);
                const docSnapshot = await getDoc(docRef);
                if(docSnapshot.exists()){
                    const docData = docSnapshot.data();
                    setUserCvLink(docData.userCvDownloadURL);
                }
            }
            fetchUserCvURL();
        }
    }, [user]);

    const selectCv = (e) => {
        setFile(e.target.files[0]);
    };

    const cvUploaderFunction = () => {
        if (file == null) return;

        const cvRef = ref(storage, `users/cv/${file.name}-${uuidv4()}`);
        const cvUpload = uploadBytesResumable(cvRef, file);

        cvUpload.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => console.log(error),
            async () => {
                try{
                    const downloadURL = await getDownloadURL(cvRef);
                    
                    await setDoc(doc(db,"users",`${user.displayName}-${user.uid}`),{
                        userCvDownloadURL: downloadURL,
                    },{merge: true})
                        .then(()=>{console.log('user cv updated')});
                }
                catch(err){
                    console.log(err);
                }
            }
        );
    };

    if(userCvLink){
        console.log(userCvLink);
    }

    const putData = async (e) => {
        e.preventDefault();

        if (user) {
            try {
                const docRef = doc(db, "users", `${user.displayName}-${user.uid}`,"personal",`${user.uid}`);
                await setDoc(docRef, {
                    fullname: name,
                    phoneno: contact,
                    emailId: email,
                    dob: dob,
                    gender: gender,
                },{merge: true});

                setOriginalData({ fullname: name, phoneno: contact, emailId: email, dob: dob, gender: gender });
                setIsEditing(false);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleCancel = () => {
        setName(originalData.fullname);
        setContact(originalData.phoneno);
        setEmail(originalData.emailId);
        setDob(originalData.dob);
        setGender(originalData.gender);
        setIsEditing(false);
    };

    const signoutandNavigate = ()=>{
        signOut(auth).then(()=>{navigate('/')})
    }

    return (
        <div className="userProfileContainer">
            <div className="avatarPart">
                <img src={user?.photoURL} alt="user photo" id='avatarUserProfile' style={{position: 'relative', bottom: '8px'}} />
                {(userCvLink!=null) ? (
                    <a href={userCvLink}>Download CV</a>
                ) : (
                    <>
                        <input type="file" placeholder='Select file' onChange={selectCv} />
                        <button className='changePPBtn' style={{height: '25px', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px'}} onClick={cvUploaderFunction}>Upload CV</button>
                    </>
                )}
            </div>
            <div className="infoPart">
                <p className='cname'>Hello {user?.displayName || "user"},</p>
                <p className='cname' id='addorupdatedetails'>Add or update your details</p>
                {isEditing ? (
                    <form className='form' onSubmit={putData}>
                        <div className="input-container">
                            <input className='input' type="text" placeholder='enter full name' onChange={(e) => setName(e.target.value)} value={name} />
                            <span className="input-border"></span>
                        </div>
                        <div className="input-container">
                            <input className='input' type="number" placeholder='enter contact number' onChange={(e) => setContact(e.target.value)} value={contact} />
                            <span className="input-border"></span>
                        </div>
                        <div className="input-container">
                            <input className='input' type="email" placeholder='enter email id' required onChange={(e) => setEmail(e.target.value)} value={email} />
                            <span className="input-border"></span>
                        </div>
                        <div className="input-container">
                            <input className='input' type="date" placeholder='enter D.O.B' onChange={(e) => setDob(e.target.value)} value={dob} />
                            <span className="input-border"></span>
                        </div>
                        <div className="input-container">
                            <input className='input' type="text" placeholder='enter gender' onChange={(e) => setGender(e.target.value)} value={gender} />
                            <span className="input-border"></span>
                        </div>
                        <button type="submit" className='submitCompanyBtn' style={{position: 'relative', top: '20px'}}>Submit</button>
                        <button type="button" className='cancelCompanyBtn' style={{position: 'relative', top: '23px'}} onClick={handleCancel}>Cancel</button>
                    </form>
                ) : (
                    <div className="readOnlyForm">
                        <p>Full Name: {name}</p>
                        <p>Contact: {contact}</p>
                        <p>Email: {email}</p>
                        <p>D.O.B: {dob}</p>
                        <p>Gender: {gender}</p>
                        <button  className='editbtn' style={{marginTop: '10px'}} onClick={() => setIsEditing(true)}>Edit</button>
                        <button className='signOutBtnGlobalUser' onClick={signoutandNavigate}>Sign out</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
