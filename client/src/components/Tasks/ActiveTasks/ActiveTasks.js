import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../../context/App';
import * as api from '../../../api'
import { Link } from 'react-router-dom';
import './style.css'

export default function ActiveTasks() {
    const { isTeacher, refresh } = useGlobalContext()
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        const fetchS = async () => {
            try {
                const { data } = await api.fetchActiveTasksStudent();
                setTasks(data.activeTasks)
                console.log(data.activeTasks);
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchT = async () => {
            try {
                const { data } = await api.fetchActiveTasksTeacher();
                setTasks(data.activeTasks)
            } catch (error) {
                console.log(error.message);
            }
        }
        isTeacher ? fetchT() : fetchS();
    }, [isTeacher, refresh])
    return (
        <div className='task-box-container'>
            {tasks && tasks.map((t, i) => <div key={i} className='task-box-box'>
                <Link to={`/post/view/${t.class._id}/${t._id}`} target="_blank">
                    <div>
                        <h6>{t.title}</h6>
                        <p>{t.task.time}</p>
                    </div>
                    <p>Assigned in - {t.class.name} ({t.class.course.name})</p>
                </Link>
            </div>)}
        </div>
    )
}
