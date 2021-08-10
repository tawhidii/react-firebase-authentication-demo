
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)

function App() {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  const [newUser,setNewUser] = useState(false)
  const [user,setUser] = useState({
    isSignIn:false,
    name:"",
    email:"",
    photo:"",
    password:"",
    success:"",
    error:""
  })
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider).then(result=>{
        const {displayName,email,photoURL} = result.user
        const signInUser = {
          isSignIn:true,
          name:displayName,
          email:email,
          photo:photoURL
        }
        setUser(signInUser)
        // console.log(displayName,email,photoURL)
    })
    .catch(error=>{
      console.log(error)
      console.log(error.message)
    })
  
  }
  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res=>{
      const signOutUser = {
        isSignIn:false,
        name:'',
        photo:'',
        email:'',
      }
      setUser(signOutUser)

    })
    .catch(error=>{
      console.log(error.message)
    })
  }
  // Facebook Login 
  const handleFacebookLogin = () => {
    firebase.auth().signInWithPopup(facebookProvider).then(result=>{
      const {displayName,email,photoURL} = result.user
      const signInUser = {
        isSignIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signInUser)
      console.log(displayName,email,photoURL)
  })
  .catch(error=>{
    console.log(error)
    console.log(error.message)
  })

  }
  // Handle Blur 
  const handleBlur = (e) => {
    let isFieldValid = true
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      

    }
    if(e.target.name === 'password'){
      isFieldValid = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(e.target.value)

    }
    if(isFieldValid){
      const newUserInfo = {...user}
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
  }
  // Handle Submit 
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(response=>{
        let newUserInfo = {...user}
        console.log(newUserInfo)
        newUserInfo.error = ""
        newUserInfo.success = true
        setUser(newUserInfo)
        updateUserProfile(newUserInfo.name)
      })
      .catch(error=>{
        let newUserInfo = {...user}
        newUserInfo.error= error.message
        newUserInfo.success = false
        setUser(newUserInfo)
      })
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(response=>{
        console.log(response)
        let newUserInfo = {...user}
        newUserInfo.success = true
        newUserInfo.error = ""
        setUser(newUserInfo)
      })
      .catch(error=>{
        let newUserInfo = {...user}
        newUserInfo.error= error.message
        newUserInfo.success = false
        setUser(newUserInfo)
      })
    }

    e.preventDefault()
   
  }
  const updateUserProfile = name => {
    firebase.auth().currentUser.updateProfile({
      displayName:name
    })
    .then(()=>{
      console.log('Updated successfully')
    })
    .catch(error=>{
      console.log(error)
    })
  }
  return (
    <div className="App">{
      user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button>:
      <button onClick={handleSignIn}>Sign in with Google</button>

    }
    <button onClick={handleFacebookLogin}>Facebook Login</button>
      
      {
        user.isSignIn && <div>
          <p>Display Name : {user.name}</p>
          <p>Email Address: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Custom User Auth</h1>

      <form onSubmit={handleSubmit}>
        <input type="checkbox" name="newUser" onChange={()=> setNewUser(!newUser)}/>
        <label htmlFor="newUser">For New User</label>
        <br />
        {
          newUser &&  <input type="text" name="name" onBlur={handleBlur} placeholder="Enter your Name" />
        }
        <br />
        <input type="email" name="email" onBlur={handleBlur} placeholder="Enter Email Address" required/>
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Enter password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      {
        user.success ? <p style={{color:"green"}}>User { newUser ? 'Created':'Sign In'} Successfully </p> :
        <p style={{color:"red"}}>{user.error}</p>
      }
      
    </div>
  );
}

export default App;
