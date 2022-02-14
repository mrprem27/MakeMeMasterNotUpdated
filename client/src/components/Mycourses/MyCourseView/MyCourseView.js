import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../../../api'
import ClassBox from '../../Classes/ClassBox/ClassBox';
import CreateClass from '../../Classes/CreateClass/CreateClass'
import { useGlobalContext } from '../../../context/App';
import img1 from '../../../images/Snapchat-744599346 (2).jpg'
import Review from '../../Review/Review'

export default function MyCourseView() {
    const params = useParams();

    const { refresh, wantToCreateClass, openCreateClass } = useGlobalContext();
    const [state, setState] = useState(false)
    const [activeClasses, setActiveClasses] = useState([])
    const [completedClasses, setCompletedClasses] = useState([])
    const [myCourse, setMyCourse] = useState(null)
    const [teacher, setTeacher] = useState({})
    const [activeClass, setActiveClass] = useState('')
    useEffect(() => {
        const fetch = async () => {
            const { data } = await api.fetchMyCourseView(params.id);
            setTeacher(data.course.teacher)
            setActiveClass(data.course.activeClass)
            setMyCourse(data.course)
            console.log(data.course);
            setState(data.course.active)
        }
        fetch();
    }, [params.id, refresh])
    useEffect(() => {
        const fetch = async () => {
            const { data } = await api.fetchMyCourseClasses(params.id);
            setActiveClasses(data.classes.activeClasses)
            setCompletedClasses(data.classes.completedClasses)
        }
        fetch();
    }, [wantToCreateClass, refresh])
    const activateCourse = async () => {
        try {
            const { data } = await api.activateCourse(params.id)
            setState(true);
        } catch (error) {
            console.log(error.message);
        }
    }
    const deactivateCourse = async () => {
        try {
            const { data } = await api.deactivateCourse(params.id)
            setState(false)
        } catch (error) {
            console.log(error.message);
        }
    }
    const makeItActiveClass = async (classId) => {
        try {
            const { data } = await api.makeItActiveClass(params.id, classId)
            setActiveClass(classId)
        } catch (error) {
            console.log(error.message);
        }
    }
    const closeClass = async (c) => {
        try {
            const { data } = await api.closeClass(params.id, c._id)
            setActiveClasses(activeClasses.filter((ac) => ac._id != c._id))
            setCompletedClasses([...completedClasses, c])
        } catch (error) {
            console.log(error.message);
        }
    }
    const openClass = async (c) => {
        try {
            const { data } = await api.openClass(params.id, c._id)
            setCompletedClasses(completedClasses.filter((cc) => cc._id != c._id))
            setActiveClasses([...activeClasses, c])
        } catch (error) {
            console.log(error.message);
        }
    }
    // return (course
    //     && <div className='courseview-container'>

    //         <section className='courseview-teacher'>
    //             <img src={img2} className='courseview-teacher-img' alt="this is an image" />
    //             <div>
    //                 <h3>{myCourse.teacher.fullname}</h3>
    //                 <p>Email : {myCourse.teacher.email}</p>
    //                 <p>
    //                     {myCourse.teacher.rating == 0 ? "Not Rated Yet" : `Avg Rating - ${myCourse.teacher.rating}⭐(${myCourse.teacher.reviewLength})`}
    //                 </p>
    //             </div>
    //             <span>
    //                 <img src={inst} alt="this is an image" />
    //             </span>
    //         </section>
    //         <div className='courseview-ifrmae'>
    //             <h5>Demo Video of this Course</h5>
    //             <iframe src="https://www.youtube.com/embed/XhyU0BVYiAg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    //         </div>
    //         <section className='courseview-reviews'>
    //             <h5>Reviews</h5>
    //             <Review sold={sold} id={myCourse._id} ratingsAndComments={myCourse.reviews} ratings={myCourse.rating} reviewLength={myCourse.reviewLength} />
    //         </section>
    //     </div>
    // )
    return (
        myCourse ? <div>
            <div className='courseview-container'>
                <section className='courseview-top'>
                    <img src={img1} alt="this is an image" />
                    <div>
                        <p>{state ? 'Active' : 'Not Active'}</p>
                        <div className='courseview-details'>
                            <h1>{myCourse.name}</h1>
                            <p className='courseBox-category'>{myCourse.category}</p>
                            <p>Rating - {myCourse.rating}⭐({myCourse.reviewLength})</p>
                            <p>{myCourse.note ? myCourse.note + '. . .' : 'This Course will enhance your skill . . .'}</p>
                        </div>
                    </div>
                </section >

                <section className='courseview-box'>
                    <div className='courseview-pricebox'>
                        <h3 >Rs.{myCourse.price - myCourse.discount}</h3>
                        <h5 ><span>Rs.{myCourse.price}</span> - {(myCourse.discount / myCourse.price).toFixed(2) * 100}off</h5>
                    </div>
                    <div className='courseview-buybox'>
                        <div>
                            <button onClick={openCreateClass}>Create Class</button>
                            {wantToCreateClass && <CreateClass course={myCourse._id} />}
                        </div>
                        <div className='courseview-wishlist-btn'>
                            {state ? <button onClick={deactivateCourse}>Deactivate</button> : <button onClick={activateCourse}>Activate</button>}
                        </div>
                    </div>
                </section>
                <section className='courseview-objectives'>
                    <h5>Key Objectives of this Course</h5>
                    <ul>
                        {myCourse.objectives.map((o, i) =>
                            <li key={i}>{o}</li>
                        )}
                    </ul>
                </section>
                <section className='courseview-description'>
                    <h5>Description</h5>
                    <p>{myCourse.description}</p>
                </section>
                <section className='courseview-description'>
                    <h5>Active classes</h5>
                    <div className='classstudent-class-box'>
                        {activeClasses && activeClasses.map((ac, i) =>
                            <ClassBox key={i} c={ac} activeClass={activeClass} makeItActiveClass={makeItActiveClass} closeClass={closeClass} ac={true} />)}
                    </div>
                    <h5>Closed classes</h5>
                    <div className='classstudent-class-box'>
                        {completedClasses && completedClasses.map((ac, i) =>
                            <ClassBox key={i} c={ac} openClass={openClass} cc={true} />)}
                    </div>
                </section>
                <section className='courseview-reviews'>
                    <h5>Reviews</h5>
                    <Review id={myCourse._id} ratingsAndComments={myCourse.reviews} ratings={myCourse.rating} reviewLength={myCourse.reviewLength} />
                </section>

            </div>
        </div>
            : null)
}
