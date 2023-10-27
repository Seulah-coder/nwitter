import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";

const Home = ({userObject}) => {
    
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        const onSubmit = async (event) => {
            event.preventDefault();
            let attachmentUrl = "";
                if(attachment !== ""){
                    const attachmentRef = storageService.ref().child(`${userObject.uid}/${uuidv4()}`);
                    const response = await attachmentRef.putString(attachment, "data_url");
                    console.log(await response.ref.getDownloadURL());
                    attachmentUrl = await response.ref.getDownloadURL();
                }
            const nweetObject = {
                text: nweet,
                createdAt: Date.now(),
                creatorId : userObject.uid, 
                attachmentUrl
            }
            
            await dbService.collection("nweets").add(nweetObject);
            setNweet("");
            setAttachment("");
        };
        const onChange = (event) => {
            const {
                target: {value},
            } = event;
            setNweet(value);
        }

        const onFileChange = (event) => {
            const { target:{files},} = event;
            const theFile =  files[0];
            console.log(theFile);
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                console.log(finishedEvent);
                const {
                    currentTarget : {result},
                } = finishedEvent;
                setAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }

        const onClearAttachmentClick = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachmentClick}>Clear</button>
                    </div>
                    )}
            </form>
            <div>
                {nweets.map(nweet => 
                    <Nweet key={nweet.id} nweetObject={nweet} isOwner={nweet.creatorId === userObject.uid}/>
                  )}
            </div>
        </div>

    );

}

export default Home;