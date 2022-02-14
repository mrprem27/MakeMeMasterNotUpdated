import React, { useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
import Peer from 'simple-peer'
import { useParams } from 'react-router-dom'
import Video from '../Video/Video'
import { useGlobalContext } from '../../../context/App'
import { Navigate } from "react-router-dom";
import img1 from '../../../images/Snapchat-744599346 (1).jpg'
import './style.css'

export default function Meet({ directAudio, directVideo, setDirectAudio, setDirectVideo, meetEnd, setMeetEnd }) {
    const videoConstraints = {
        height: '400px',
        width: '711px',
    };
    const { username, serverUrl, isTeacher, viewModal } = useGlobalContext()
    const { classId } = useParams();

    const message = useRef(null);
    const [sendingMessages, setSendingMessages] = useState([])
    const sendingMessagesRef = useRef([])
    const [peers, setPeers] = useState([]);
    const [messages, setMessages] = useState([])
    const [teacherPeer, setTeacherPeer] = useState(undefined);
    const teacherPeerRef = useRef(null)
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = classId;
    const myStreamRef = useRef(null);
    const [send, setSend] = useState(false);
    // const [isTeacherPresent, setIsTeacherPresent] = useState(false)
    const [MessageForViewer, setMessageForViewer] = useState('')

    // const [presentationAudio, setPresentationAudio] = useState(false);
    // const [presentationVideo, setPresentationVideo] = useState(false);

    useEffect(() => {
        socketRef.current = io(serverUrl, { transports: ["websocket"] });
        const fetch = async () => {
            let dv = directVideo, da = directAudio;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
                myStreamRef.current = stream
                userVideo.current.srcObject = stream;
                if (dv)
                    myStreamRef.current.getVideoTracks()[0].enabled = true;
                else if (!dv) {
                    myStreamRef.current.getVideoTracks()[0].enabled = false;
                }
            } catch (error) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                    myStreamRef.current = stream
                } catch (error) {
                    console.log("no input ");
                    viewModal("audio" + error.message)
                    return;
                }
                viewModal("video" + error.message)
            }
            if (da)
                myStreamRef.current.getAudioTracks()[0].enabled = true;
            else if (!da) {
                myStreamRef.current.getAudioTracks()[0].enabled = false;
            }
            socketRef.current.emit("join room", { roomID, isTeacher, username, directVideo });

            socketRef.current.on("all users", (users, teacherPresent) => {
                if (isTeacher) {
                    const peers = [];
                    users.forEach(user => {
                        const peer = createPeer(user.id, username, socketRef.current.id, myStreamRef.current, directVideo);
                        peersRef.current.push({
                            peerID: user.id,
                            peer,
                        })
                        peers.push({ peerID: user.id, username: user.username, peer, type: user.type });
                    })
                    setPeers(peers);
                }
                else {
                    if (teacherPresent) {
                        users.forEach(user => {
                            if (user.isTeacher) {
                                const peer = createPeer(user.id, username, socketRef.current.id, myStreamRef.current, directVideo);
                                teacherPeerRef.current = {
                                    peerID: user.id,
                                    peer,
                                }
                                setTeacherPeer({ peerID: user.id, username: user.username, peer, type: user.type })

                            }
                        })
                    } else {
                        setMessageForViewer("The Teacher is not present in the class")
                    }
                }
            })

            socketRef.current.on("user joined", payload => {
                if (isTeacher) {
                    const peer = addPeer(payload.signal, payload.callerID, myStreamRef.current);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                    setPeers(users => [...users, { peerID: payload.callerID, username: payload.callerUsername, peer, type: payload.type }]);
                }
            });

            socketRef.current.on("teacher joined", payload => {
                if (!isTeacher) {
                    const peer = addPeer(payload.signal, payload.callerID, myStreamRef.current);
                    teacherPeerRef.current = {
                        peerID: payload.callerID,
                        peer,
                    }
                    setTeacherPeer({ peerID: payload.callerID, username: payload.callerUsername, peer, type: payload.type })

                }
            });

            socketRef.current.on("receiving returned signal", payload => {
                if (isTeacher) {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                }
                else {
                    if (teacherPeerRef)
                        teacherPeerRef.current.peer.signal(payload.signal);
                }
            });

            socketRef.current.on("receive message", payload => {
                setMessages((m) => [...m, payload])
            });

            socketRef.current.on("message sent", (payload) => {
                sendingMessagesRef.current = sendingMessagesRef.current.filter((m) => m.message !== payload.message)
                console.log(sendingMessagesRef.current);
                setSendingMessages(sendingMessagesRef.current)
                setMessages((m) => [...m, payload])
            })

            socketRef.current.on("toggle camera view", payload => {
                if (isTeacher) {
                    setPeers((pr) => pr.map(p => {
                        if (p.peerID == payload)
                            return { ...p, type: !p.type }
                        return p
                    }));
                }
                else {
                    if (teacherPeerRef)
                        setTeacherPeer((tp) => ({ ...tp, type: !tp.type }))
                }
            });

            socketRef.current.on("teacher leaves", () => {
                if (teacherPeerRef.current) {

                    setMessageForViewer("The Teacher is not present in the Meet")
                    try {
                        teacherPeerRef.current.peer.destroy();
                    } catch (error) {
                        console.log(error.message);
                    }
                    teacherPeerRef.current = null;
                    setTeacherPeer(undefined)
                }
            });

            socketRef.current.on("student leaves", (id) => {
                if (isTeacher) {
                    peersRef.current.filter((p) => {
                        if (p.peerID === id) {
                            console.log("found it");
                            setPeers((users) => users.filter((x) => x.peer != p.peer))
                            try {
                                p.peer.destroy();
                            } catch (error) {
                                console.log(error.message);
                            }
                            return true;
                        }
                        return false;
                    })
                    console.log("what the hell");
                }
            });
        }
        fetch();
        const closeIt = () => {
            if (socketRef.current) {

                console.log("Shit");
                if (isTeacher) {
                    socketRef.current.emit("disTeacher");
                    try {
                        peersRef.current.forEach((p) => p.peer.destroy())
                    } catch (error) {
                        console.log(error.message);
                    }
                }
                else {
                    socketRef.current.emit("disStudent");
                    try {
                        if (teacherPeerRef.current)
                            teacherPeerRef.current.peer.destroy();
                    } catch (error) {
                        console.log(error.message);
                    }
                }
                socketRef.current.off();
                if (myStreamRef.current) {
                    const tracks = myStreamRef.current.getTracks();
                    tracks.forEach(track => track.stop())
                }
            }
        }

        return closeIt;
    }, [classId]);

    useEffect(() => {
        if (window.innerWidth > 600) {
            if (isTeacher) {
                if (peers.length == 2) {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '33.3vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '33.3vw');
                }
                else if (peers.length == 3) {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '45vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '45vw');
                }
                else if (peers.length == 1) {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '50vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '50vw');
                } else {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '100vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '100vw');
                }
            } else {
                if (teacherPeer !== undefined) {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '50vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '50vw');
                } else {
                    document.querySelectorAll('.meet-video').forEach((x) => x.style.width = '100vw');
                    document.querySelectorAll('.meet-video-2').forEach((x) => x.style.width = '100vw');
                }
            }
        }
    }, [peers, teacherPeer]);


    function toggleVideo() {
        if (directVideo)
            myStreamRef.current.getVideoTracks()[0].enabled = false;
        else if (!directVideo) {
            myStreamRef.current.getVideoTracks()[0].enabled = true;
        }
        socketRef.current.emit("toggle camera", isTeacher)
        setDirectVideo(!directVideo)
    }
    function toggleAudio() {
        if (directAudio)
            myStreamRef.current.getAudioTracks()[0].enabled = false;
        else if (!directAudio) {
            myStreamRef.current.getAudioTracks()[0].enabled = true;
        }
        setDirectAudio(!directAudio)
    }

    function createPeer(userToSignal, callerUsername, callerID, stream, type) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });


        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerUsername, callerID, type, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID, signaledUsername: username })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const time = new Date();
        const messageDetails = {
            id: socketRef.current.id,
            sender: username,
            message: message.current.value,
            time: time.toLocaleString(),
            isTeacher,
        }
        if (sendingMessagesRef.current.length > 5) {
            viewModal("Please wait until your previous messages are'n sent.")
            return;
        }
        sendingMessagesRef.current.push(messageDetails)
        setSendingMessages([...sendingMessages, messageDetails])
        socketRef.current.emit("send message", messageDetails)
        e.target.reset()
    }
    return (
        <div className='meet-container'>
            {meetEnd && <Navigate to={`/class/view/${classId}`} />}

            <div className="video_list">
                {peers.map((peer, index) => <Video key={index} peer={peer} />)}
                {(!isTeacher && teacherPeer !== undefined) && <Video peer={teacherPeer} />}
                <div className='meet-video'>
                    <video className='meet-video-2' muted ref={userVideo} autoPlay playsInline hidden={!directVideo ? true : false} />
                    <img src={img1} hidden={directVideo ? true : false} />
                </div>
            </div>

            <div className='meet-btns'>
                <h2>😄</h2>
                <div className="meet-btns-2 meet-confirm-btn">
                    <button disabled={myStreamRef.current && myStreamRef.current.getVideoTracks().length === 0} onClick={toggleVideo}>{directVideo ? "📷" : "❌"}Camera</button>
                    <button onClick={() => setMeetEnd(true)}>📞End</button>
                    <button onClick={toggleAudio}>{directAudio ? "🎤" : "❌"}Mic</button>
                </div>
                <button onClick={() => setSend((s) => !s)}>📬</button>
            </div>
            <div className={send ? 'meet-mssg meet-mssg-show' : 'meet-mssg'}>
                <h6 style={{ color: 'white' }}>Type Your Message</h6>
                <ScrollToBottom className='meet-scroll'>
                    {messages.map((m, i) => <div className={'comment-by-other-meet'} key={i}>
                        <h6>{m.sender}{m.isTeacher && '-👨‍✈️'}</h6>
                        <div>{m.message} <p>{m.time}</p></div>
                    </div>)}
                    {sendingMessages.map((m, i) => <div className={'comment-by-other-meet'} key={i}>
                        <h5>{m.sender}</h5><em>{m.time}<i> Sending</i></em>
                        <p>{m.message}</p>
                        <br />
                    </div>)}
                </ScrollToBottom>
                <form onSubmit={submitHandler}>
                    <textarea placeholder='Message' ref={message}></textarea>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div >
    );
}
