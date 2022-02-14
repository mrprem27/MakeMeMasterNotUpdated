import React, { useState } from "react";
import Meet from "./Meet/Meet";
import MeetConfirmation from "./MeetConfirmation/MeetConfirmation";

export default function MeetViewTeacher() {
    const [join, setJoin] = useState(false);
    const [directAudio, setDirectAudio] = useState(false);
    const [directVideo, setDirectVideo] = useState(false);
    const [meetEnd, setMeetEnd] = useState(false);

    return (
        <div>
            {join ? <Meet directAudio={directAudio} directVideo={directVideo} setDirectAudio={setDirectAudio} setDirectVideo={setDirectVideo} meetEnd={meetEnd} setMeetEnd={setMeetEnd} /> : <MeetConfirmation setJoin={setJoin} directAudio={directAudio} directVideo={directVideo} setDirectAudio={setDirectAudio} setDirectVideo={setDirectVideo} />}
        </div>
    )
};
