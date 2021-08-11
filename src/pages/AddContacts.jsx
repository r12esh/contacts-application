import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as types from "../redux/action/action.types";
import { v4 } from "uuid";


//Firebase imports
import "firebase/database";
import "firebase/storage";
import firebase from 'firebase/app';


const AddContacts = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.data?.user);
  const updateContact = useSelector(state => state?.data?.updateContact);
  const contactUpdateInfo = useSelector(state => state?.data?.contactUpdateInfo);
  const contactUpdateKey = useSelector(state => state?.data?.contactUpdateKey);

  const [currentName, setCurrentName] = useState(() => contactUpdateInfo?.name);
  const [currentEmail, setCurrentEmail] = useState(() => contactUpdateInfo?.email ? contactUpdateInfo?.email: "");
  const [currentPhone, setCurrentPhone] = useState(contactUpdateInfo?.phone);
  const [currentAddress, setCurrentAddress] = useState(() => contactUpdateInfo?.address ? contactUpdateInfo?.email:"" );
  const [downloadUrl, setDownloadUrl] = useState(() => contactUpdateInfo?.downloadUrl ? contactUpdateInfo?.downloadUrl : "https://firebasestorage.googleapis.com/v0/b/codesandbox-practice-project.appspot.com/o/images%2FdefaultProPic.jpg?alt=media&token=135c23bd-7c88-4c07-91bf-971bf8eceb4a");
  const [noCurrentDataMsg, setNoCurrentDataMsg] = useState();
  const [isUploading, setIsUploading] = useState();



  useEffect(() => {
    if (!user?.uid) {
      history.push("/")
    } else {
      console.log("Add Contacts me hu mai", user);
    }
  }, [user, history])

  /////////////////////////////////////////////////////////////////////

  const imagePicker = async e => {
    // upload image and set D-URL to state
    try {

      const file = e.target.files[0];
      const metadata = {
        contentType: file.type
      };

      let resizedImgage = file

      const storageRef = await firebase.storage().ref()

      var uploadTask = storageRef
        .child('images/' + file.name)
        .put(resizedImgage, metadata)

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        setIsUploading(true);
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            setIsUploading(false);
            console.log("Uploading is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Uploading is in progress");
            break;
        }
        if (progress === 100) {
          setIsUploading(false)
        }
        
      },
        error => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL()
            .then(downloadUrl => { setDownloadUrl(downloadUrl) })
            .catch(error => { console.log(error); })
        }

      );
    } catch (error) {
      console.error(error)
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!currentName || !currentPhone){
      setNoCurrentDataMsg("Set at least a name and phone number")
      return;
    }

    if (updateContact) {
      firebase
        .database()
        .ref(`/${user?.uid}/contacts/${contactUpdateKey}`)
        .update(
          {
            name: currentName,
            email: currentEmail,
            phone: currentPhone,
            address: currentAddress,
            downloadUrl,
          },
          error => {
            console.log(error);
          }
        )
        .then(() => {
          console.log("Contact updated Succesfully");
        })
        .catch(error => console.log("Nahi ho rha update", error))
    } else {
      firebase
        .database()
        .ref(`/${user?.uid}/contacts/${v4()}`)
        .set(
          {
            name: currentName,
            email: currentEmail,
            phone: currentPhone,
            address: currentAddress,
            star: false,
            downloadUrl,
          },
          error => {
            console.log(error);
          }
        )
        .then(() => {
          console.log("Contact added Succesfully");
        })
        .catch(error => console.log("Nahi ho rha ad contact", error))
    }

    dispatch({ type: types.SET_UPDATE_CONTACT, updateContact: false })
    dispatch({ type: types.SET_UPDATE_CONTACT_INFO, contactUpdateInfo: null })
    dispatch({ type: types.SET_UPDATE_CONTACT_KEY, contactUpdateKey: null })
    history.push("/contacts")
  }

  return (
    <div className="addToContacts">
      <p style={{ marginBottom: "10px", fontSize: "1.5em" }}>{!updateContact ? "Add a new Contact" : `Editing ${currentName}`}</p>
      <form className="add-contact-form" action={handleSubmit}>
        <div className="text-center">
          {isUploading ? (
            ""
            ) : (
              <div className="text-center">
              <label htmlFor="imagepicker" className="add-contact-pic">
                <img src={downloadUrl ? downloadUrl : "https://firebasestorage.googleapis.com/v0/b/codesandbox-practice-project.appspot.com/o/images%2FdefaultProPic.jpg?alt=media&token=135c23bd-7c88-4c07-91bf-971bf8eceb4a" } alt="Wait" className="profile" />
              </label>
              <input
                style={{display:"none"}}
                type="file"
                name="image"
                id="imagepicker"
                accept="image/*"
                multiple={false}
                onChange={e => imagePicker(e)}
                className="hidden"
              />
            </div>
          )}
        </div>
          <p style={{color:"red",margin:"20px 0px"}}>{noCurrentDataMsg}</p>
        <input name="name" type="name" placeholder="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
        <input name="phone" type="number" placeholder="Phone" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
        <input name="email" type="email" placeholder="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
        <input name="address" type="address" placeholder="Address" value={currentAddress} onChange={e => setCurrentAddress(e.target.value)} />
        <button onClick={handleSubmit} >{updateContact ? "Update Contact" : "Add to Contacts"}</button>
      </form>
    </div>
  );
}

export default AddContacts;
