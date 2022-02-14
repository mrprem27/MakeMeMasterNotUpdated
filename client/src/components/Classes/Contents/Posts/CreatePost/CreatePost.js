import React, { useRef, useState } from 'react'
import * as api from '../../../../../api'
import axios from 'axios'
import { useGlobalContext } from '../../../../../context/App'

export default function CreatePost({ id }) {
    const { viewModal, setWantToCreatePost } = useGlobalContext()
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const title = useRef(null);
    const time = useRef(null)
    const description = useRef(null);
    const files = useRef(null);
    const [isTask, setIsTask] = useState(false);
    const [isUploded, setIsUploded] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        var formData = new FormData(e.target);
        const date = new Date();
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()}T` + date.toTimeString().substring(0, 5);   
        if (Array.from(files.current.files).length > 5) {
            viewModal("max 5 Files Can be uploaded per post")
        }
        else if (time.current&&(time.current.value && (dateString >= time.current.value)))
            viewModal("Time can't be less than current Time")
        else if (!title.current.value || !description.current.value)
            viewModal("Title and Description Can't be Empty")
        else if (title.current.value.length > 80)
            viewModal("Length of Title can be max of 80 Characters")
        else if (description.current.value.length > 1000)
            viewModal("Length of description can be max of 1000 Characters");
        else {
            let sizeExceed = Array.from(files.current.files).map((f) => {
                if (f.size > (8 * 1024 * 1024))
                    return true;
                return false;
            });
            if (sizeExceed.includes(true))
                viewModal("Size of One Of the Selected File is greater than 8MB")
            else {
                try {
                    const { data } = await api.createPost(formData, id, {
                        cancelToken: source.token
                    })
                    setWantToCreatePost(false)
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
    return (
        <div>
            <button onClick={() => setWantToCreatePost(false)}>Close</button>
            <div>
                <button onClick={() => source.cancel('Operation canceled by the user')}>Cancel</button>
            </div>
            <form onSubmit={submitHandler} encType='multipart/form-data'>
                <input type="text" ref={title} name="title" />
                <textarea cols="30" rows="10" ref={description} name="description"></textarea>
                <input type="file" ref={files} multiple name="filesArray" />
                <button onClick={(e) => {
                    e.preventDefault();
                    isTask ? setIsTask(false) : setIsTask(true)
                }}>
                    {!isTask ? 'Add Task' : "Remove Task"}</button>
                <input type="text" name="isTask" value={isTask ? 'on' : 'off'} hidden readOnly/>
                {isTask && <div><input type="datetime-local" name="time" ref={time} />
                <input type="number" name="marks" min="0"/></div>}
                <button type="submit">Create Post</button>
            </form>
        </div>
    )
}
