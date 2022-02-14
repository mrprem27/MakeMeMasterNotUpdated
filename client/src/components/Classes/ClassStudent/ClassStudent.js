import React, { useEffect, useState } from 'react'
import ClassBox from '../ClassBox/ClassBox'
import { Link } from 'react-router-dom'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App'
import './style.css'

export default function ClassStudent() {
    const { isLogined, refresh } = useGlobalContext()
    const [activeClasses, setActiveClasses] = useState(null);
    const [completedClasses, setCompletedClasses] = useState(null);
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
    }, [refresh, ccView]);
    useEffect(() => {
        const fetch = async () => {
            try {
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
        <div className='classstudent-container'>
            <div className='class-top'>
                <div>
                    <h3 className={!ccView ? 'active-btn' : null} onClick={() => setCcView(false)}>Active Classes</h3>
                    <h3 className={ccView ? 'active-btn' : null} onClick={() => setCcView(true)}>Completed Classes</h3>
                </div>
                {!ccView ? <h2>Active Classes</h2> :
                    <h2>Completed Classes</h2>}
            </div>
            <div className='classstudent-class-box'>
                {(!ccView && activeClasses) && activeClasses.activeClasses.map((ac, i) =>
                    <ClassBox key={i} c={ac} activeClass={null} />)}
                {(ccView && completedClasses) && completedClasses.completedClasses.map((ac, i) =>
                    <ClassBox key={i} c={ac} activeClass={null} />)}
            </div>
        </div>
    )
}
