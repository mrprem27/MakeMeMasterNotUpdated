import React from 'react'
import { Link } from 'react-router-dom'

export default function NoLogin() {
    return (
        <div>
            Login Here!!
            <Link to="/login">Go to Login Page</Link>
        </div>
    )
}
