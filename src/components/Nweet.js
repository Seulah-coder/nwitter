import React from "react";
import {dbService, storageService} from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObject, isOwner}) => {

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObject.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("are you sure? you want to delete this nweet?");
        if(ok){
           await dbService.doc(`nweets/${nweetObject.id}`).delete();
           if(nweetObject.attachmentUrl){
            await storageService.refFromURL(nweetObject.attachmentUrl).delete();
           }
           
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

        <div className="nweet">
            
            { editing ? (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input type="text" placeholder="Edit your nweet" defaultValue={newNweet} required autoFocus onChange={onChange} className="formInput"/>
                    <input type="submit" value="Update Nweet" className="formBtn" />
                </form> 
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
                ): (<>
                <h4>{nweetObject.text}</h4>
                {nweetObject.attachmentUrl && <img src={nweetObject.attachmentUrl} />}

                {isOwner && 
                    (   <> 
                            <div class="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                            </div>
                        </>
                )}
                </>
            )}
        </div>
    )
}

export default Nweet;