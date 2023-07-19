import { useEffect, useState } from "react";
import "./conversation.css"
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const [user,setUser] = useState({});
  console.log("current Uers",currentUser)
  useEffect(() => {
    const getUser = async () => {
      try {
        const friendId = conversation.members.find(
          (m) => m !== currentUser._id
        );
        const res = await axios.get("/users?userId=" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={user.profilePicture}
        alt=""
      />
      <span className="conversationName">{user.username}</span>
    </div>
  );
};

export default Conversation