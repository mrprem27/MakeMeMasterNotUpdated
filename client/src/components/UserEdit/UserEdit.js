import React, { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import * as api from '../../api'
import { useGlobalContext } from '../../context/App';
import './style.css'
import img2 from '../../images/Snapchat-744599346 (1).jpg'

export default function UserEdit({ user, setWantToEdit }) {
    const { choice } = useParams()
    const { viewModal, isTeacher } = useGlobalContext();
    const cp = useRef(null);
    const p = useRef(null);
    const file = useRef(null);
    const [image, setImage] = useState(null);
    const [fullname, setFullname] = useState(user.fullname);
    // const [email, setEmail] = useState(user.email);
    const [age, setAge] = useState(user.age);
    const [password, setPassword] = useState();
    const [cpassword, setCpassword] = useState();
    const [cellno, setCellno] = useState(`+${user.cellno}`);

    const [showPass, setShowPass] = useState(false);

    const togglebtn = () => {
        if (!showPass) {
            cp.current.setAttribute('type', 'text');
            p.current.setAttribute('type', 'text');
        }
        else {
            cp.current.setAttribute('type', 'password');
            p.current.setAttribute('type', 'password');
        }
        setShowPass(!showPass);
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const accDetails = {
            fullname,
            email: user.email,
            age,
            password,
            cpassword,
            cellno,
        }
        if (!accDetails.email)
            viewModal("Enter a Valid Gmail")
        else if (!(accDetails.fullname && accDetails.fullname.length > 2))
            viewModal("Enter your Full name (minimum length of name should me 3)")
        else if (!(accDetails.age > 4 && accDetails.age <= 150) && !isTeacher)
            viewModal("Min Age can be 5 and max can be 150 to be a student on this Website")
        else if (!(accDetails.age > 15 && accDetails.age <= 120) && isTeacher)
            viewModal("Min Age can be 16 and max can be 120 to be a Teacher on this Website")
        else if (!(accDetails.cellno >= 12))
            viewModal("Enter a Valid 10 digit mobile number with country code without +")
        else if ((password && !cpassword)||(cpassword&&!password))
            viewModal("Enter New Password and Current Password Both")
        else {
            try {
                const formdata=new FormData(document.querySelector('#edit-form'))
                const { data } = await api.editUser(formdata);
                setWantToEdit(false);
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        <div className="edit-user">
            <img src={image||img2} alt="this is an image" />
            <div className='signup-container'>
                <form id="edit-form" onSubmit={(e) => e.preventDefault()}>
                    <button style={{ float: 'right' }} onClick={(e) => {
                        e.preventDefault();
                        setWantToEdit(false)
                    }
                    } >❌</button>
                    <div className="signup-input">
                        <input type="text" name='fullname' placeholder='Your Name' onChange={(e) => setFullname(e.target.value)} value={fullname} />
                        <input type="email" name='email'  placeholder='Email' value={user.email} disabled />
                        <input type="password" name='password' id="password" placeholder='Change Password' onChange={(e) => setPassword(e.target.value)} value={password} ref={p} />
                        <input type="password" name='cpassword' id="cpassword" placeholder='Confirm Old password' onChange={(e) => setCpassword(e.target.value)} alue={cpassword} ref={cp} />
                        <input type="text" name='cellno' onChange={(e) => setCellno(e.target.value)} placeholder='Mobile no.' onChange={(e) => setCellno(e.target.value)} value={cellno} />
                        <div className='user-edit-file'>
                            <input type="number" name='age' placeholder='Age' onChange={(e) => setAge(e.target.value)} value={age} />
                            <input type="file" name="submission" multiple={false} ref={file} onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
                        </div>
                        <span className='show-password'><input type="checkbox" onChange={togglebtn} /><span>Show Password</span></span>
                        <input type="submit" onClick={submitHandler} value='Make Changes' />
                    </div>

                </form>
            </div>
        </div>
    )
}
