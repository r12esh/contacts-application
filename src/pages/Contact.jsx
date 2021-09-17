import React from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import * as types from "../redux/action/action.types"

const Contact = ({uid, contactKey, contact }) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const deleteContact = () => {
    firebase
      .database()
      .ref(`${uid}/contacts/${contactKey}`)
      .remove()
      .then(
        () => {
          console.log("Contact Deleted Succesfully");
        })
      .catch(error => {
        console.log("Delete nahi hua re baba",error)
      })

    history.push("/contacts")
  }; 

  const updateStar = () => {
    firebase
      .database()
      .ref(`${uid}/contacts/${contactKey}`)
      .update(
        {
          star: !contact.star
        },
        error => {
          console.log(error);
        }
      )
      .then(() => {
        console.log("Contact star updated Succesfully");
      })
      .catch(error => console.log(error))
  };

  const editContact = () => {
    dispatch({type:types.SET_UPDATE_CONTACT,updateContact:true})
    dispatch({type:types.SET_UPDATE_CONTACT_INFO,contactUpdateInfo:{name:contact?.name,phone:contact?.phone,address:contact?.address,email:contact?.email, downloadUrl:contact?.downloadUrl}});
    dispatch({type:types.SET_UPDATE_CONTACT_KEY,contactUpdateKey:contactKey})
    history.push("/add")
  }

  return (
    <div className="contact">
      <div onClick={updateStar} className={ contact?.star ? "fa fa-star checked star-icon" : "fa fa-star unChecked star-icon"}/>
      <div>
        <img className="contact-profile-pic" src={contact?.downloadUrl} alt="pro-pic" />
      </div>
      <div className="contact-text-infos">
        <p> Name : {contact?.name}</p>
        <p> Contact : {contact?.phone}</p>
        <p> Email : <a style={{textDecoration:"none"}} href={`mailto:${contact?.email}`} target="_blank">{contact?.email}  </a> </p>
        <p> Address : <a style={{textDecoration:"none"}} href={`https://www.google.com/maps/search/?api=1&query=${contact?.address}`} target="_blank">{contact?.address} <i className={contact?.address ? "fa fa-external-link":""}/> </a></p>
      </div>
      <div onClick={editContact} className="fa fa-edit icon-center edit-icon" />
      <div onClick={deleteContact} className="fa fa-trash icon-center delete-icon" />
    </div>
  );
}

export default Contact;
