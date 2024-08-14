import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../userContext';
import { useNavigate } from 'react-router-dom';
import { app } from '../../../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './createJob.css';

const db = getFirestore(app);
const time = JSON.stringify(new Date());

const CreateJob = ()=>{

    const { company } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [jobTitle,setJobTitle] = useState();
    const [jobDesc,setJobDesc] = useState();
    const [jobField,setJobField] = useState();
    const [salary,setSalary] = useState(0);
    const [avl,setAvl] = useState();
    const [hours,setHours] = useState(0);
        
    const [companyName,setCompanyName] = useState();

    useEffect(()=>{
        if(company){
            const fetchData = async()=>{
                const querySnapshot = await getDoc(doc(db,"companies",`${company.email}-${company.uid}`));
                if(querySnapshot.exists()){
                    const data = querySnapshot.data();
                    setCompanyName(data.companyName);
                }
            }
            fetchData();
        }
    },[])

    const postJob = async (e)=>{
        e.preventDefault();

        if(await company){

            const docRef = doc(db,"jobs",`${company.email}-${jobTitle}-${time}`);
            await setDoc(docRef,{
                jobPostedByCompany: `${companyName}`,
                jobPostedByEmail: `${company.email}`,
                jobPostedAt: time,
                jobTitle: jobTitle,
                jobDescription: jobDesc,
                jobField: jobField,
                salary: salary,
                availability: avl,
                workingHours: hours,
            },)
            .then(()=>{
                navigate('/companyDashboard');
                alert('Job Posted');
            })
            .catch((err)=>{console.log(err)});

        }
    }
    
    return(
        <>
            <div className="formHeader">
                <p>Create Job Post</p>
            </div>
            <form className='createJobForm' onSubmit={postJob}>

                <div className="leftSide">
                    <p>Job Title</p>
                    <input type="text" onChange={(e)=>{setJobTitle(e.target.value)}} value={jobTitle} required/>
                    
                    <p>Job Description</p>
                    <textarea type="text" required id='jobDesc' onChange={(e)=>{setJobDesc(e.target.value)}} value={jobDesc}/>
                </div>

                <div className="rightSide">
                    <div className="select">
                        <div className="selected"
                            data-default="select"
                            data-one="Medical"
                            data-two="Software Developer"
                            data-three="Electronics Engineer"
                            data-four="HR Admin"
                            data-five="Media"
                            data-six="Other">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                        </div>
                        <div className="options">
                            <div title="all">
                                <input  id="all" name="option" type="radio" checked=""/>
                                <label className="option" for="all" data-txt="Select"></label>
                            </div>
                            <div title="option-1">
                                <input required id="option-1" name="option" type="radio" onChange={()=>{setJobField('Medical')}} />
                                <label className="option" for="option-1" data-txt="Medical"></label>
                            </div>
                            <div title="option-2">
                                <input id="option-2" name="option" type="radio" onChange={()=>{setJobField('Software Developer')}} />
                                <label className="option" for="option-2" data-txt="Software Developer"></label>
                            </div>
                            <div title="option-3">
                                <input id="option-3" name="option" type="radio" onChange={()=>{setJobField('Electronics Engineer')}} />
                                <label className="option" for="option-3" data-txt="Electronics Engineer"></label>
                            </div>
                            <div title="option-4">
                                <input id="option-4" name="option" type="radio" onChange={()=>{setJobField('HR Admin')}}/>
                                <label className="option" for="option-4" data-txt="HR Admin"></label>
                            </div>
                            <div title="option-5">
                                <input id="option-5" name="option" type="radio" onChange={()=>{setJobField('Media')}}/>
                                <label className="option" for="option-5" data-txt="Media"></label>
                            </div>
                            <div title="option-6">
                                <input id="option-6" name="option" type="radio" onChange={()=>{setJobField('Other')}}/>
                                <label className="option" for="option-6" data-txt="Other"></label>
                            </div>
                            
                        </div>
                    </div>

                    <p>Salary </p>
                    <input required type="number" onChange={(e)=>{setSalary(e.target.value)}} value={salary}/>

                    <p>Availability </p>
                    <div className="radio-inputs">
                            <label className="radio">
                                <input  type="radio" name='radio' onChange={()=>{setAvl('Work from Home')}}/>
                                <span className="name">Work from Home</span>
                            </label>
                            <label className="radio">
                                <input type="radio" name='radio' onChange={()=>{setAvl('In-office')}}/>
                                <span className="name">In-office</span>
                            </label>
                                
                            <label className="radio">
                                <input type="radio" name='radio' onChange={()=>{setAvl('Hybrid')}}/>
                                <span className="name">Hybrid</span>
                            </label>
                    </div>

                    <p >Working Hours </p>
                    <input style={{marginBottom: '17px'}} type="number" required onChange={(e)=>{setHours(e.target.value)}}/>
                </div>

                <div className="card-container">    
                    <div className="card">
                        <div className="content">
                            <button type='submit' className="submitJobBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path></svg>
                                <div className="submitJobBtnText">
                                    Post
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                
            </form>
        </>
    );
}

export default CreateJob;
