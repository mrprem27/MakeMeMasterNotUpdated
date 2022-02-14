import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import ClassStudent from './ClassStudent/ClassStudent';
import ClassTeacher from './ClassTeacher/ClassTeacher';
import { useGlobalContext } from '../../context/App';
import NoLogin from '../NoLogin/NoLogin'
import './style.css'

export default function Classes() {
    const { isTeacher, isLogined,setBurger } = useGlobalContext();
    useEffect(() => {
      setBurger(false);
    }, []);
    
    return (
        <div className='classes-container'>
            {!isLogined && <NoLogin />}
            <div className="classes-list">
                {isLogined ? (isTeacher ? <ClassTeacher /> : <ClassStudent />) : null}
            </div>
        </div>
    )
}
