import "../assets/css/callUser.css"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, addDoc } from "firebase/firestore"

import Header from "./header"
import PhoneCallIcon from '../assets/images/phone-call.png'

import { fireDb } from '../firebase'
//navigate('/call', { state: { id: "", callType: "create" } })

const CallUser = () => {
    const [users, setUsers] = useState([])
    const unameRef = useRef()
    const navigate = useNavigate()

    const getUsers = async () => {
        const usrs = []
        const data = await getDocs(collection(fireDb, "users"))
        data.forEach(snapshot => {
            if(snapshot.data().name !== localStorage.getItem('name')) { usrs.push({ "id": snapshot.id, "name": snapshot.data().name }) }
        })
        setUsers(usrs)
    }

    const handleCall = async () => {
        const usrId = users.filter(user => user.name === unameRef.current.value)[0].id
        const docID = await addDoc(collection(fireDb, "callOffers"), { calleeName: unameRef.current.value, calleeId: usrId, callerName: localStorage.getItem('name'), callId: "" })
        navigate('/call', { state: { id: "", callType: "create", callDocId: docID.id } })
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div>
            <Header />
            <div className="user-body">
                <div className="user-card">
                    <label className="user-heading">SELECT THE PERSON YOU WANT TO CALL</label>
                    <select className="user-select" placeholder="Who do you want to call?" ref={unameRef}>
                        {
                            users.map(user => <option key={user.id}>{ user.name }</option>)
                        }
                    </select>
                    <img src={PhoneCallIcon} className="call-button" onClick={handleCall}/>
                </div>
                <button className="back" onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    )
}

export default CallUser