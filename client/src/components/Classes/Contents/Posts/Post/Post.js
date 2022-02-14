import React from 'react'
import { useGlobalContext } from '../../../../../context/App'
import { Link } from 'react-router-dom';
import './style.css'
export default function Post({ p, id }) {
    const { isTeacher } = useGlobalContext();
    return (
        <div className='post-container'>
            {(p.isTask || p.haveFile) ? <Link className='post-link' to={`/post/view/${id}/${p._id}`} target="_blank">
                <div>
                    <h5>{p.isTask ? 'Task 🕺✍' : (p.haveFile && 'Resources 📚📺')}</h5><h6>{p.title}</h6>
                    {/* <p>{p.description}</p> */}
                </div>
            </Link> : <div className='post-notice'>
                <h5>Notice 📜</h5>
                <h6>{p.title}</h6>
                <p>{p.description}</p>
            </div>}
        </div>
    )
}
