import React, { useEffect, useState } from 'react'
import CreatePost from './CreatePost/CreatePost'
import Post from './Post/Post'
import * as api from '../../../../api'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../../../context/App'
import img1 from '../../../../images/Snapchat-744599346 (2).jpg'
import './style.css'

export default function Posts({ id, setMeetLink }) {
    const { refresh, isTeacher, wantToCreatePost, setWantToCreatePost } = useGlobalContext();
    const [posts, setPosts] = useState([])
    const [classView, setClassView] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.fetchPosts(id)
                setPosts(data.posts)
                setMeetLink(data.meetLink)
                setClassView(data.class)
                console.log(data.posts);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetch();
    }, [id, refresh, wantToCreatePost])
    return (
        <div className='posts-container'>
            {classView && <section className='courseview-top'>
                <img src={img1} alt="this is an image" />
                <div>
                    <div className='courseview-details'>
                        <h1>{classView.name}</h1>
                        <p>{classView.note ? classView.note + '. . .' : 'Hello Guys . . .😄'}</p>
                        {isTeacher && <button onClick={() => setWantToCreatePost(true)}>Create Post</button>}
                     
                    </div>
                </div>
            </section >}
            {(isTeacher && wantToCreatePost) && <CreatePost id={id} />}
            <div className='posts-box'>
                {posts && posts.map((p, i) => <Post p={p} id={id} key={i} />)}
            </div>
        </div>
    )
}
