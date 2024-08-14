import React, { createContext, useState, useEffect } from 'react';
import { app } from './firebase'; // Ensure this is the correct path to your Firebase initialization file
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [company, setCompany] = useState(null);
    const [normalUser, setNormalUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", `company-${user.uid}`));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.isCompany === true) {
                        setCompany(user);
                        setNormalUser(null);
                    } else {
                        setNormalUser(user);
                        setCompany(null);
                    }
                } else {
                    setNormalUser(user);
                    setCompany(null);
                }
            } else {
                setCompany(null);
                setNormalUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ company, normalUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
