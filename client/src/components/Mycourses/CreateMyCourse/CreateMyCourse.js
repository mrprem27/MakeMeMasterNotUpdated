import React, { useRef, useState } from 'react'
import categories from './categories'
import * as api from '../../../api'
import { useGlobalContext } from '../../../context/App';

export default function CreateMyCourse({ setwantToCreateCourse }) {

    const { closeCreateCourse, viewModal } = useGlobalContext();

    const courseName = useRef(null)
    const category = useRef(null)
    const description = useRef(null)
    const youtubeLink = useRef(null)
    const price = useRef(null)
    const discount = useRef(null)
    const note = useRef(null)
    const timeSloti = useRef(null)
    const timeSlotf = useRef(null)

    const [objective, setObjective] = useState('');
    const [objectives, setObjectives] = useState([])

    const submitHandler = async (e) => {
        e.preventDefault();
        const courseDetails = {
            name: courseName.current.value,
            category: category.current === null ? null : category.current.value,
            description: description.current.value,
            youtubeLink: youtubeLink.current.value,
            price: price.current.value,
            discount: discount.current.value,
            note: note.current.value,
            timeSlot: timeSloti.current.value + " - " + timeSlotf.current.value,
            objectives
        }
        if (courseDetails.name.length < 3 || courseDetails.name.length > 31)
            viewModal("Please set a name which have minimum 3 and maximum 30 Characters")
        else if (!courseDetails.category)
            viewModal("Please select a category for this Course")
        else if (courseDetails.description < 80 || courseDetails.description > 800)
            viewModal("Please set description which have minimum 80 and maximum 800 Characters")
        else if (courseDetails.price < 100 || courseDetails.price > 50000)
            viewModal("Minimum Price of Course Should be 100 and maximum 50,000")
        else if (courseDetails.discount < 0)
            viewModal("Discount can't be negative")
        else if (courseDetails.price - courseDetails.discount < 100)
            viewModal("Minimum buying cost of the course should be 100 (cost = price - discount)")
        else if (courseDetails.note > 40)
            viewModal("Maximum legth of note should be 40")
        else if (!courseDetails.youtubeLink)
            viewModal("Demo Video Url is Not Entered")
        else if (objectives.length < 3)
            viewModal("Minimum no. of Objectives should be 3 please add More!!")
        else {
            try {
                await api.createCourse(courseDetails);
                closeCreateCourse();
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    const delObjective = (e) => {
        const delnode = e.target.parentNode.innerText.slice(4);
        setObjectives(objectives.filter((obj) => delnode !== obj));
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <button onClick={closeCreateCourse}>Close</button>
                <input type="text" ref={courseName} />
                <select ref={category} >
                    <option value="">--Choose Category--</option>
                    {categories.map((c, i) => <option value={c} key={i}>{c}</option>)}
                </select>
                <textarea ref={description} cols="30" rows="10"></textarea>
                <input type="url" ref={youtubeLink} />
                <input type="number" ref={price} />
                <input type="number" ref={discount} />
                <input type="time" ref={timeSloti} required={true} /> to
                <input type="time" ref={timeSlotf} required={true} />
                <div>
                    <ul>
                        {objectives && objectives.map((o, i) =>
                            <li key={i}><button onClick={delObjective}>DEL</button> {o}</li>
                        )}
                    </ul>
                    {objectives.length < 8 ? <div>
                        <textarea cols="30" rows="10" onChange={(e) => setObjective(e.target.value)} value={objective}></textarea>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (objective.length < 100 && objective.length > 10) {
                                setObjectives([...objectives, objective.trim()]);
                                setObjective('');
                            } else {
                                viewModal("objective point's length should be less than 100 and greater than 10 charaters ")
                            }
                        }}>ADD to Objective</button>
                    </div> : <div>Can't add more than 8 objectives in single course</div>}
                </div>
                <input type="text" ref={note} />
                <button type="submit">Create Course</button>
            </form>
        </div>
    )
}
