import React, { useEffect, useState } from 'react'
import Post from '../Posts/Post/Post'
import * as api from '../../../../api'
import { useGlobalContext } from '../../../../context/App'

export default function Classwork({ id }) {
    const { refresh } = useGlobalContext();
    const [ClassWork, setClassWork] = useState([])
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.fetchClassWork(id)
                setClassWork(data.classwork)
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [id, refresh])
    return (
        <div className='posts-container'>
            <div className='posts-box'>
                {ClassWork && ClassWork.map((p, i) => <Post p={p} id={id} key={i} />)}
            </div>
        </div>
    )
}
