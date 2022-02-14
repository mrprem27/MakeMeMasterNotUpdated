import React, { useEffect, useState } from 'react'
import * as api from "../../api";
import { useGlobalContext } from '../../context/App';
import StudentComment from '../StudentTasks/StudentComment/StudentComment';
import './style.css'

export default function TeacherTasks({ id, taskId }) {
    const { serverUrl } = useGlobalContext()
    const [state, setState] = useState(true);
    const [goodStudents, setGoodStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [badStudents, setBadStudents] = useState([]);
    const [stid, setStid] = useState(null);
    const [studentFiles, setStudentFiles] = useState([]);
    const [wannaSee, setWannaSee] = useState(0);
    const [stname, setStname] = useState('');

    useEffect(() => {
        const fetch = async () => {
            let x = [];
            let y = []
            try {
                const { data } = await api.fetchMyClassStudents(id);
                x = data.people.students;
                setTotalStudents(x.length)
                try {
                    const { data } = await api.fetchTaskSubmissions(id, taskId);
                    setState(data.tasks.status)
                    y = data.tasks.submissions.map((s) => s.student);
                    setGoodStudents(x.filter((s) => y.includes(s._id)));
                    setBadStudents(x.filter((s) => !y.includes(s._id)))
                } catch (error) {
                    console.log(error.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [id, taskId])

    const activeTask = async () => {
        try {
            const { data } = await api.activeTasks(id, taskId);
            setState(true)
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    }
    const unActiveTask = async () => {
        try {
            const { data } = await api.unActiveTasks(id, taskId);
            console.log(data);
            setState(false)
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='teachertask-container'>
            <button onClick={() => !state ? activeTask() : unActiveTask()}>{!state ? 'Activate' : 'Deactivatate'}</button>
            <div className="teachertask-details">
                <h3>Total Submissions - {goodStudents.length}/{totalStudents}</h3>
            </div>
            <span className="teachertask-student">
                {stid&&<h2>{stname}</h2>}
                {stid && <ul style={{ backgroundColor: 'white' }}>{studentFiles.map((f, i) =>
                    <li key={i}><span>{f}</span><div>
                        <a target={'_blank'} href={serverUrl + "/uploads/" + f}> View File👁‍🗨</a>/<a href={serverUrl + `/post/filedownload/${id}/${f}`} download>Download⏬</a>
                    </div>
                    </li>)}
                </ul>}
                {stid && <StudentComment setStudentFiles={setStudentFiles} id={id} taskId={taskId} studentId={stid} />}
            </span>
            <div className="teachertask-good">
                <h2>Turned In</h2><button onClick={() => {
                    setWannaSee(wannaSee !== 1 ? 1 : 0)
                    setStid(null)
                }}>{wannaSee === 1 ? 'Hide' : 'Show'}</button>
            </div>
            {wannaSee === 1 && <div className='teachertask-goodnames'>{goodStudents.length < 1 && <div>No One Turned In Yet</div>}{goodStudents.map((s, i) => <div key={i}>🙍‍♂️ <button onClick={() => {
                setStid(s._id);
                setStname(s.fullname)
            }}>{s.fullname}</button>
            
            </div>)}</div>}
            <div className="teachertasks-bad">
                <h2>Remaining Students</h2><button onClick={() => {
                    setStid(null)
                    setWannaSee(wannaSee !== 2 ? 2 : 0)
                }}>{wannaSee === 2 ? 'Hide' : 'Show'}</button>
            </div>
            {wannaSee === 2 && <div className='teachertask-goodnames'>{badStudents.length < 1 && <div>No One Remaining</div>}{badStudents.map((s, i) => <div key={i}>🙍‍♂️ <button onClick={() => {
                setStname(s.fullname)
                setStid(s._id)
            }}>{s.fullname}</button></div>)}</div>}

        </div>
    )
}

