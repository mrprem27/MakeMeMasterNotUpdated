import React, { useEffect, useRef } from 'react'
import img1 from '../../../images/Snapchat-744599346 (1).jpg'
import { useGlobalContext } from '../../../context/App'
import './style.css'

export default function MeetConfirmation({ setJoin, directAudio, directVideo, setDirectAudio, setDirectVideo }) {
    const { viewModal } = useGlobalContext();
    const mcRef = useRef();
    const mcVideo = useRef();
    const videoConstraints = {
        height: '400px',
        width: '711px',
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
                mcRef.current = stream
                if (mcVideo.current)
                    mcVideo.current.srcObject = stream;
            } catch (error) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                    mcRef.current = stream
                } catch (error) {
                    console.log("no input ");
                    viewModal("audio" + error.message)
                    return;
                }
                viewModal("video" + error.message)
            }
        }
        setTimeout(fetch, 3000)
        return () => {
            console.log(mcRef.current);
            if (mcRef.current) {
                const tracks = mcRef.current.getTracks();
                tracks.forEach(track => track.stop())
            }
        }
    }, []);
    return <div className='meet-confirm-container'>
        <p>Don't worry if Camera light blink even after switching off the Camera or Audio</p>
        <div className={!directVideo ? 'meet-confirm-video' : 'meet-confirm-video-2'}>
            <video muted ref={mcVideo} hidden={!directVideo ? true : false} autoPlay playsInline />
            <img src={img1} hidden={directVideo ? true : false} />
        </div>
        <div className='meet-confirm-btn'>
            <button disabled={mcRef.current && mcRef.current.getVideoTracks().length === 0} onClick={() => {
                setDirectVideo(!directVideo)
                mcRef.current.getVideoTracks()[0].enabled = (!directVideo);
            }}>{directVideo ? "📷" : "❌"}Camera</button>

            <button id='meet-confirm-join' onClick={() => setJoin(true)}>😄Join</button>

            <button onClick={() => setDirectAudio(!directAudio)}>{directAudio ? "🎤" : "❌"}Mic</button>
        </div>
    </div>
}