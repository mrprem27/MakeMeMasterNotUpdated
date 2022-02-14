import React, { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import * as api from '../../api'
import { useGlobalContext } from '../../context/App';
import './style.css'
import img3 from '../../images/signup2.png'

export default function Signup() {
    const { choice } = useParams()
    const { viewModal } = useGlobalContext();

    const fullname = useRef(null);
    const email = useRef(null);
    const age = useRef(null);
    const password = useRef(null);
    const cpassword = useRef(null);
    const cellno = useRef(null);

    const [isAccCreated, setIsAccCreated] = useState(false);
    const [sex, setSex] = useState(undefined);
    const [chooseTeacher, setChooseTeacher] = useState(choice == 1 ? true : false)
    const [showPass, setShowPass] = useState(false);

    const togglebtn = () => {
        if (!showPass) {
            cpassword.current.setAttribute('type', 'text');
            password.current.setAttribute('type', 'text');
        }
        else {
            cpassword.current.setAttribute('type', 'password');
            password.current.setAttribute('type', 'password');
        }
        setShowPass(!showPass);
    }
    const toggleSignup = () => {
        setChooseTeacher(!chooseTeacher)
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const accDetails = {
            fullname: fullname.current.value,
            email: email.current.value,
            sex,
            age: age.current.value,
            password: password.current.value,
            cellno: cellno.current.value,
        }
        if (!accDetails.email)
            viewModal("Enter a Valid Gmail")
        else if (!accDetails.sex)
            viewModal("Choose your Sex")
        else if (!(accDetails.fullname && accDetails.fullname.length > 2))
            viewModal("Enter your Full name (minimum length of name should me 3)")
        else if (!(accDetails.age > 4 && accDetails.age <= 150) && !chooseTeacher)
            viewModal("Min Age can be 5 and max can be 150 to be a student on this Website")
        else if (!(accDetails.age > 15 && accDetails.age <= 120) && chooseTeacher)
            viewModal("Min Age can be 16 and max can be 120 to be a Teacher on this Website")
        else if (!(accDetails.cellno >= 12))
            viewModal("Enter a Valid 10 digit mobile number with country code")
        else if (!(accDetails.password && cpassword.current.value))
            viewModal("Enter Password and Current Password Both")
        else if (!(accDetails.password === cpassword.current.value))
            viewModal("Password is not matching with Confirm Password");
        else {
            console.log(accDetails);
            try {
                const { data } = await api.createUser(accDetails, chooseTeacher);
                setIsAccCreated(true);
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        isAccCreated ? <Navigate to={'/login'} /> :
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
                        <input type="text" placeholder='Your Name' ref={fullname} />
                        <input type="email" placeholder='Email' ref={email} />
                        <input type="password" id="password" placeholder='Password' ref={password} />
                        <input type="password" id="cpassword" placeholder='Confirm password' ref={cpassword} />
                        <input type="text" placeholder='Mobile no.' ref={cellno} />
                        <div>
                            <input type="number" placeholder='Age' ref={age} />
                            <div onChange={(e) => setSex(e.target.value)}>sex: <input type="radio" name="sex" value="M" />M<input type="radio" name="sex" value="F" />F<input type="radio" name="sex" value="Other" />Other</div>
                        </div>
                        <span className='show-password'><input type="checkbox" onChange={togglebtn} /><span>Show Password</span></span>
                        <input type="submit" value='SingUp' />
                        <div className='already-user'><p>Already an User</p><Link to="/login">Click here to login</Link></div>
                    </div>

                </form>
            </div>
    )
}
