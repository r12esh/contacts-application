import React, { useEffect, useState } from 'react';
import * as types from "../redux/action/action.types";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Contact from './Contact';

//Firebase stuff
import firebase from 'firebase/app';
import "firebase/database";
import "firebase/storage";


const Contacts = () => {

  const [contacts, setcontacts] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const uid = useSelector(state => state?.data?.user?.uid);
  const [noContactMsg, setNoContactMsg] = useState("Loading...")

  const getContacts = async () => {
    const contactRef = await firebase.database().ref(`/${uid}/contacts`);
    contactRef.on("value", snapshot => {
      if (snapshot.exists()) {
        // dispatch({ type: types.SET_CONTACTS, contacts: snapshot.val() })
        setcontacts(snapshot.val());
        console.log("YE HAI SNAPSHOT VAL CONTACTS.jsx ME", snapshot.val(),Object.keys(snapshot.val()).length);
        setNoContactMsg("")
      } else {
        setNoContactMsg("No Contacts");
        setcontacts({});
      }
    })
  };

  const addNewContact = () => {
    dispatch({type:types.SET_UPDATE_CONTACT, updateContact:false})
    dispatch({type:types.SET_UPDATE_CONTACT_INFO, contactUpdateInfo:null})
    dispatch({type:types.SET_UPDATE_CONTACT_KEY,contactUpdateKey:null})
    history.push("/add")
  }

  useEffect(() => {
    dispatch({type:types.SET_UPDATE_CONTACT, updateContact:false})
    dispatch({type:types.SET_UPDATE_CONTACT_INFO, contactUpdateInfo:null})
    dispatch({type:types.SET_UPDATE_CONTACT_KEY,contactUpdateKey:null})
    getContacts()
  }, [uid,history])
 
  return (
    <div className="contacts-page">
      <>
      {
        noContactMsg ?  
      <div style={{ textAlign: "center", fontFamily: "Roboto", marginTop: "50px" }}>
        {noContactMsg}
      </div>
        
        : null
      }
      </>
      <div style={{paddingBottom:"100px",paddingTop:"50px"}} className={"contact-list-container"}>
        {
          contacts ? Object.entries(contacts).map(([key, value]) => (
            <div className="contact-container">
              <Contact uid={uid} contactKey={key} contact={value} />
            </div>
          )) : null
        }
      </div>
      <div className="addContactButton" onClick={addNewContact} >
        Add a new Contact
      </div>

    </div>
  );
}

export default Contacts;
