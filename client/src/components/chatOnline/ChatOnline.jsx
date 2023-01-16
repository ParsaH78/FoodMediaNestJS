import { useEffect, useState } from "react";
import "./chatOnline.css";
import { useDispatch } from "react-redux";
import * as api from '../../api/index.js';
import {createConversation} from "../../actions/ChatActions";


export default function ChatOnline({ user, onlineUsers, currentId, setCurrentChat, socket }) {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [allfriends, setAllFriends] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    const getFollowings = async () => {
      try {
        const { data } = await api.getFollowings(user?.id);
        setAllFriends(data)
      } catch (error) {
        console.log("Error in getting followings : ",  error.response);
      }
    }
    getFollowings()
  }, [currentId, user]);

  useEffect(() => {
    setOnlineFriends(allfriends.filter((f) => onlineUsers.includes(f._id)));
  }, [allfriends, onlineUsers]);

  const handleClick = async (user) => {
    const { data } = await api.getUsersConversation(currentId, user._id);
    if (data) {
      setCurrentChat(data);
    } else {
      socket.emit("sendConversation", {
        receiverId: user._id,
      });
      dispatch(createConversation({senderId: user._id, receiverId: currentId}));
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div key={o._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt="profile pic"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
