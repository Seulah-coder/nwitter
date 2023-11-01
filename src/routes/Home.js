import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useState, useEffect} from "react";


const Home = ({userObject}) => {
    
    
    const [nweets, setNweets] = useState([]);
    
    // const getNweets = async() => {
    //     const dbNweet = await dbService.collection("nweets").get()
    //     dbNweet.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id
    //         };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // }
    useEffect(() => {
        // getNweets(); // change get Nweets
        dbService.collection("nweets").onSnapshot((snapshot) => {
              const nweetArray = snapshot.docs.map((doc) => (
                {id:doc.id, 
                ...doc.data(),}
              ));
              setNweets(nweetArray);
        });
    }, []);
        
    return (
        <div className="container">
            <NweetFactory userObject={userObject}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map(nweet => 
                    <Nweet key={nweet.id} nweetObject={nweet} isOwner={nweet.creatorId === userObject.uid}/>
                  )}
            </div>
        </div>

    );

}

export default Home;