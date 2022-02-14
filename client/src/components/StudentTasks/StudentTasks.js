import React, { useRef, useEffect, useState } from 'react'
import * as api from '../../api'
import { useGlobalContext } from '../../context/App'
import axios from 'axios'
import StudentComment from './StudentComment/StudentComment'
import './style.css'

export default function StudentTasks({ id, taskId }) {
    const { viewModal, serverUrl, refresh } = useGlobalContext();
    const CancelToken = axios.CancelToken;
    const [filename, setFilename] = useState('');
    const source = CancelToken.source();
    const [prevFiles, setPrevFiles] = useState([]);
    const files = useRef(null);
    const [turnIn, setTurnIn] = useState(false);
    const [state, setState] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.fetchMySubmitedFile(id, taskId);
                setState(data.taskStatus)
                setPrevFiles(data.files)
                setTurnIn(data.status);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [id, taskId, refresh])
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (files.current.file == null) {
            viewModal("Please Choose a file to upload")
        }
        else if (Array.from(files.current.files).length > 5) {
            //max 5 files system
            viewModal("max 5 Files Can be uploaded per task")
        }
        else {
            let sizeExceed = Array.from(files.current.files).map((f) => {
                if (f.size > (8 * 1024 * 1024))
                    return true;
                return false;
            });
            if (sizeExceed.includes(true) || files.current.file.size > 8 * 1024 * 1024)
                viewModal("Size of One Of the Selected File is greater than 8MB")
            else {
                try {
                    const { data } = await api.submitTask(formData, id, taskId, {
                        cancelToken: source.token
                    })
                    setPrevFiles([...prevFiles, data.file])
                    e.target.reset()
                } catch (thrown) {
                    if (axios.isCancel(thrown)) {
                        console.log('Request canceled', thrown.message);
                    } else {
                        console.log(thrown);
                    }
                };
            }
        }

    }
    const deleteFile = async (e) => {
        try {
            const { data } = await api.deleteFile(id, taskId, e.target.parentNode.textContent.slice(0, -2))
            e.target.parentNode.remove();
        } catch (error) {
            console.log(error);
        }
    }
    const doneTask = async (e) => {
        try {
            const { data } = await api.doneTask(id, taskId)
            setTurnIn(true)
        } catch (error) {
            console.log(error);
        }
    }
    const unDoneTask = async (e) => {
        try {
            const { data } = await api.unDoneTask(id, taskId);
            setTurnIn(false)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='studenttask-container'>
            <div className='studenttask-top'>
                <span> {state ? 'Active Task' : 'UnActive Task'}</span>
                <button onClick={() => !turnIn ? doneTask() : unDoneTask()} disabled={!state}>{!turnIn ? "Turn In" : "Turned In"}</button>
            </div>

            {prevFiles&& <ul className='studenttask-prevfiles'>
                <li>No Files Added</li>
                {prevFiles.map((f, i) => <li key={i}><span>{f}</span> <div>
                    <a target={'_blank'} href={serverUrl + "/uploads/" + f}>View👁‍🗨</a> / <a href={serverUrl + `/post/filedownload/${id}/${f}`} download> ⏬</a> Del:-<button onClick={deleteFile} disabled={!state || turnIn}>❌</button></div></li>)}
            </ul>}
            <form onSubmit={submitHandler}>
                <div>
                    Select File to Upload
                    <input type="file" onChange={(e) => setFilename(e.target.value)} name="submission" ref={files} />
                </div>
                <button type="submit" disabled={!state || turnIn}>Submit File</button>
            </form>
            <br />
            <em>Selected File - {filename.length < 1 ? 'No file is Selected' : filename}</em>
            <StudentComment id={id} taskId={taskId} width="500" />
        </div >
    )
}
