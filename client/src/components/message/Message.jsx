import "./message.css"
import {format} from "timeago.js"
const Message = ({own,message}) => {
  return (
    <div className={own?"message own":"message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.unsplash.com/photo-1503524921528-8f5fa912ea75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNvdXJjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
          alt=""
        />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}

export default Message