import "../assets/css/callPage.css"

import { useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Header from "./header"
import phoneIcon from '../assets/images/phone.png'

import { firestore } from "../firebase"

const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers)

const CallPage = props => {
    const localRef = useRef()
    const remoteRef = useRef()
    const idRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()

    const checkUserValidation = () => {
        if(!localStorage.getItem('key')) {
            navigate('/login')
        }
        else {
            setupCall()
        }
    }

    useEffect(() => {
        checkUserValidation()
    })

    const setupCall = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        const remoteStream = new MediaStream();

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        localRef.current.srcObject = localStream;
        remoteRef.current.srcObject = remoteStream;

        if(location.state.callType ===  "create") {
            const callDoc = firestore.collection("calls").doc()
            const offerCandidates = callDoc.collection("offerCandidates")
            const answerCandidates = callDoc.collection("answerCandidates")

            console.log(callDoc.id)
            idRef.current.value = callDoc.id
            await firestore.collection('callOffers').doc(location.state.callDocId).update({ callId: callDoc.id })

            pc.onicecandidate = (event) => {
                event.candidate &&
                    offerCandidates.add(event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await callDoc.set({ offer });

            callDoc.onSnapshot((snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(
                        data.answer
                    );
                    pc.setRemoteDescription(answerDescription);
                }
            });

            answerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(
                            change.doc.data()
                        );
                        pc.addIceCandidate(candidate);
                    }
                });
            });
        }
        else if(location.state.callType === "answer") {
            idRef.current.value = location.state.id
            const callId = location.state.id
            const callDoc = firestore.collection("calls").doc(callId);
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pc.onicecandidate = (event) => {
                event.candidate &&
                    answerCandidates.add(event.candidate.toJSON());
            };

            const callData = (await callDoc.get()).data();


            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
            );

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await callDoc.update({ answer });

            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        }
    }
    
    const hangup = async (id) => {
        pc.close()

        if(location.state.id) {
            const docRef = firestore.collection('calls').doc(id)
            await docRef
                .collection("answerCandidates")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
            await docRef
                .collection("offerCandidates")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
            await docRef.delete()
        }
        if(location.state.offerId) await firestore.collection("callOffers").doc(location.state.offerId).delete()
        navigate('/')
    }

    return(
        <div>
            <Header />
            <div className="call-body">
                <div className="cam-body">
                    <video className="cam local" autoPlay ref={localRef}></video>
                    <video className="cam remote" autoPlay ref={remoteRef}></video>
                </div>
                <div className="options">
                    <input style={{ width: "200px", height: "30px", backgroundColor: "black", borderRadius: '10px', textAlign: 'center', fontSize: "15px"}} className="id-show" disabled ref={idRef}/>
                    <button style={{ width: "150px", height: "60px", fontSize: "20px", marginTop: "30px" }} onClick={() => hangup(location.state.id)}>Hang Up <img style={{ width: "30px", height: "30px" }} src={phoneIcon}/></button>
                </div>
            </div>
        </div>
    )
}

export default CallPage
