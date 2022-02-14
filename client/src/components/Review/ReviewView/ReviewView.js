import React from 'react'
import './style.css'

export default function ReviewView({ review }) {
    const starCount = (c) => {
        let s = '⭐';
        for (let i = 1; i < parseInt(c); i++)
            s += '⭐'
        return s;
    }
    return (
        review.haveComment ? <div className='reviewbox'>
            <h6>{review.name || 'Name aaega ynha'}</h6>
            <p>{review.rating + " -" + starCount(review.rating)}</p>
            <q><i>{review.comment}</i></q>
        </div> : null
    )
}
