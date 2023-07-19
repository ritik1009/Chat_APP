import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useContext, useEffect, useRef, useState } from 'react';
import {io} from "socket.io-client";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Messenger = () => {
  const[conversations,setConversations] = useState([])
  const[currentChat,setCurrentChat] = useState(null)
  const [messages, setmessages] = useState(null);
  const [newMessage,setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [onlineUser,setOnlineUser] = useState([]);
  const socket = useRef()
  const {user}= useContext(AuthContext)
  const scrollRef = useRef();

  useEffect(()=>{
    socket.current = io("ws://localhost:8900");
    console.log("getting the dataaa-----------------------")
    socket.current.on("getMessage", (data) => {
    setArrivalMessage({
      sender: data.senderId,
      text: data.text,
      createdAt: Date.now(),
    });
  });
  },[])
  

  useEffect(()=>{
    console.log("ARRRRRR",arrivalMessage)
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setmessages(prev=>[...prev,arrivalMessage]);
  },[arrivalMessage,currentChat])

  useEffect(()=>{
    socket.current.emit("addUser",user._id);
    socket.current.on("getUsers",users=>{
      setOnlineUser(user.following.filter((f)=>users.some((u)=>u.userId===f)) )
    })
  },[user]);

  useEffect(() => {
    const getConversations = async () => {
      const res = await axios("/conversation/" + user._id);
      console.log(res.data);
      setConversations(res.data);
    };
    getConversations();
  }, [user._id]);
  useEffect(()=>{
    const getMessage =async()=>{
      try {
        const res = await axios.get(
          "http://localhost:8800/api/message/" + currentChat._id
        );
        setmessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }; getMessage();
  },[currentChat])

  const handleSend=async()=>{
    const message = {
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage,
    };
    const reciverId = currentChat.members.find(member=>member!==user._id)
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: reciverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://127.0.0.1:8800/api/message",message );
      setmessages([...messages,message])
      setNewMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuItem"
            />
            {conversations.map((c) => {
              return (
                <div onClick={()=>setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          {currentChat ? (
            <div className="chatBoxWrapper">
              <div className="chatBoxTop">
                {messages?.map((m)=>{
                  return (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  );
                })}
                
              </div>
              <div className="chatBoxBottom">
                <textarea
                  name=""
                  id=""
                  placeholder="Write Something"
                  className="chatMessageInput"
                  minLength={5}
                  maxLength={100}
                  onChange={(e)=>setNewMessage(e.target.value)}
                  value={newMessage}
                />
                <button className="chatSubmitButton" onClick={handleSend}>Send</button>
              </div>
            </div>
          ) : (
            <span className='noConversationText'>Open a new chat</span>
          )}
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline onlineUser={onlineUser} currentId={user._id} setCurrentChat={setCurrentChat}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger