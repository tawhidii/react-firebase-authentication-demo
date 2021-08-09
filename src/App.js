
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user,setUser] = useState({
    isSignIn:false,
    name:"",
    email:"",
    photo:""
  })
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(result=>{
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
        email:''

      }
      setUser(signOutUser)

    })
    .catch(error=>{
      console.log(error.message)
    })
  }
  return (
    <div className="App">{
      user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button>:
      <button onClick={handleSignIn}>Sign in with Google</button>

    }
      
      {
        user.isSignIn && <div>
          <p>Display Name : {user.name}</p>
          <p>Email Address: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
