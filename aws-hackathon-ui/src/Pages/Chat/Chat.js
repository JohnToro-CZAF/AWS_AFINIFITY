import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SCORE_DOMAIN, SENTIMENT_DOMAIN, SUGGESTION_DOMAIN, REPLY_DOMAIN } from '../../Redux/Constants';
import "./Chat.css"

export default function Chat(props) {
    const { socket } = props

    const { username, room } = useSelector(state => state.ChatReducer)
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [needHelp, setNeedHelp] = useState(false)
    const [suggestion, setSuggestion] = useState([]);
    const [suggestion1, setSuggestion1] = useState([]);
    const [suggestion2, setSuggestion2] = useState([]);
    const [suggestionText, setSuggestionText] = useState([]);
    const [suggestionText1, setSuggestionText1] = useState([]);
    const [suggestionText2, setSuggestionText2] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const getContext = () => {
        let menteePreviousMessageList = []
        let menteePreviousMessage = ""

        let count = messageList.length - 1;

        for (let i = messageList.length - 1; i >= 0; i--) {
            if (messageList[i].author !== "professional") {
                break;
            }
            count--;
        }

        for (let i = count; i >= 0; i--) {
            if (messageList[i].author !== "client") {
                break;
            }
            menteePreviousMessageList.push(messageList[i]);
        }

        for (let i = menteePreviousMessageList.length - 1; i >= 0; i--) {
            menteePreviousMessage += (menteePreviousMessageList[i].message + " ");
        }

        const context = {
            menteePreviousMessage,
            currentMessage
        }
        return context
    }
    const getSuggestion = async () => {
        setIsLoading(true)
        const context = getContext()
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "seeker": context.menteePreviousMessage,
            "supporter": context.currentMessage
        });

        console.log(raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch(SUGGESTION_DOMAIN, requestOptions)
            .then(response => response.text())
            .then((result) => {
                let component = []
                let operations = JSON.parse(result).operations
                console.log(operations)
                if (!Array.isArray(operations)) {
                    operations = [operations]
                }
                console.log(operations)
                let suggestionText = []
                let suggestionText1 = []
                let suggestionText2 = []
                for (let i = 0; i < operations[0].length; i++) {
                    const operation = operations[0][i]
                    operation.explaination = (typeof operation.explaination === 'undefined') ? operation.explanation : operation.explaination
                    suggestionText.push(operation.sentence);
                    component.push(<div style={{ position: "relative", display: "inline" }} className="container">
                        <p style={{ color: "black", display: "inline" }}>{operation.sentence} </p>
                        {/* <div className="popup" style={{ display: "inline" }}>
                            <p>{operation.explaination}</p>
                        </div> */}
                    </div>)
                }
                for (let i = 0; i < operations[1].length; i++) {
                    const operation = operations[1][i]
                    operation.explaination = (typeof operation.explaination === 'undefined') ? operation.explanation : operation.explaination
                    suggestionText1.push(operation.sentence);
                    component.push(<div style={{ position: "relative", display: "inline" }} className="container">
                        <p style={{ color: "black", display: "inline" }}>{operation.sentence} </p>
                        {/* <div className="popup" style={{ display: "inline" }}>
                            <p>{operation.explaination}</p>
                        </div> */}
                    </div>)
                }
                // for (let i = 0; i < operations[2].length; i++) {
                //     const operation = operations[2][i]
                //     operation.explaination = (typeof operation.explaination === 'undefined') ? operation.explanation : operation.explaination
                //     suggestionText2.push(operation.sentence);
                //     component.push(<div style={{ position: "relative", display: "inline" }} className="container">
                //         <p style={{ color: "black", display: "inline" }}>{operation.sentence} </p>
                //         {/* <div className="popup" style={{ display: "inline" }}>
                //             <p>{operation.explaination}</p>
                //         </div> */}
                //     </div>)
                // }
                setSuggestionText([...suggestionText])
                setSuggestion([...component])
                setSuggestionText1([...suggestionText1])
                setSuggestion1([...component])
                setSuggestionText2([...suggestionText2])
                setSuggestion2([...component])
                setIsLoading(false)
            })
            .catch((error) => {
                console.log('error', error)
                setIsLoading(false)
            });
    }

    const checkAndSendMessage = async () => {
        if (currentMessage !== "") {
            if (username === "professional") {
                const context = getContext()

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "seeker": context.menteePreviousMessage,
                    "supporter": context.currentMessage
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                console.log("dumb", raw)

                fetch(SCORE_DOMAIN, requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                        let score = JSON.parse(result).score
                        setNeedHelp(false)
                        sendMessage()
                        sendMessageArtificial()
                    })
                    .catch(error => console.log('error', error));

            } else {
                sendMessage()
            }
        }
    };
    const getSentiment = async (sent) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "message": sent
        });

        console.log(raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }; 
        return fetch(SENTIMENT_DOMAIN, requestOptions)
            .then(response => response.text())
            .then((result) => {
                return JSON.parse(result).sentiment
            })
            .catch(error => console.log('error', error));
    }
    const sendMessageArtificial = async () => {
        console.log("send message artificial")
        const messageData = {
            room: 1,
            author: "client",
            message: "Okelah",
            time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
        };
        await getText().then((result) => {
            console.log("result", result)
            messageData.message = result;
        });
        console.log(messageData)
        await getSentiment(messageData.message).then((result) => {
            messageData.sentiment = result;
        });
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
    }

    const getText = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var messageListCp = [...messageList]
        messageListCp.push(
            {
                room: 1,
                author: "professional",
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            });
        var raw = JSON.stringify({
            "messages": messageListCp
        });
        console.log("calling getText, sending object to REPLY domain is: ", raw);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(REPLY_DOMAIN, requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log("answer from reply domain in getText: ", JSON.parse(result).message)
                return JSON.parse(result).message;
            })
            .catch(error => console.log('error', error));
    }

    const sendMessage = async () => {
        console.log("send message");
        const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
        };
        await getSentiment(currentMessage).then((result) => {
            messageData.sentiment = result;
        });
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
    }

    const getFullContext = () => {
        let menteePreviousMessageList = []
        // let menteePreviousMessage = ""
        let mentorMessageList = []
        // let mentorMessage = ""

        for (let i = 0; i < messageList.length; i++) {
            if (messageList[i].author === "professional") {
                mentorMessageList.push(messageList[i].message.replace("'", ""));
            } else {
                menteePreviousMessageList.push(messageList[i].message.replace("'", ""));
            }
        }

        const context = {
            past_user_inputs: menteePreviousMessageList.slice(0, menteePreviousMessageList.length - 1),
            generated_responses: mentorMessageList,
            text: menteePreviousMessageList[menteePreviousMessageList.length - 1]
        }
        return context
    }


    const renderMessage = () => {
        return messageList.map((messageContent, index) => {
            return (
                <div style={{ border: `2px solid ${messageContent.author === username ? "#ccc" : "#dedede"}`, backgroundColor: `${messageContent.author === username ? "#ddd" : "#f1f1f1"}`, borderRadius: "5px", padding: "5px", }} key={index}>
                    <div style={{ textAlign: `${messageContent.author === username ? "right" : "left"}` }}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>{messageContent.author}</p>
                        <p>{messageContent.message}</p>
                        <p style={{ fontSize: "12px", color: "gray" }}>{messageContent.time}</p>
                        {(messageContent.author === "client" && username==="professional") ? <p style={{ fontSize: "12px", color: "gray" }}>{messageContent.sentiment}</p> : null}
                        {/* <p> {messageContent.sentiment} </p> */}
                    </div>
                </div>
            );
        })
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data)
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    useEffect(() => {
        socket.on('hello', (data) => {
            if (messageList.length === 0) {
                setMessageList(data)
            }
            console.log(data)
        });
    }, [messageList.length, socket]);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", overflowX: "hidden", overflowY: "scroll" }}>
            <div>
                <div style={{ height: "100px", background: "#263238", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0" }}>
                    <p style={{ fontSize: "32px", color: "white", marginLeft: "10px", fontWeight: "bold" }}><span style={{ color: "#249182" }}>Alice</span> chatbot</p>
                    <div style={{ marginRight: "10px" }}>
                        <button onClick={() => {
                            navigate('/', { replace: true })
                        }} style={{ cursor: "pointer", padding: "10px 20px", borderRadius: "10px", backgroundColor: "white", borderColor: "transparent", fontSize: "20px" }}>Back to home</button>
                    </div>
                </div>
                <div style={{ height: "100px", background: "#263238", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0" }}>
                    <p style={{ fontSize: "20px", color: "white", marginLeft: "10px"}}>
                        Alice is a chatbot, but it can have feeling too. She is 30 years old girl who has been experienced anxiety and stressed lately because of workplace politics. She is looking for someone to talk to and share her feelings. She is a bit shy and not confident to talk to people. She is also afraid of being judged by others. She is looking for someone who can listen to her and give her some advice. Please remember: after all she is just a machine, so don't ask something out of context.
                    </p>
                </div>
                <div style={{ width: "100%", height: "100%" }}>
                    {renderMessage()}
                </div>
            </div>
            <div>
                <div onClick={async () => {
                    await getSuggestion()
                    setNeedHelp(false)
                }} style={{ width: "100%" }}>
                    <button style={{ display: `${needHelp ? "inline" : "none"}`, margin: "10px 0px 10px 30px", padding: "10px 20px", borderRadius: "10px", backgroundColor: "transparent", fontSize: "16px", cursor: "pointer" }}>Would you like to have some suggestions?</button>
                </div>
                <div style={{ width: "100%" }}>
                    <div style={{ justifyContent: "space-between", alignItems: "center", border: "1px solid black", display: `${suggestion1.length === 0 ? "none" : "flex"}`, margin: "10px 30px 10px 30px", padding: "10px 20px", borderRadius: "10px", fontSize: "16px" }}>
                        {/* Reload buttons */}
                        <p style={{ fontSize: "20px" }}>
                            {suggestion1}
                        </p>
                        <button onClick={() => {
                            let text = ""
                            for (let i = 0; i < suggestionText1.length; i++) {
                                text += (suggestionText1[i] + " ")
                            }
                            setCurrentMessage(text)
                            setSuggestionText([])
                            setSuggestion([])
                            setSuggestionText1([])
                            setSuggestion1([])
                            setSuggestionText2([])
                            setSuggestion2([])
                        }} style={{
                            border: "1px solid transparent",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                            height: "100%",
                            outline: "none",
                            fontSize: "20px",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            backgroundColor: "#205bec",
                            color: "white"
                        }}>Apply changes</button>
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <div style={{ justifyContent: "space-between", alignItems: "center", border: "1px solid black", display: `${suggestion.length === 0 ? "none" : "flex"}`, margin: "10px 30px 10px 30px", padding: "10px 20px", borderRadius: "10px", fontSize: "16px" }}>
                        {/* Reload buttons */}
                        <p style={{ fontSize: "20px" }}>
                            <i onClick={async () => {
                                await getSuggestion()
                                setNeedHelp(false)
                            }} style={{ marginRight: "10px", cursor: "pointer" }} className="fa fa-sync"></i>
                            {suggestion}
                        </p>
                        <button onClick={() => {
                            let text = ""
                            for (let i = 0; i < suggestionText.length; i++) {
                                text += (suggestionText[i] + " ")
                            }
                            setCurrentMessage(text)
                            setSuggestionText([])
                            setSuggestion([])
                            setSuggestionText1([])
                            setSuggestion1([])
                            setSuggestionText2([])
                            setSuggestion2([])
                        }} style={{
                            border: "1px solid transparent",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                            height: "100%",
                            outline: "none",
                            fontSize: "20px",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            backgroundColor: "#205bec",
                            color: "white"
                        }}>Apply changes</button>
                    </div>
                </div>
                <div style={{ height: "40px", border: "1px solid #263238", display: "flex" }}>
                    <input
                        style={{
                            height: "100%",
                            flex: "80%",
                            border: "0",
                            padding: "0 0.7em",
                            fontSize: "1em",
                            borderRight: "1px dotted #607d8b",
                            outline: "none"
                        }}
                        type="text"
                        value={currentMessage}
                        placeholder="Input your message"
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && checkAndSendMessage();
                        }}
                    />
                    <button 
                        style={{
                            border: "0",
                            display: `${username === "professional" ? "grid" : "none"}`,
                            placeItems: "center",
                            cursor: "pointer",
                            flex: "15%",
                            height: "100%",
                            backgroundColor: "transparent",
                            outline: "none",
                            fontSize: "25px",
                            color: "black",
                            fontWeight: "bold",
                            borderRight: "1px dotted black"
                        }} 
                        onClick={async () => {
                            await getSuggestion()
                            setNeedHelp(false)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Get suggestion'}
                    </button>
                    <button style={{
                        border: "0",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        flex: `${username === "professional" ? "5%" : "20%"}`,
                        height: "100%",
                        backgroundColor: "transparent",
                        outline: "none",
                        fontSize: "25px",
                        color: "green"
                    }} onClick={checkAndSendMessage}>&#9658;</button>
                </div>
            </div>
        </div>
    )
}