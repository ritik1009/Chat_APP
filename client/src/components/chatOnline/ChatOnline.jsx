import { useEffect, useState } from "react";
import "./ChatOnline.css"
import axios from "axios";

const ChatOnline = ({ onlineUser, currentId, setCurrentChat }) => {
  const [ friends,setFriends] = useState([]);
  const [onlineFriends,setOnlineFriends ] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("http://localhost:8800/api/users/friends/" + currentId);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);
  console.log("Friends--",friends)
  console.log("OnlineUser--",onlineUser)
  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUser.includes(f._id)));
  }, [friends,onlineUser]);
  console.log("Onlien Friends",onlineFriends)

  const handleClick = async(user)=>{
    try {
      const res = await axios.get(`http://localhost:8800/api/conversation/find/${currentId}/${user._id}`);
      console.log("response",res.data)
      setCurrentChat(res.data);
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={()=>{handleClick(o)}}>
          <div className="chatOnlineImgContainer">
            <img
              src={o.profilePicture}
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline