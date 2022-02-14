import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import NoLogin from '../NoLogin/NoLogin';
import * as api from '../../api';
import img2 from '../../images/Snapchat-744599346 (1).jpg'
import CourseBox from '../Courses/CourseBox/CourseBox';
import ClassBox from '../Classes/ClassBox/ClassBox';
import UserEdit from '../UserEdit/UserEdit'
import { useGlobalContext } from '../../context/App';
import './style.css'

export default function Account() {
    const { viewModal, isLogined,setBurger, isTeacher, serverUrl,setIsLogined, refresh } = useGlobalContext();
    const [user, setUser] = useState(null);
    const [wantToEdit, setWantToEdit] = useState(false);

    useEffect(() => {
        setBurger(false);
        let controller = new AbortController();
        const fetch = async () => {
            try {
                const { data } = await api.fetchUser({ signal: controller.signal });
                console.log(data);
                setUser(data.user)
                controller = null;
            } catch (error) {
                setIsLogined(false);
                viewModal(error.message)
                console.log(error.message);
            }
        }
        // console.log(isTeacher, isLogined);
        if (isLogined)
            fetch();
        return () => {
            controller?.abort();
        }
    }, [refresh,wantToEdit]);
    const userLogout = async () => {
        try {
            await api.userLogout();
            setIsLogined(false);
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        !isLogined ? <Navigate to="/login" /> :
            ((user) ? <div className={wantToEdit?'account-container stop-scroll':'account-container'} >
                {wantToEdit&&<UserEdit user={user} setWantToEdit={setWantToEdit}/>}
                <div className='account-top'>
                    <img src={user.dp.length>0?serverUrl+'/uploads/'+user.dp:img2} alt="user" />
                    <section className='accoun-top-section'>
                        <h2>{user.fullname}</h2>
                        <p>Email : {user.email}</p>
                        <p>Phone no. : +{user.cellno}</p>
                        <div>
                            <i>Sex:{user.sex}</i>
                            <p><i>Age:{user.age}</i></p>
                        </div>
                        {isTeacher && <div className='account-review'>
                            {user.rating==0?"Not Rated Yet":`Avg Rating - ${user.rating}⭐(${user.reviewLength})`}
                        </div>}
                        <button onClick={()=>setWantToEdit(true)} className='account-edit-profile-btn'>Edit profile</button>
                    </section>
                </div>
                {!isTeacher ? <div className='account-activeClasses'>
                    <div className='account-section-top'>
                        <h3>Enrolled in</h3>
                        <button><Link to="/classes">Show All</Link></button>
                    </div>
                    <section>
                        {user.activeClasses && user.activeClasses.map((ac, i) =>
                            <ClassBox c={ac} activeClass={null} key={i} />
                        )}
                    </section>
                </div> : <div className='account-myCourses'>
                    <div className="account-section-top">
                        <h3>My Courses</h3>
                        <button><Link to="/mycourses">Show All</Link></button>
                    </div>
                    <section>
                        {user.courses && user.courses.map((mc, i) => <CourseBox mcStatus={true} key={i} mc={mc} />)}
                    </section>
                </div>}

                <div className='account-wishlist'>
                    <div className='account-section-top'>
                        <h3>Wishlist</h3>
                        <button><Link to="/wishlist" target={'_blank'}>Show All</Link></button>
                    </div>

                    <section>
                        {user.wishList && user.wishList.map((wc, i) => <CourseBox mc={wc} key={i} />)}
                    </section>
                </div>
                <div className='account-active-tasks'>
                    <div className='account-section-top'>
                        <h3>Incomplete Tasks</h3>
                        <button><Link to="/tasks">Show All</Link></button>
                    </div>
                    <div className='account-active-task-box'>
                        <section className='task-box-container'>
                            {user.activeTasks && user.activeTasks.map((t, i) =>
                                <div key={i} className='task-box-box'>
                                    <Link to={`/post/view/${t.class._id}/${t._id}`} target="_blank">
                                        <div>
                                            <h6>{t.title}</h6>
                                            <p>{t.task.time}</p>
                                        </div>
                                        <p>Assigned in - {t.class.name} ({t.class.course.name})</p>
                                    </Link>
                                </div>)}
                        </section>
                    </div>
                </div>
                <button onClick={userLogout}>Log out</button>
            </div> : null)

    )
}
