import React, { useContext, useEffect, useState } from "react"
import * as api from '../api'

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    const [navBarBlink, setNavBarBlink] = useState(null);
    const [burger, setBurger] = useState(false);
    const [state, setState] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [isModal, setIsModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLogined, setIsLogined] = useState(false);
    const [isTeacher, setIsTeacher] = useState(undefined);
    const [wantToCreateCousrse, setWantToCreateCourse] = useState(false);
    const [wantToCreateClass, setWantToCreateClass] = useState(false);
    const [wantToCreatePost, setWantToCreatePost] = useState(false);
    const [username, setUsername] = useState('')
    const serverUrl = "http://localhost:5000"

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.checkLogin();
                setUsername(data.username)
                setIsTeacher(data.isTeacher)
                setIsLogined(true);
                setState(false);
            } catch (error) {
                setState(false)
                console.log(error.message);
            }
        }
        fetch();
    }, [refresh])

    const viewModal = (content) => {
        setModalContent(content)
        setIsModal(true);
        setTimeout(() => setIsModal(false), 2500)
    }

    const openCreateCourse = () => {
        setWantToCreateCourse(true);
    }
    const closeCreateCourse = () => {
        setWantToCreateCourse(false);
    }
    const openCreateClass = () => {
        setWantToCreateClass(true);
    }
    const closeCreateClass = () => {
        setWantToCreateClass(false);
    }
    const refreshIt = () => {
        setRefresh(!refresh)
    }

    return <AppContext.Provider value={{
        viewModal,
        modalContent,
        isModal,
        isTeacher,
        setIsTeacher,
        isLogined,
        setIsLogined,
        refreshIt,
        refresh,
        openCreateCourse,
        closeCreateCourse,
        wantToCreateCousrse,
        openCreateClass,
        closeCreateClass,
        wantToCreateClass,
        serverUrl,
        wantToCreatePost,
        setWantToCreatePost,
        username,
        setUsername,
        burger,
        navBarBlink,
        setNavBarBlink,
        setBurger
    }}>
        {state ? null : children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}
//state used don't know why