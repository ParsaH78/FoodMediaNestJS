import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileFeed from "../../components/profileFeed/ProfileFeed";
import ProfileLeftbar from "../../components/profileLeftbar/ProfileLeftbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import * as api from '../../api/index.js';
import ProfileLeftbarMobile from "../../components/profileLeftbar/ProfileLeftbarMobile";

export default function Profile({user}) {
  const [filteredPost, SetFilteredPost] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const id = useParams().id;
  const [file, setFile] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [creator, setCreator] = useState({});
  const [leftMobile, setLeftMobile] = useState(false);
  const [rightMobile, setRightMobile] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await api.getUser({userId: id});
      setCreator(data);
    }
    getUser();
  }, [user.profilePicture, user.coverPicture, id]);

  useEffect(() => {
    document.title = `پروفایل ${creator?.username}`
  }, [creator])

  useEffect(() => {
    const uploadPic = async () => {
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        try {
          await axios.post("/upload", data);
          try {
            await api.updateUser({_id: user._id, profilePicture: fileName});
          } catch (error) {
            console.log("Error in updating user : ",  error.response);
          }
          try {
            await api.updateComment({id: user._id, image: fileName});
          } catch (error) {
            console.log(error.response);
          }
        } catch (err) {
            console.log("Profile Pic Upload failed : ", err);
        }
      }
    }
    uploadPic();
  }, [file])

  useEffect(() => {
    const uploadCover = async () => {
      if (coverPic) {
        const data = new FormData();
        const fileName = Date.now() + coverPic.name;
        data.append("name", fileName);
        data.append("file", coverPic);
        try {
          await axios.post("/upload", data);
          try {
            await api.updateUser({_id: user._id, coverPicture: fileName});
          } catch (error) {
            console.log("Error in updating user : ",  error.response);
          }
        } catch (err) {
            console.log("Cover Pic Upload failed : ", err);
        }
      }
    }
    uploadCover();
  }, [coverPic]);

  const LeftMobileMenu = () => {
    setLeftMobile(prev => !prev);
  }

  const RightMobileMenu = () => {
    setRightMobile(prev => !prev);
  }

  return (
    <>
    {creator &&
    <div className="page">
      <Topbar user={user}/>
      <div className="profile">
        <Sidebar user={user} filteredPost={filteredPost} SetFilteredPost={SetFilteredPost} rightMobile={rightMobile} setRightMobile={setRightMobile}/>
        <div className="box">
          <div className="menuBox">
            <button className={rightMobile ? "profileHamburger right is-active" : "profileHamburger right"} onClick={() => RightMobileMenu()}>
              <div className="bar"></div>
            </button>
            <button className={leftMobile ? "profileHamburger left is-active" : "profileHamburger left"} onClick={() => LeftMobileMenu()}>
              <div className="bar"></div>
            </button>
        </div>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <div className="profileCoverBox">
                <img
                  className="profileCoverImg"
                  src={
                    creator.coverPicture
                      ? PF + creator.coverPicture
                      : PF + "noCover.jpg"
                  }
                  alt="cover pic"
                />
                {user._id === creator._id && 
                <label htmlFor="coverPic" className="picOption">
                  <InsertPhotoIcon fontSize="large" className="CoverIcon"/>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="coverPic"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setCoverPic(e.target.files[0])}
                    />
                </label>}
              </div>
              <div className="profilePicBox">
                  <img
                    className="profileUserImg"
                    src={
                      creator.profilePicture
                        ? PF + creator.profilePicture
                        : PF + "noAvatar.png"
                    }
                    alt="profile pic"
                  />
                  {user._id === creator._id && 
                  <label htmlFor="profilePic" className="picOption">
                  <InsertPhotoIcon fontSize="large" className="profileIcon"/>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="profilePic"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>}
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{creator.username}</h4>
              <span className="profileInfoDesc">{creator.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <ProfileFeed userId={id} filteredPost={filteredPost} user={user}/>
            {window.innerWidth <= "768px" 
              ? 
              <ProfileLeftbarMobile 
                user={creator} 
                leftMobile={leftMobile} 
                setLeftMobile={setLeftMobile}/> 
              : 
              <ProfileLeftbar user={user} creator={creator} />
            }
          </div>
        </div>
        </div>
      </div>
      </div>
      }
    </>
  );
}
