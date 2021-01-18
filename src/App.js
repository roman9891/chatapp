import './App.css';
import {useRef, useState} from 'react'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCXPR93M7N4Y8aUxXEUSJFoi70YFZ1GpsM",
  authDomain: "chatapp-e0bd9.firebaseapp.com",
  projectId: "chatapp-e0bd9",
  storageBucket: "chatapp-e0bd9.appspot.com",
  messagingSenderId: "69999170587",
  appId: "1:69999170587:web:ace98d0ecdcbdde96694be",
  measurementId: "G-NG3S5V05HC"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <div>
        { user ? <Chatroom/> : <SignIn/> }
      </div>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoolge = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoolge}>Sign In with Google</button>
  )
}

const SignOut = () => {
  return auth.currentUser && <button onClick={()=>auth.signOut()}>Sign Out</button>
}

const Chatroom = () => {

  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, {idField: 'id'})
  const [formValue, setFormValue] = useState(``)
  const dummy = useRef()

  const changeHandler = e => {
    const value = e.target.value
    setFormValue(value)
  }

  const submitHandler = async(e) => {
    e.preventDefault()

    const { uid, photoURL} = auth.currentUser

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue(``)

    dummy.current.scrollIntoView({ behavior: 'smooth'})
  }

  return(
    <>
      <div>Chatroom
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={submitHandler}>
        <input onChange={changeHandler} value={formValue}></input>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  )
}

const ChatMessage = props => {

  const {text, uid, photoURL} = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  //if messages id matches current users then 'sent' otherwise 'received'
  
  return(
    <div>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
