import React from 'react'
import { useGlobalContext } from '../../context/App'
import './style.css'

export default function Modal() {
    const { modalContent } = useGlobalContext();
    return (
        <div className='modal' >
            <p> {modalContent}</p>
        </ div>
    )
}
