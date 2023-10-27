import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = ({refreshUser, userObject}) => {
    const history = useHistory(); 
    const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
    const onSignOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    const getMyNweets  = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObject.uid)
            .orderBy("createdAt")
            .get(); 
        console.log(nweets.docs.map(doc => doc.data()));
    }

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(userObject);
        if(userObject.displayName !== newDisplayName){
            await userObject.updateProfile(
                { displayName : newDisplayName}
                );
                refreshUser();
        }
    }
    useEffect(() => {
        getMyNweets();
    }, [])
    return (
    <>
        <form onSubmit={onSubmit}>
            <input type="text" onChange = {onChange} placeholder="Display Name" value ={newDisplayName}/>
            <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onSignOutClick}>Sign Out</button>
    </>
    
    );
};

export default Profile;