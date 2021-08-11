import React, { useEffect }from 'react';
import auth from "../Firebase/firebaseAuth";
import provider from "../Firebase/authProvider";
import { useHistory } from 'react-router-dom';
import googleIcon from "../Icons/google.svg"
import { useSelector } from 'react-redux';

const Login = () => {

  const history = useHistory()
  const user = useSelector(state=>state.data.user);

  useEffect(()=>{
    if(user){
      history.push("/contacts")
    }
  },[user,history])
  

  const handleLogin = async() =>{
    auth.useDeviceLanguage()
    try {
      await auth.signInWithPopup(provider);
      history.push("/contacts")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-page" >
      <h1 style={{fontFamily:"Quicksand, sans-serif",marginTop:"100px",fontSize:"3em",color:"#0C1B33",textAlign:"center"}}>Welcome to your Contacts,</h1>
      <h1 style={{fontFamily:"Quicksand, sans-serif",marginTop:"10px",fontSize:"3em",color:"#0C1B33",textAlign:"center"}}>Sign in with Google to continue</h1>
      <button className="login-button" onClick={handleLogin} >
        <img className="google-icon" src={googleIcon} alt="" />
        <p style={{padding:"0px 20px"}} >Sign in with Google</p> 
      </button>
    </div>
  );
}

export default Login;
