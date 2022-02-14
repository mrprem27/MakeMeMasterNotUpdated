import React from 'react'
import NoLogin from '../NoLogin/NoLogin'
import { useGlobalContext } from '../../context/App'

export default function Notifications() {
    const { isLogined } = useGlobalContext();
    return (
        <div>
            {!isLogined && <NoLogin />}
            {isLogined && "Noftifications"}
        </div>
    )
}
