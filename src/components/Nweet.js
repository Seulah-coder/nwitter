import React from "react";
import {dbService, storageService} from "fbase";
import { useState } from "react";

const Nweet = ({nweetObject, isOwner}) => {

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObject.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("are you sure? you want to delete this nweet?");
        if(ok){
           await dbService.doc(`nweets/${nweetObject.id}`).delete();
           await storageService.refFromURL(nweetObject.attachmentUrl).delete();
        }
    };
    const toggleEditing = () =>{
        setEditing((prev) => !prev)
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        console.log(nweetObject, newNweet);
        await dbService.doc(`nweets/${nweetObject.id}`).update({
            text: newNweet,
        })
        setEditing(false);
    }

    const onChange = (event) => {
        const{target: {value}, } = event;
        setNewNweet(value);
    }
    return (

        <div>
            
            { editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit your nweet" defaultValue={newNweet} required onChange={onChange}/>
                    <input type="submit" value="Update Nweet"/>
                </form> 
                <button onClick={toggleEditing}>Cancel</button>
                </>
                ): (<>
                <h4>{nweetObject.text}</h4>
                {nweetObject.attachmentUrl && <img src={nweetObject.attachmentUrl} width="50px" height="50px"/>}

                {isOwner && 
                    (   <> 
                            <button onClick={onDeleteClick}>Delete Nweet</button>
                            <button onClick={toggleEditing}>Edit Nweet</button> 
                        </>
                )}
                </>
            )}
        </div>
    )
}

export default Nweet;