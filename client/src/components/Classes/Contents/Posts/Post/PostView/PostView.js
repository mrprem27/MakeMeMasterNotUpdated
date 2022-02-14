import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../../../../../../context/App';
import * as api from '../../../../../../api'
import StudentTasks from '../../../../../StudentTasks/StudentTasks';
import TeacherTasks from '../../../../../TeacherTasks/TeacherTasks';
import './style.css'
import img2 from '../../../../../../images/signup2.png'

export default function PostView() {
    const { id, postId } = useParams();
    const { serverUrl, isTeacher, refresh } = useGlobalContext();
    const [post, setPost] = useState(null)
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.fetchSinglePost(id, postId)
                setPost(data.post)
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [id, refresh])
    return (
        post ? <div className='postview-container'>
           <div className='postview-hero-cover'>
                <div className='postview-hero'>
                    <h6>Subject: {post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h6>
                    <p>{post.description}</p>
                    {post.haveFile && <ul>
                        <h6>Resources</h6>
                        {post.files.map((f, i) => <li key={i}><span>{f}</span><div>
                            <a target={'_blank'} href={serverUrl + "/uploads/" + f}> View File👁‍🗨</a>/<a href={serverUrl + `/post/filedownload/${id}/${f}`} download>Download⏬</a></div></li>)}
                    </ul>}
                </div>
                <img src={img2} alt='this is an image' />
           </div>
            {post.isTask && <span className='postview-task'>
                {!isTeacher && <StudentTasks id={id} taskId={post.task} />}
                {isTeacher && <TeacherTasks id={id} taskId={post.task} />}
            </span>}
        </div>
            : null
    )
}
