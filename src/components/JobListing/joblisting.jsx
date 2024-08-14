import React, { useContext, useEffect, useState } from "react";
import { app } from '../../firebase';
import { getFirestore, getDocs, collection, getDoc, doc, arrayUnion, updateDoc, addDoc, setDoc} from "firebase/firestore";
import { UserContext } from "../../userContext";
import softwaredeveloperImg from '../images/softwaredeveloper-vectorart.jpg';
import medicalImg from '../images/medical-vector-art.png';
import eeImg from '../images/electronic-engineer-vector.jpg';
import hr from '../images/HR-vector-art.png';
import media from '../images/media-vector-art.png';
import miscell from '../images/others-vector-art.png';
import './joblisting.css';
import { AlertDescription } from "@chakra-ui/react";

const db = getFirestore(app);
const jobImagesObj = {
    'Medical': medicalImg,
    'Software Developer': softwaredeveloperImg,    
    'Electronics Engineer': eeImg,
    'HR Admin': hr,
    'Media': media,
    'Other': miscell,
}

const JobListing = () => {

    const { normalUser } = useContext(UserContext);

    const [jobs, setJobs] = useState([]);
    const [jobCardState, setJobCardState] = useState(null);
    const [userCvLink, setUserCvLink] = useState();


    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "jobs"));
            const jobData = querySnapshot.docs.map((doc) => (
                {
                    id: doc.id,
                    ...doc.data()
                }
            ));
            setJobs(jobData);
        }
        fetchData();

        const getUserCvForJob = async () => {
            if(normalUser){
                const docRef = doc(db,"users",`${normalUser.displayName}-${normalUser.uid}`);
                const docSnapshot = await getDoc(docRef);
                if(docSnapshot.exists()){
                    const docData = docSnapshot.data();
                    setUserCvLink(docData.userCvDownloadURL);
                }
            }
        }
        getUserCvForJob();
    }, []);

    const showJobInfo = (job) => {
        setJobCardState(job);  
    }

    const uploadUserCvForJob = async () => {
        if(userCvLink){
            jobs.map(async (job)=>{
    
                const jobRef = doc(db,"jobs",`${job.jobPostedBy}-${job.jobTitle}-${job.jobPostedAt}`);
    
                // await updateDoc(jobRef, {
                //     cvs: arrayUnion({ userId: normalUser.uid, url: userCvLink })
                // },{merge: true}).then(()=>{alert('Cv submitted')}).then(()=>{alert('Cv submitted')}).catch((err)=>{console.log(err)});
            })
        }
    }

    return (
        <>
            {normalUser ? (
                <>
                    {jobs ? (
                        <>
                            {jobCardState ? (  
                                <div className="jobDetailContainer">
									<div className="jobDetailLeft">
										<h1 style={{color: '#2f515b'}}>{jobCardState.jobTitle}</h1>
										<p>{jobCardState.jobDescription}</p>
									</div>
									<div className="jobDetailRight">
										<p>Posted by: {jobCardState.jobPostedByCompany}</p>
										<p>Salary offered: {jobCardState.salary}LPA</p>
										<p>Working Hours: {jobCardState.workingHours}</p>
										<p>Availability: {jobCardState.availability}</p>
										<p>Contact us: {jobCardState.jobPostedBy}</p>
									</div>
                                    <div className="jobCardBtnContainer">
                                        <button className="backBtn" id="submitCvBtn" onClick={uploadUserCvForJob}>Submit CV</button>
                                        <button className='backBtn belowPostBtn' onClick={() => setJobCardState(null)}>Back</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {jobs.map((job) => {
                                        const jobImage = jobImagesObj[job.jobField];
                                        return (
                                            <div 
                                                className="jobCardContainer" 
                                                onClick={() => showJobInfo(job)} 
                                                key={job.id}
                                            >
                                                <div className="jobCard">
                                                    <div className="jobImage">
                                                        <img src={jobImage} id="jobImg" alt="" />
                                                    </div>
                                                    <div className="jobOverview">
                                                        <p>{job.jobTitle}</p>
                                                        <p>{job.jobPostedByCompany}</p>
                                                        <p>{job.salary} LPA</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </>
                    ) : (
                        <>Not ok</>
                    )}
                </>
            ) : (
                <>
                    <h2 id="pleaseloginasauser">Please login as a user to continue</h2>
                </>
            )}
        </>
    );
}

export default JobListing;
