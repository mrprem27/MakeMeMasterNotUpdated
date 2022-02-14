import React, { useRef, useEffect } from 'react'
import img1 from '../../../images/Snapchat-744599346 (1).jpg'

export default function Video({ peer }) {
    const ref = useRef();

    useEffect(() => {
        peer.peer.on("stream", stream => {
            console.log(stream, stream.getTracks(), peer.username);
            if (stream.getTracks().length === 1) {
                let audio = new Audio()
                audio.srcObject = stream;
                audio.onloadedmetadata = () => {
                    console.log("Auido connected");
                    audio.play();
                }
            }
            else {
                ref.current.srcObject = stream;
                ref.current.onloadedmetadata = () => {
                    console.log("video connected");
                    ref.current.play();
                }
            }
        })
        // return () => {
        //     console.log("ye kya hogya " + peer.username);
        // }
    }, [peer]);


    return (
        <div className='meet-video'>
            <video className='meet-video-2' ref={ref} hidden={!peer.type} autoPlay playsInline />
            <img src={img1} hidden={peer.type} />
        </div>)
}