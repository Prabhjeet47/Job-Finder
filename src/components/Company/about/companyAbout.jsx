import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContext";
import { app } from '../../../firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import './companyAbout.css';
import tempimg from '../../images/TFJsA2.jpg';

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const CompanyAbout = ()=>{

    const { company } = useContext(UserContext);
    const navigate = useNavigate();

    const [c,setc] = useState();
    const [cname,setCname] = useState('');
    const [cfounder,setCfounder] = useState('');
    const [cempSize,setCempSize] = useState(0);
    const [caddress,setCaddress] = useState('');
    const [ccontact,setCcontact] = useState();
    const [cmail,setCmail] = useState('');

    const [pp,setPP] = useState();
    const [companyAvatar,setCompanyAvatar] = useState();
    const [isEditing,setIsEditing] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth,(company)=>{
            setc(company);
        })
    },[]);

    useEffect(()=>{
        if(company){
            const fetchData = async ()=>{
                const querySnapshot = await getDoc(doc(db,"companies",`${company.email}-${company.uid}`));
                if(querySnapshot.exists()){
                    // console.log(querySnapshot.data());
                    const companyData = querySnapshot.data();
                    setCname(companyData.companyName);
                    setCfounder(companyData.companyFounder);
                    setCempSize(companyData.companyEmployeeSize);
                    setCaddress(companyData.companyAddress);
                    setCcontact(companyData.companyContact);
                    setCmail(companyData.companyEmail);
                    
                    const cAvatar = companyData.companyAvatarURL.downloadURL;
                    if(cAvatar){
                        setCompanyAvatar(cAvatar);
                    }
                    else{
                        setCompanyAvatar(null)
                    }

                }
                else{
                    console.log('no company data found');
                }
            }
            fetchData();
        }
         
    },[company])

    const putData = async (e)=>{
        e.preventDefault();

        if(await company){
            try{
                const docRef = doc(db,"companies",`${company.email}-${company.uid}`);
                await setDoc(docRef,{
                    companyName: cname,
                    companyFounder: cfounder,
                    companyEmployeeSize: cempSize,
                    companyAddress: caddress,
                    companyContact: ccontact,
                    companyEmail: cmail,
                },{merge: true})
                .then(()=>{console.log('company doc created')})
                .catch((err)=>{console.log(err)})
                setIsEditing(false);
            }  
            catch(err){
                console.log(err);
            }
        }
    }

    const changePP = (e)=>{
        setPP(e.target.files[0]);
    }

    const uploadPP = async ()=>{

        if(company && pp){
            if(pp==null) return;
        
            const ppRef = ref(storage,`company/${company.cname}-${company.uid}/${pp.name}-${v4()}`);
            const ppUpload = uploadBytesResumable(ppRef,pp);
        
            ppUpload.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => console.log(error),
                async()=>{
                    try{
                        const downloadURL = await getDownloadURL(ppRef);
                        await setDoc(doc(db,"companies",`${company.email}-${company.uid}`),{
                            companyAvatarURL: {downloadURL},
                        },{merge: true})                     
                    }
                    catch(err){
                        console.log(err);
                    }
                }
            );  
        }        
    }

    const signoutandNavigate = ()=>{
        signOut(auth).then(()=>{navigate('/')})
    }

    return(
        <div className="companyDashboardContainer">

            <div className="companyAvatar">
                <div class="spinnerCompanyAvatar">
                    <div class="spinnerCompanyAvatar1">
                        {
                            companyAvatar?(
                                <img src={companyAvatar} className="companyPhoto"/>
                            ):(
                                <></>
                            )
                        }
                    </div>
                </div>
                <div className="cname">{cname}</div>
            </div>
            <div className="companyInfo">
                {
                    isEditing?(
                        <>
                            <form className='form ' onSubmit={putData}>
                                <div className="input-container">
                                    <input className='input' type="text" placeholder='enter company full name' onChange={(e) => setCname(e.target.value)} value={cname} />
                                    <span className="input-border"></span>
                                </div>
                                <div className="input-container">
                                    <input className='input' type="text" placeholder='enter company founder name' onChange={(e) => setCfounder(e.target.value)} value={cfounder} />
                                    <span className="input-border"></span>
                                </div>
                                <div className="input-container">
                                    <input className='input' type="number" placeholder='enter employee size' required onChange={(e) => setCempSize(e.target.value)} value={cempSize} />
                                    <span className="input-border"></span>
                                </div>
                                <div className="input-container">
                                    <input className='input' type="text" placeholder='enter company address' onChange={(e) => setCaddress(e.target.value)} value={caddress} />
                                    <span className="input-border"></span>
                                </div>
                                <div className="input-container">
                                    <input className='input' type="number" placeholder='enter company contact no' onChange={(e) => setCcontact(e.target.value)} value={ccontact} />
                                    <span className="input-border"></span>
                                </div>
                                <div className="input-container">
                                    <input className='input' type="email" required placeholder='enter company email id' onChange={(e) => setCmail(e.target.value)} value={cmail} />
                                    <span className="input-border"></span>
                                </div>
                                
                                <div id="ppContainer">
                                    <input type="file" className="submitPPInput" placeholder="Add/Edit Profile Picture" onChange={changePP}/>
                                    <button type="button" className="changePPBtn" onClick={uploadPP}>Change Profile Picture</button>
                                </div>

                                <button type="submit" className='submitCompanyBtn'>Submit</button>
                                <button type="button" className="cancelCompanyBtn" onClick={()=>{setIsEditing(false)}}>Cancel</button>
                            </form>
                        </>
                    ):(
                        <>

                            <div className="readOnlyFormContainer">
                                <div className="readOnlyForm">
                                        <p>Company Name: {cname}</p>
                                        <p>Company Founder Name: {cfounder}</p>
                                        <p>Employee Size: {cempSize}</p>
                                        <p>Address: {caddress}</p>
                                        <p>Contact No: {ccontact}</p>
                                        <p>Email ID: {cmail}</p>
                                        <button className="editbtn" onClick={()=>{setIsEditing(true)}}>Edit</button>
                                </div>
                                {/* <div className="companyDesc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis tempora fuga culpa eius quis porro minima repellat natus odio voluptates! Dolor magni quasi accusantium quas, incidunt ipsam voluptatem maxime et molestias esse saepe earum dolorum rem, assumenda similique quo repellendus reprehenderit non ex maiores nesciunt ab. Laboriosam velit veniam adipisci nihil aliquid aperiam suscipit distinctio inventore quibusdam in, culpa deserunt voluptates unde eos aut dolores sed quo. Aliquam vitae, natus minus magnam distinctio debitis possimus rem iste perferendis odit deserunt consequuntur facilis enim explicabo. Non laboriosam placeat magni dolorem fugit dolores, aut nisi consequatur, magnam blanditiis sit unde voluptatibus possimus!</div> */}
                            </div>
                            
                            <Link to='/companyDashboard/createJobPost'>
                                <button style={{border: 'none', padding: '0px', margin: '0px', background: 'none' }}>
                                    <div className="svg-wrapper">
                                        <svg height="60" width="190" xmlns="http://www.w3.org/2000/svg">
                                            <rect className="shape" height="60" width="190"></rect>
                                        </svg>
                                        <div className="text">Post a Job</div>
                                    </div>
                                </button>
                            </Link>

                            <button className='signOutBtnGlobal' onClick={signoutandNavigate}>Sign out</button>
                            <div className="jobList">
                                <h4 id="myposts">My Posts</h4>
                                <button>Frontend Engineer</button>
                                <button>Surgeon</button>
                                <button>Mobile Repair</button>
                            </div>

                        </>
                    )
                }
            </div>
        </div>
    );
}

export default CompanyAbout;