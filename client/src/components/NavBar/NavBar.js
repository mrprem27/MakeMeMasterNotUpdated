import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../context/App'
import './style.css'
import categories from '../Mycourses/CreateMyCourse/categories'
import burgerImg from '../../images/burger.png'
export default function NavBar() {
    const { refreshIt, isLogined, burger, setBurger } = useGlobalContext();
    return (
        <nav className='navbar'>
            <img className={burger ? 'navbar-burger navbar-burger-show' : 'navbar-burger'} src={burgerImg} onClick={() => setBurger(!burger)} />
            <Link to="/"> <h1>
                M<sup>3</sup>
            </h1></Link>
            {isLogined ?
                <span className='navbar-links'>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <div className='hero-categories'>
                        <Link to="/courses" disabled>All Courses</Link>
                        {categories.map((c, i) => <Link key={i} to={`/courses/${c}`}>{c}</Link>)}
                        <Link to="/">Help</Link>
                        <hr />
                    </div>
                    <Link to="/classes">Classes</Link>
                    <Link to="/tasks">Tasks</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/notifications">Notifications</Link>
                </span>
                :
                <span className={'navbar-links'}>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                </span>}
            {isLogined ?
                <span className={burger ? 'navbar-links-2 show-burger' : 'navbar-links-2'}>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <div className='hero-categories'>
                        <Link to="/courses" disabled>All Courses</Link>
                        {categories.map((c, i) => <Link key={i} to={`/courses/${c}`}>{c}</Link>)}
                        <Link to="/">Help</Link>
                        <hr />
                    </div>
                    <Link to="/classes">Classes</Link>
                    <Link to="/tasks">Tasks</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/notifications">Notifications</Link>
                </span>
                :
                <span className={burger ? 'navbar-links-2 show-burger' : 'navbar-links-2'}>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <div className='hero-categories'>
                        <Link to="/courses" disabled>All Courses</Link>
                        {categories.map((c, i) => <Link key={i} to={`/courses/${c}`}>{c}</Link>)}
                        <Link to="/">Help</Link>
                        <hr />
                    </div>
                </span>}

            {isLogined ? <div className='navbar-btns'  > <button onClick={refreshIt}>Refresh</button>
            </div> : <div className='navbar-btns'  ><button><Link to="/login">SignIn</Link></button>
                <button className='navbar-signup-btn'><Link to="/Signup" >SignUp</Link></button>
            </div>}
        </nav >
    )
}
