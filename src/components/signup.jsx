import "../assets/css/signup.css"

import { collection, addDoc } from 'firebase/firestore'
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./header"


import { fireDb } from "../firebase"

const Signup = () => {
    const unameRef = useRef()
    const passRef = useRef()
    const navigate = useNavigate()

    const handleAdd = async () => {
        if(unameRef.current.value && passRef.current.value) {
            await addDoc(collection(fireDb, "users"), {
                name: unameRef.current.value,
                pass: passRef.current.value
            })
            alert(unameRef.current.value + ", your account has been created successfully!")
            navigate('/login')
        }
    }


    return (
        <div>
            <Header />
            <div className="signup-body">
                <div className="signup-card">
                    <label className="signup-heading">Sign Up</label>
                    <input type="text" className="input uname" placeholder="User Name" ref={unameRef} />
                    <input type="password" className="input pass" placeholder="Password" ref={passRef} />
                    <button className="signup-button" onClick={handleAdd}>SUBMIT</button>
                    <label className="heading-footer" onClick={() => navigate('/login')}>Already a User?</label>
                </div>
            </div>
        </div>
    )
}

export default Signup