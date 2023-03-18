import "../assets/css/main.css"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'

import PhoneIcon from '../assets/images/phone-call.png'
import RejectIcon from '../assets/images/remove.png'
import Header from "./header"
import { fireDb } from '../firebase'

const Main = props => {
    const [answerClicked, setAnswerClicked] = useState(false)
    const [callOffers , setCallOffers] = useState([]) 
    const navigate = useNavigate()

    const checkUserValidation = () => {
        if(!localStorage.getItem('key')) {
            navigate('/login')
        }
    }

    const checkForCalls = async () => {
        const myOffers = []
        const offers = await getDocs(collection(fireDb, "callOffers"))
        offers.forEach(offer => {
            if(offer.data().calleeName === localStorage.getItem('name')) {
                myOffers.push({ data: offer.data(), offerId: offer.id })
            }
        })
        setCallOffers(myOffers)
    }

    const handleLogout = () => {
        localStorage.removeItem('key')
        localStorage.removeItem('name')
        navigate('/login')
    }

    const handleCallOfferAccepted = () => {
        navigate('/call', { state: { id: callOffers[0].callId, callType:'answer', offerId: callOffers[0].offerId } })
    }

    const handleCallOfferRejected = async () => {
       await deleteDoc(doc(collection(fireDb, "callOffers"), callOffers[0].offerId))
    }

    useEffect(() => {
        checkUserValidation()
        checkForCalls()
    })

    return (
        <div>
            <Header />
            {
                !answerClicked? 
                <div className="main-body">
                    { callOffers.length > 0 ? <Notification name={callOffers[0].data.callerName} acceptOffer={handleCallOfferAccepted} rejectOffer={handleCallOfferRejected}/> : <div></div> }
                    <div className="main-card">
                        <button className="callButton" onClick={ () => navigate('/callUser') }>CALL</button>
                        <button className="answerButton" onClick={() => setAnswerClicked(true)}>ANSWER</button>
                    </div>
                </div> :
                <Answer />
            }
            <button className="back logout" onClick={handleLogout}>Logout</button>
            <button className="back" onClick={() => setAnswerClicked(false)}>Back</button>
        </div>
    )
}

const Notification = props => {
    return (
        <div className="notification">
            {props.name} is calling you &nbsp;
            <img src={PhoneIcon} style={{ width: "30px", height: "30px"}} onClick={props.acceptOffer}/> &nbsp;&nbsp;
            <img src={RejectIcon} style={{ width: "30px", height: "30px"}} onClick={props.rejectOffer}/>
        </div>
    )
}

const Answer = () => {
    const callIdRef = useRef()
    const navigate = useNavigate()

    const handleAnswer = () => {
        navigate('/call', { state: { id: callIdRef.current.value, callType: 'answer' } })
        props.navigate("call", 'answer')
    }


    return (
        <div className="main-body">
            <div className="main-card">
                <input className="id-input" placeholder="Enter Call Id" ref={callIdRef}/>
                <button className="answerButton" onClick={handleAnswer}>Answer</button>
            </div>

        </div>  
    )
}

export default Main