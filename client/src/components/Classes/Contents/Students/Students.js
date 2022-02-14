import React, { useState, useEffect } from 'react'
import * as api from '../../../../api'
import { useGlobalContext } from '../../../../context/App'
import './style.css'
import img1 from '../../../../images/Snapchat-744599346 (1).jpg'

export default function Students({ id }) {
    const { refresh } = useGlobalContext();

    const [students, setStudents] = useState([])
    const [teacher, setTeacher] = useState({})
    useEffect(() => {
        const fetch = async () => {
            const { data } = await api.fetchMyClassStudents(id);
            console.log(data);
            setTeacher(data.people.teacher)
            setStudents(data.people.students)
        }
        fetch();
    }, [refresh, id])
    return (
        students ? <div className='students-container'>
                <h5>Teacher</h5>
                <hr />
                <div>
                    <img src={img1} alt="this is an image" />
                    <div>
                    <h5>{teacher.fullname}</h5>
                    <h6>{teacher.email}</h6>
                    </div>
                </div>
                <h5>Students</h5>
                <hr />
                {students.map((s, i) => <div key={i}>
                    <img src={img1} alt="this is an image" />
                    <div>
                        <p>{s.fullname}</p>
                        <p>{s.email}</p>
                    </div>
                </div>)}
        </div> : null
    )
}