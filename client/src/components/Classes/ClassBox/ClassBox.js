import React from 'react'
import { useGlobalContext } from '../../../context/App'
import { Link } from 'react-router-dom';
import './style.css'
import img1 from '../../../images/Snapchat-744599346 (2).jpg'

export default function ClassBox({ c, activeClass, makeItActiveClass, openClass, closeClass, cc, ac }) {
    const { isTeacher } = useGlobalContext();
    return (
        <div className='classBox-container'>
            <img src={img1} alt="this is an image" />
            <div className='classBox-center'>
                <Link to={`/class/view/${c._id}`} className='classBox-student'>
                    <h3>{c.name}</h3>
                    {!isTeacher && <h5>{c.course.name}</h5>}
                    <p>Users Enrolled- {c.countOfStudents}</p>
                    <p>{c.timeSlot}</p>
                </Link>
                {(activeClass && isTeacher) && <div className='classteacher-bottom'>
                    {(c._id === activeClass) ?
                        <p>Accepting</p>
                        :
                        <div>
                            {ac == true && <div className='classBox-active' ><button onClick={() => makeItActiveClass(c._id)}>Accept</button>
                                <button onClick={() => closeClass(c)}>Close</button></div>}
                        </div>
                    }
                </div>}

                {cc && <div className="classteacher-bottom"> <button className='classBox-open-class' onClick={() => openClass(c)}>Open Class</button> </div>}
            </div>
        </div>
    )
}
