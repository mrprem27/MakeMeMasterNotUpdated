import React, { useEffect, useRef, useState } from 'react'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App'
import ScrollToBottom from 'react-scroll-to-bottom'
import './style.css'

export default function StudentComment({ id, taskId, studentId, setStudentFiles }) {
    const { isTeacher, viewModal } = useGlobalContext();
    const message = useRef(null)
    const [messages, setMessages] = useState([]);
    const [chatInitiated, setChatInitiated] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = isTeacher ? await api.fetchMyChatsTeacher(id, taskId, studentId) : await api.fetchMyChats(id, taskId);
                if (data.messages != null) {
                    setMessages(data.messages)
                    setChatInitiated(true)
                    if (isTeacher) {
                        setStudentFiles(data.files)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [taskId, studentId, id])

    const initiateMyChat = async () => {
        try {
            const { data } = isTeacher ? await api.initiateMyChatTeacher(id, taskId, studentId) : await api.initiateMyChat(id, taskId)
            setChatInitiated(true)
        } catch (error) {
            console.log(error.message);
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (message.current.value.length < 1) {
            viewModal("Comment is Empty");
            return;
        }
        try {
            console.log(message.current.value, isTeacher);
            const { data } = isTeacher ? await api.addCommentToChatTeacher(id, taskId, studentId, message.current.value) : await api.addCommentToChat(id, taskId, message.current.value);;
            if (messages)
                setMessages([...messages, data.message])
            else
                setMessages([data.message,])
            e.target.reset();
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='studentcomment-container'>
            <h4>Private Comments Related to Task</h4>
            {chatInitiated ? <div >
                <ScrollToBottom className='studentcomment-scroll'>
                    {messages && messages.map((m, i) => <div className={((isTeacher && m.isTeacher) || (!isTeacher && !m.isTeacher)) ? 'comment-by-me' : 'comment-by-other'} key={i}><div>
                        {m.message}<p>-{m.time}</p>
                    </div>
                    </div>)}
                </ScrollToBottom>
                <form onSubmit={submitHandler}>
                    <input type="text" ref={message} placeholder='Comment' />
                    <button type="submit" >Send</button>
                </form>
            </div> : <button onClick={initiateMyChat}>Initiate Comments</button>
            }
        </div >
    )
}
