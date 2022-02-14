import React, { useState,useEffect } from 'react'
import { useGlobalContext } from '../../context/App';
import ActiveTasks from './ActiveTasks/ActiveTasks'
import CompletedTasks from './CompletedTasks/CompletedTasks'
import NoLogin from '../NoLogin/NoLogin'
import './style.css'

export default function Tasks() {
    const { isLogined,setBurger } = useGlobalContext()
    const [state, setState] = useState(true);
    useEffect(() => {
        setBurger(false);
    }, []);
    
    return (
        <div className='task-container'>
            {!isLogined && <NoLogin />}
            {isLogined && <div className='task-list-top'>
                <div>
                    <h3 className={state ? 'active-btn' : null} onClick={() => setState(true)}>Assigned Tasks</h3>
                    <h3 className={!state ? 'active-btn' : null} onClick={() => setState(false)}> Completed Tasks </h3>
                </div>
                {state ? <h2>Assigned Tasks</h2> :
                    <h2>Completed Tasks</h2>}
            </div>}
            <div className='task-list-box'>
                {state ? <ActiveTasks /> : <CompletedTasks />} </div>
        </div >
    )
}
