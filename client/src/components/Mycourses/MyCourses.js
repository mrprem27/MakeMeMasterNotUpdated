import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import * as api from '../../api'
import CourseBox from '../Courses/CourseBox/CourseBox';
import CreateMyCourse from './CreateMyCourse/CreateMyCourse';
import { useGlobalContext } from '../../context/App';
import './style.css'


export default function MyCourses() {
    const [myCourses, setMyCourses] = useState([]);

    const { refresh, openCreateCourse, wantToCreateCousrse } = useGlobalContext();

    useEffect(() => {
        const fetch = async () => {
            const { data } = await api.fetchMyCourses();
            setMyCourses(data.myCourses.courses)
        }
        fetch();
    }, [wantToCreateCousrse, refresh])
    return (
        <div className='mycourses-container'>
            <button onClick={openCreateCourse}>Create New Course</button>
            {wantToCreateCousrse && <CreateMyCourse />}
            <div className='mycourses-box'>
                {myCourses && myCourses.map((mc, i) => <CourseBox mc={mc} key={i} mcStatus={true}/>)}
            </div>
        </div>
    )
}
