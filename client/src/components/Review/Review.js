import React, { useRef, useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/App';
import ReviewView from './ReviewView/ReviewView';
import * as api from '../../api'
import './style.css'

export default function Review({ id, sold, ratings, ratingsAndComments, reviewLength }) {
    const { viewModal, isTeacher, isLogined } = useGlobalContext()
    const [alreadyReviewed, setAlreadyReviewed] = useState(null);
    const [ratingsf, setRatingsf] = useState(ratings)
    const rating = useRef(null)
    const comment = useRef(null)
    const [student, setStudent] = useState(null)
    const [reviewLengthf, setReviewLengthf] = useState(reviewLength)
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.checkMyReview(id);
                setAlreadyReviewed(data.data)
                setStudent(data.data.student)
            } catch (error) {
                console.log(error.message);
            }
        }
        if (!isTeacher)
            fetch()
    }, [id])
    const submitHandler = async (e) => {
        e.preventDefault()
        if (rating.current.value === "0")
            viewModal("Please Choose Rating from options to Rate.")
        else if (comment.current.value.length > 300)
            viewModal("Comment should be under 300 characters")
        else {
            try {
                const reviewDetails = {
                    course: id,
                    comment: comment.current.value,
                    rating: parseInt(rating.current.value)
                }
                const { data } = await api.createReview(id, reviewDetails, (alreadyReviewed ? alreadyReviewed._id : undefined))
                if (!alreadyReviewed)
                    setReviewLengthf(reviewLengthf + 1)
                setAlreadyReviewed({ ...reviewDetails, _id: data.reviewId, haveComment: comment.current.value.length > 0 })
                setRatingsf(data.newRating)
                e.target.reset();
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        id ? <div className='review-container'>
                <h6>Course Rating - {ratingsf}⭐({reviewLengthf})</h6>
                {alreadyReviewed ? <div>
                    <br />
                    <br />
                    <i><u>Your Rating and Review</u></i>
                    <ReviewView review={alreadyReviewed} />

                    <br /> Submit new rating and review to change the previous one.

                </div> : ((isLogined && !isTeacher) ? <div>"Rate and Review Course It helps other people to know the prons and cons of this course"</div> : null)}
                {sold && <form onSubmit={submitHandler} className='review-form'>
                    <select ref={rating}>
                        <option value="0">--Rate--</option>
                        <option value="1">1 star</option>
                        <option value="2">2 star</option>
                        <option value="3">3 star</option>
                        <option value="4">4 star</option>
                        <option value="5">5 star</option>
                    </select>
                    <textarea cols="30" rows="10" ref={comment} placeholder='Comment'></textarea>
                    <button type="submit">Submit</button>
                </form>}
                <div className='review-more-review'>
                    {sold && <h4>Reviews by others</h4>}
                    {ratingsAndComments && ratingsAndComments.filter((r) => (r.haveComment === true && (alreadyReviewed ? (r.student != student) : true))).length > 0 ? ratingsAndComments.filter((r) => (r.haveComment === true && (alreadyReviewed ? (r.student != student) : true))).map((r, i) => <ReviewView key={i} review={r} />) : <p className='no-review'>No Reviews to Show 👨‍💻</p>}</div>
            </div>:null
    )
}
