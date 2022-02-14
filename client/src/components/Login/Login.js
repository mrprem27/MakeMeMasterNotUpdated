import React, { useRef, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import * as api from '../../api'
import { useGlobalContext } from '../../context/App';
import img3 from '../../images/signup2.png'

export default function Login() {
    const { viewModal, isLogined, setIsLogined, setIsTeacher, setUsername } = useGlobalContext();

    const email = useRef(null);
    const password = useRef(null);

    const [chooseTeacher, setChooseTeacher] = useState(false)
    const [showPass, setShowPass] = useState(false);

    const togglebtn = () => {
        if (!showPass) {
            password.current.setAttribute('type', 'text');
        }
        else {
            password.current.setAttribute('type', 'password');
        }
        setShowPass(!showPass);
    }
    const toggleSignup = () => {
        setChooseTeacher(!chooseTeacher)
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const accVerifyDetails = {
            email: email.current.value,
            password: password.current.value,
        }
        if (!accVerifyDetails.email)
            viewModal("Enter a Valid Gmail")
        else if (!accVerifyDetails.password)
            viewModal("Enter Password")
        else {
            console.log(accVerifyDetails);
            try {
                const { data } = await api.verifyUser(accVerifyDetails, chooseTeacher);
                console.log(data.message);
                console.log(data.username, "123456");
                setUsername(data.username)
                setIsTeacher(chooseTeacher)
                setIsLogined(true);
                setUsername(data.username)
            } catch (error) {
                viewModal(error.message)
                console.log(error.message);
            }
        }
    }

    return (
        isLogined ? <Navigate to={`/account`} /> :
            <div className='signup-container'>
                <img src={img3} alt=" this is an image" />
                <form onSubmit={submitHandler}>
                    <div className='signup-top'>
                        <div>
                            <h3 className={!chooseTeacher ? 'active-btn' : null} onClick={!chooseTeacher ? undefined : toggleSignup}>Student</h3>

                            <h3 onClick={chooseTeacher ? undefined : toggleSignup} className={chooseTeacher ? 'active-btn' : null}>Instructor</h3>
                        </div>
                    </div>
                    <div className="signup-input">
                        <input type="email" placeholder='Email' ref={email} />
                        <input type="password" id="password" placeholder='Password' ref={password} />
                        <span className='show-password'><input type="checkbox" onChange={togglebtn} /><span>Show Password</span></span>
                        <input type="submit" value='Login' />
                        <div className='already-user'><p>Don't have an Account?</p><Link to="/signup">Click here to Create one</Link></div>
                    </div>
                </form>
            </div>
    )
}
