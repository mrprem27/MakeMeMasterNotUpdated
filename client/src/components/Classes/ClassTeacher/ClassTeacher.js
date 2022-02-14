import React, { useEffect, useState } from 'react'
import ClassBox from '../ClassBox/ClassBox'
import { Link } from 'react-router-dom'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App'
import './style.css'

export default function ClassTeacher() {
    const { isLogined, refresh } = useGlobalContext()
    const [activeClasses, setActiveClasses] = useState([]);
    const [completedClasses, setCompletedClasses] = useState([]);
    const [ccView, setCcView] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.fetchMyActiveClasses();
                setActiveClasses(data.classes)
            } catch (error) {
                console.log(error.message);
            }
        }
        if (isLogined && !ccView)
            fetch();
    }, [refresh]);
    useEffect(() => {
        const fetch = async () => {
            try {
                console.log("gg");
                const { data } = await api.fetchMyCompletedClasses();
                setCompletedClasses(data.classes)
            } catch (error) {
                console.log(error.message);
            }
        }
        if (ccView && isLogined)
            fetch();
    }, [ccView, refresh]);

    return (
        <div className='classteacher-container'>
            <div className='class-top'>
                <div>
                    <h3 className={!ccView ? 'active-btn' : null} onClick={() => setCcView(false)}>Active Classes</h3>
                    <h3 className={ccView ? 'active-btn' : null} onClick={() => setCcView(true)}>Completed Classes</h3>
                </div>
                {!ccView ? <h2>Active Classes</h2> :
                    <h2>Completed Classes</h2>}
            </div>
            <div className='classteacher-course-box'>
                {!ccView && activeClasses.map((cr, i) =>
                    <div className='classteacher-class-box' key={i} >
                        {cr.activeClasses.length > 0 && <h5>
                            <Link key={i} to={`/mycourses/view/${cr._id}`}>{cr.name}</Link></h5>}
                        <div>
                            {cr.activeClasses.map((ac, i) =>
                                <ClassBox key={i} c={ac} activeClass={cr.activeClass} />
                            )}
                        </div>
                    </div>)}
                {ccView && completedClasses.map((cr, i) =>
                (cr.completedClasses.length > 0 ? <div key={i} className='classteacher-class-box' >
                    <h5>
                        <Link key={i} to={`/mycourses/view/${cr._id}`}>{cr.name}</Link>
                    </h5>
                    <div>
                        {cr.completedClasses.map((cc, i) =>
                            <ClassBox key={i} c={cc} activeClass={null} />
                        )}
                    </div>
                </div> : null))}
            </div>
        </div>
    )
}
