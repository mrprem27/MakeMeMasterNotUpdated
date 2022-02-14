import React, { useRef, useState } from 'react'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App';

export default function CreateClass({ setWantToCreateClass,course }) {

    const { viewModal,closeCreateClass } = useGlobalContext();

    const className = useRef(null)
    const meetLink= "https://meet.google.com";
    const note = useRef(null)
    const timeSloti = useRef(null)
    const timeSlotf = useRef(null)


    const submitHandler = async (e) => {
        e.preventDefault();
        const classDetails = {
            name: className.current.value,
            note: note.current.value,
            timeSlot: timeSloti.current.value + " - " + timeSlotf.current.value,
        }
        if (classDetails.name.length < 3 || classDetails.name.length > 31)
            viewModal("Please set a name which have minimum 3 and maximum 30 Characters")
        else if (classDetails.note > 40)
            viewModal("Maximum legth of note should be 40")
        else {
            try {
                await api.createClass(classDetails,course);
                closeCreateClass();
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <button onClick={closeCreateClass}>Close</button>
                <input type="text" ref={className} />
                <input type="time" ref={timeSloti} required={true} /> to
                <input type="time" ref={timeSlotf} required={true} />
                <input type="text" ref={note} />
                <button type="submit">Create Class</button>
            </form>
        </div>
    )
}
