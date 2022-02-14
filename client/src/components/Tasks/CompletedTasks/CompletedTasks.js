import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../../context/App';
import * as api from '../../../api'
import { Link } from 'react-router-dom';
import '../ActiveTasks/style.css'

export default function CompletedTasks() {
    const { isTeacher, refresh } = useGlobalContext()
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        const fetchS = async () => {
            try {
                const { data } = await api.fetchCompletedTasksStudent();
                setTasks(data.completedTasks)
                console.log(data.completedTasks);
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchT = async () => {
            try {
                const { data } = await api.fetchCompletedTasksTeacher();
                setTasks(data.completedTasks)
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
                    <h6>{t.title}</h6>
                    <p>Assigned in - {t.class.name} ({t.class.course.name})</p>
                </Link>
            </div>)}
        </div>
    )
}
