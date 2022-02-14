import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App';
import Review from '../../Review/Review';
import img1 from '../../../images/Snapchat-744599346 (2).jpg'
import img2 from '../../../images/Snapchat-744599346 (1).jpg'
import './style.css'
import inst from '../../../images/instructor (2).png'

export default function CourseView() {
    const { refresh, isTeacher, isLogined, viewModal,setBurger } = useGlobalContext();

    const params = useParams();
    const [state, setState] = useState(false)
    const [course, setCourse] = useState(null)
    const [sold, setSold] = useState(null);
    const [inWishList, setInWishList] = useState(false);

    useEffect(() => {
        setBurger(false)
        const fetch = async () => {
            try {
                if (isLogined) {
                    if (isTeacher) {
                        const { data } = await api.fetchCourseView(params.id)
                        setCourse(data.course)
                        setInWishList(data.inWishList)
                    }
                    else {
                        console.log("Stu");
                        const { data } = await api.fetchCourseView(params.id)
                        setCourse(data.course)
                        setInWishList(data.inWishList)
                        setSold(data.isSold)
                        setState(data.course.active)
                    }
                } else {
                    const { data } = await api.fetchCourseViewWL(params.id)
                    setCourse(data.course)
                }

            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [params.id, refresh])

    const buyCourse = async () => {
        try {
            const { data } = await api.buyCourse(params.id)
            setSold(true);
        } catch (error) {
            viewModal(error.message)
            console.log(error.message);
        }
    }
    const addToWishList = async () => {
        try {
            const { data } = await api.addToWishList(params.id)
            setInWishList(true)
        } catch (error) {
            viewModal(error.message)
            console.log(error.message);
        }
    }
    const removeFromWishList = async () => {
        try {
            const { data } = await api.removeFromWishList(params.id)
            setInWishList(false)
        } catch (error) {
            viewModal(error.message)
            console.log(error.message);
        }
    }
    const returnCorrectTextforBuy = () => {
        if (isLogined) {
            if (isTeacher) {
                return <button disabled >Instructor can't buy</button>
            }
            else {
                if (sold) {
                    //add function to cancel subscription
                    return <button disabled >Already Enrolled</button>
                }
                else {
                    if (state) {
                        return <button onClick={() => buyCourse()} >Buy this Course</button>
                    }
                    else {
                        return <button disabled >Course is Not Active</button>
                    }
                }
            }
        }
    }
    return (course
        && <div className='courseview-container'>
            <section className='courseview-top'>
                <img src={img1} alt="this is an image" />
                <div>
                    <p>{course.active ? 'Active' : 'Not Active'}</p>
                    <div className='courseview-details'>
                        <h1>{course.name}</h1>
                        <p className='courseBox-category'>{course.category}</p>
                        <p>Rating - {course.rating}⭐({course.reviewLength})</p>
                        <p>{course.note ? course.note + '. . .' : 'This Course will enhance your skill . . .'}</p>
                    </div>
                </div>
            </section >

            <section className='courseview-box'>
                <div className='courseview-pricebox'>
                    <h3 >Rs.{course.price - course.discount}</h3>
                    <h5 ><span>Rs.{course.price}</span> - {(course.discount / course.price).toFixed(2) * 100}off</h5>
                </div>
                <div className='courseview-buybox'>
                    <div>
                        {returnCorrectTextforBuy()}
                        {/* {sold && <button>Go to Class</button>} */}
                    </div>
                    <div className='courseview-wishlist-btn'>
                        {isLogined && (!inWishList ? <button onClick={addToWishList}>Add To WishList</button> : <button onClick={removeFromWishList}>Remove from WishList</button>)}
                    </div>
                </div>
            </section>

            <section className='courseview-objectives'>
                <h5>Key Objectives of this Course</h5>
                <ul>
                    {course.objectives.map((o, i) =>
                        <li key={i}>{o}</li>
                    )}
                </ul>
            </section>
            <section className='courseview-description'>
                <h5>Description</h5>
                <p>{course.description}</p>
            </section>

            <section className='courseview-teacher'>
                <img src={img2} className='courseview-teacher-img' alt="this is an image" />
                <div>
                    <h3>{course.teacher.fullname}</h3>
                    <p>Email : {course.teacher.email}</p>
                    <p>
                        {course.teacher.rating == 0 ? "Not Rated Yet" : `Avg Rating - ${course.teacher.rating}⭐(${course.teacher.reviewLength})`}
                    </p>
                </div>
                <span>
                    <img src={inst} alt="this is an image" />
                </span>
            </section>
            <div className='courseview-ifrmae'>
                <h5>Demo Video of this Course</h5>
                <iframe src="https://www.youtube.com/embed/XhyU0BVYiAg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <section className='courseview-reviews'>
                <h5>Reviews</h5>
                <Review sold={sold} id={course._id} ratingsAndComments={course.reviews} ratings={course.rating} reviewLength={course.reviewLength} />
            </section>
        </div>
    )
}
