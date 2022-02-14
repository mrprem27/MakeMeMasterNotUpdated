import React, { useEffect, useRef, useState } from 'react'
import categories from '../Mycourses/CreateMyCourse/categories'
import * as api from '../../api'
import { Link, useParams } from 'react-router-dom'
import CourseBox from './CourseBox/CourseBox'
import { useGlobalContext } from '../../context/App'
import './style.css'

export default function Courses() {
    const { refresh, isTeacher, refreshIt, setBurger } = useGlobalContext();

    const searchCourse = useRef(null);
    const { filter } = useParams();
    const [courses, setCourses] = useState([])

    useEffect(() => {
        setBurger(false)
        const fetch = async () => {
            try {
                const { data } = await api.fetchCourses(filter ? filter : '*');
                setCourses(data.courses)
                if (searchCourse.current)
                    searchCourse.current.value = '';
            } catch (error) {
                console.log(error.messgage);
            }
        }
        fetch();
    }, [refresh, filter]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.searchCourses(searchCourse.current.value, filter ? filter : '*');
            setCourses(data.courses)
        } catch (error) {
            console.log(error.messgage);
        }
    }

    return (
        <div className='courses-container'>
            <ul className='courses-categories'>
                <li><Link to="/courses" disabled>All Courses</Link></li>
                {categories.map((c, i) => <li key={i}><Link to={`/courses/${c}`}>{c}</Link></li>)}
            </ul>
            <div className='courses-hero'>
                <div className='courses-hero-top'>
                    <form onSubmit={submitHandler}>
                        <button type="reset" onClick={refreshIt}>Clear</button>
                        <input type="text" ref={searchCourse} />
                        <button type="submit">Search</button>
                    </form>
                    {isTeacher && <Link to="/mycourses">Go To MyCourses &gt;&gt;&gt;</Link>}
                </div>
                <div className='courses-box'>
                    {courses && courses.map((mc, i) => <CourseBox mc={mc} key={i} cmain={true} />)}
                </div>
            </div>
        </div >
    )
}
