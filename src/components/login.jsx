import "../assets/css/login.css"

import { collection, getDocs } from 'firebase/firestore'
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./header"

import { fireDb } from "../firebase"

const Login = () => {
    const unameRef = useRef()
    const passRef = useRef()
    const navigate = useNavigate()

    const handleLogin = async () => {

        const users = []
        const data = await getDocs(collection(fireDb, "users"))
        data.forEach(snapshot => {
            users.push({ "key": snapshot.id, "name": snapshot.data().name, "pass": snapshot.data().pass })
        })

        users.map(user => {
            if(user.name === unameRef.current.value) {
                if(user.pass === passRef.current.value) {
                    localStorage.setItem("key", user.key)
                    localStorage.setItem("name", user.name)
                    navigate('/')
                }
            }
        })
    }

    return (
        <div>
            <Header />
            <div className="login-body">
                <div className="login-card">
                    <label className="login-heading">Login</label>
                    <input type="text" className="input uname" placeholder="User Name" ref={unameRef} />
                    <input type="password" className="input pass" placeholder="Password" ref={passRef} />
                    <button className="login-button" onClick={handleLogin}>SUBMIT</button>
                    <label className="heading-footer" onClick={() => navigate('/signup')}>New User?</label>
                </div>
            </div>
        </div>
    )
}

export default Login