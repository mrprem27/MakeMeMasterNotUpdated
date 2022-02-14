import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CourseBox from '../Courses/CourseBox/CourseBox'
import { useGlobalContext } from '../../context/App';
import * as api from '../../api'
import img1 from '../../images/img0.jpg'
import instructor from '../../images/instructor.jpg'
import c1 from './images/c1.jpg'
import c2 from './images/c2.jpg'
import c3 from './images/c3.jpg'
import c4 from './images/c4.jpg'
import c5 from './images/c5.jpg'
import c6 from './images/c6.jpg'
import c7 from './images/c7.jpg'
import c8 from './images/c8.jpg'
import heroImage from '../../images/hero-image.png'
import './style.css'

export default function Home() {
    const [enrollingCourses, setEnrollingCourses] = useState([]);
    const { isLogined, isTeacher, refresh,setBurger } = useGlobalContext();
    useEffect(() => {
        setBurger(false);
        const fetch = async () => {
            try {
                const { data } = await api.fetchEnrollingCourses();
                setEnrollingCourses(data.courses)
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [refresh]);
    let crousel_meter = 0;
    const limit = 2;
    const lsfunc = (e) => {
        if (crousel_meter == 0)
            return;
        crousel_meter += 94;
        window.document.querySelector('.home-students-enrolling-courses-box').style.transform = `translate(${crousel_meter}vw)`
    }
    const grfunc = (e) => {
        if (94 * (-limit + 1) == crousel_meter)
            return;
        crousel_meter -= 94;
        window.document.querySelector('.home-students-enrolling-courses-box').style.transform = `translate(${crousel_meter}vw)`
    }
    let crousel_meter2=0;
    const lsfunc2 = (e) => {
        if (crousel_meter2 == 0)
            return;
        crousel_meter2 += 94;
        window.document.querySelector('.home-recently-started-courses-box').style.transform = `translate(${crousel_meter2}vw)`
    }
    const grfunc2 = (e) => {
        if (94 * (-limit + 1) == crousel_meter2)
            return;
        crousel_meter2 -= 94;
        window.document.querySelector('.home-recently-started-courses-box').style.transform = `translate(${crousel_meter2}vw)`
    }
    return (
        <div className='home-container'>
            <div className='home-hero'>
                <div> <h1>Make Me Master!!</h1>
                    <h3>SkillUp Without Limits . . .</h3>
                    <button><Link to={!isLogined ? '/login' : '/courses'}>{!isLogined ? 'Login Here' : 'Get Courses'}</Link></button>
                </div>
                <img src={heroImage} className='home-hero-img' alt="this is an image" />
            </div>

            <div className='home-info'>
                <h2>Buy Course and . . .</h2>
                <p>Take your Skills and Knowledge to Next Level with Your Tutor/instructor</p>
                <div className='home-info-benefits'>
                    <div><img src="https://static.uacdn.net/web-cms/1_1_Live_Mentorship_498cbc7edd.svg?q=75&w=96&fm=webp" alt="this is an image" /><div className='home-p'><h4>Live Interactive Classes</h4>Live Video&Audio Interaction with your tutor/instructor,Feels like you are in the classroom</div></div>

                    <div><img src="https://static.uacdn.net/web-cms/benefittest_d542d8446b.svg?q=75&w=96&fm=webp" alt="this is an image" /><div className='home-p'><h4>Tasks to Analysis your Performance</h4>Get Review by your tutor/instructor about your preparation completing Tasks to analysis your performance</div></div>

                    <div><img src="https://static.uacdn.net/web-cms/benefitaccess_9a0fb1469f.svg?q=75&w=96&fm=webp" alt="this is an image" /><div className='home-p'><h4>Life time Access to your subscribed Class</h4>On subscription to a Course you get access to all matrials provided by tutor/instructor</div></div>

                    <div><img src="https://static.uacdn.net/web-cms/Live_Doubt_solving_80b01abcbd.svg?q=75&w=96&fm=webp" alt="this is an image" /><div className='home-p'><h4>Interact with your mates</h4>Chat with your mates and tutor/instructor, engage in discussions.</div></div>
                </div>
            </div>

            <div className='home-students-enrolling'>
                <h2>Students are Enrolling in . . .</h2>
                <div className='home-students-enrolling-courses'>
                    <button className='home-lt-btn' onClick={lsfunc}> &lt; </button>
                    <div className='home-students-enrolling-courses-box'>
                        {enrollingCourses.map((c, i) => <CourseBox key={i} mc={c} />)}
                    </div>

                    <button onClick={grfunc} className='home-gt-btn' >&gt;</button>
                </div>
            </div>

            <div className='home-top-categories'>
                <h2>
                    Top categories
                </h2>
                <ul>
                    <li><Link to={`/courses/Design`}><img src={c1} alt="this is an image" /><p>Design</p></Link></li>

                    <li><Link to={`/courses/Development`}><img src={c2} alt="this is an image" /><p>Development</p></Link></li>

                    <li><Link to={`/courses/Marketing`}><img src={c3} alt="this is an image" /><p>Marketing</p></Link></li>

                    <li><Link to={`/courses/IT & Software`}><img src={c4} alt="this is an image" /><p>IT & Software</p></Link></li>

                    <li><Link to={`/courses/Personal Development`}><img src={c5} alt="this is an image" /><p>Self Development</p></Link></li>

                    <li><Link to={`/courses/Business`}><img src={c6} alt="this is an image" /><p>Business</p></Link></li>

                    <li><Link to={`/courses/Photography`}><img src={c7} alt="this is an image" /><p>Photography</p></Link></li>

                    <li><Link to={`/courses/Music`}><img src={c8} alt="this is an image" /><p>Music</p></Link></li>
                </ul>
            </div>

            {!(isTeacher === true) && <div className='home-become-instructor'>
                <img src={instructor} alt="" />
                <div>
                    <h2>Become an instructor</h2>
                    <p>
                        Instructors from around the world teach millions of students on Udemy. We provide the tools and skills to teach what you love.
                        <br />
                        Just Create Account as a Instructor and get Verified.
                    </p>
                    <button><Link to="/signup/1">Become an instructor</Link></button>
                </div>
            </div>}
            <div className='home-recently-started'>
                {/* temp */}
                <h2>Recently started courses</h2>
                <h5>  Start learning live from the best of our ongoing courses</h5>
                <div className='home-recently-started-courses'>
                    <button className='home-lt-btn' onClick={lsfunc2}> &lt; </button>
                    <div className='home-recently-started-courses-box'>
                    {enrollingCourses.map((c, i) => <CourseBox key={i} mc={c} />)}</div>
                    <button onClick={grfunc2} className='home-gt-btn' >&gt;</button>
                </div>
            </div>
            <footer>Footer</footer>
        </div>
    )
}
