import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import auth from '../Firebase/firebaseAuth';


const Header = () => {
  const [currentUser, setCurrentUser] = useState();
  const history = useHistory();
  const user = useSelector(state => state?.data?.user);
  
  useEffect(() => {
    setCurrentUser(user);
    if (!currentUser?.uid) {
      history.push("/")
    } else {
      console.log("Contacts me hu mai", user);
      console.log("Contacts me hu mai","Current wala hai",currentUser);
    }
  }, [user, history])


  const handleSignout = async () => {
    await auth.signOut();
    history.push("/")
  }

  return (
    <>
    {
      currentUser ?(
    <div className="header">
      <p onClick={() => history.push("/contacts")} style={{ cursor: "pointer" }}>
        Welcome {user?.displayName}
      </p>
      <button onClick={handleSignout}>
        Sign out {user?.email}
      </button>
    </div>
      ) : (null)
    }
    </>
  );
}

export default Header;
