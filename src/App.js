import {useState, useRef} from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import './App.css';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAhmThAiCvm53wVHiESeDhogjwzcnXFf7c",
  authDomain: "fireship-demos-fdf8b.firebaseapp.com",
  projectId: "fireship-demos-fdf8b",
  storageBucket: "fireship-demos-fdf8b.appspot.com",
  messagingSenderId: "552379207889",
  appId: "1:552379207889:web:d045ae1d91d14c73dcb5f0"
})

const auth = firebase.auth();
const firestore = firebase.firestore()

//project-552379207889

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      <SignOut />
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)

  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  
  const dummy = useRef()

  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
  <main>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
  </main>

  <div ref={dummy}></div>

  <form onSubmit={sendMessage}>

    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
    <button type="submit">Send</button>

  </form>

    </>
  )

}

function ChatMessage({message}) {
  const {text, uid, photoURL} = message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="inside"></img>
      <p>{text}</p>
    </div>
  )
}

export default App;
