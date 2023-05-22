import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setNameAndRoomAction } from '../../Redux/Actions'

export default function HomeBody(props) {

    const { socket } = props

    const navigate = useNavigate()

    const dispatch = useDispatch()

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "75vh" }}>
            <div>
                <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#019182", textAlign: "center" }}>Let's have a chat with Alice Bot - Training chatbot for TFP</h1>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div>
                        <button onClick={() => {
                            dispatch(setNameAndRoomAction("professional", 1))
                            socket.emit("join_room", 1);
                            navigate('/chatbox', { replace: false })
                        }} style={{ marginLeft: "10px", cursor: "pointer", padding: "10px 20px", borderRadius: "10px", border: "solid 1px transparent", backgroundColor: "#019182", fontSize: "24px", color: "white" }} type="button">
                            Join as Professional
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
