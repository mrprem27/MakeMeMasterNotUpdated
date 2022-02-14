import React, {  useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import Posts from '../Contents/Posts/Posts'
import ClassWork from '../Contents/ClassWork/ClassWork'
import Students from '../Contents/Students/Students'
import './style.css'


export default function ClassView() {
    const { id } = useParams();
    const [meetLink, setMeetLink] = useState('');
    const [classState, setClassState] = useState(0)
    return (
        <div className='classview-container'>
            <Link className='meetLink' to={meetLink}>👨‍💻</Link>
            <div className='classview-top'>
                <h3 className={classState == 0 ? 'active-btn' : null} onClick={() => setClassState(0)}>Posts</h3>
                <h3 className={classState == 1 ? 'active-btn' : null} onClick={() => setClassState(1)}>Classwork</h3>
                <h3 className={classState == 2 ? 'active-btn' : null} onClick={() => setClassState(2)}>Students</h3>
            </div>
            {(classState === 0 ? <Posts id={id} setMeetLink={setMeetLink} /> : (classState === 1 ? <ClassWork id={id} /> : <Students id={id} />))}
        </div>
    )
}
