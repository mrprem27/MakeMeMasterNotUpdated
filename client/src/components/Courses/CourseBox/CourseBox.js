import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import img1 from '../../../images/Snapchat-744599346 (2).jpg'
import { useGlobalContext } from '../../../context/App'

export default function CourseBox({ mc, cmain, mcStatus }) {
    const { isTeacher } = useGlobalContext()
    return (
        <div className={cmain === true ? 'courseBox-container courseBox-container-2 ' : 'courseBox-container'}>
            <Link to={mcStatus === true ? `/mycourses/view/${mc._id}` : `/course/view/${mc._id}`}>
                <div className='courseBox-img-box'>
                    <p className='courseBox-status'>
                        {mc.active ? 'Active' : 'Not Active'}
                    </p>
                    <img src={img1} alt="alt" />
                </div>
                <div className='courseBox-seprate'>
                    <div className="courseBox-seprate-1">
                        <h3>{mc.name}</h3>
                        <p className='courseBox-category'>{mc.category}</p>
                        <p>by {mc.teacher && mc.teacher.fullname}</p>
                        {cmain === true && <p> {mc.note ? (mc.note.length < 30?mc.note:mc.note.slice(0,29) + '. . .' ): 'This Course will enhance your skill . . .'}</p>}
                        <p>Rating - {mc.rating}⭐({mc.reviewLength})</p>
                    </div>
                    <div className="courseBox-seprate-2">
                        <div>
                            <h5 className='courseBox-price'>Rs.{mc.price}</h5>
                            <h4 className='courseBox-discount'> - {(mc.discount / mc.price).toFixed(2) * 100}off</h4>
                        </div>
                        <div className='courseBox-studentCount'>
                            <h3 className='courseBox-final-price'>Rs.{mc.price - mc.discount}</h3>
                            <p>Enrolled - {mc.countOfStudents}</p>
                        </div>
                    </div>
                </div>


            </Link>
        </div >
    )
}
