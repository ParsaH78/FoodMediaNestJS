import "./sidebar.css";
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseFriend from "../closeFriend/CloseFriend";
import {Link} from "react-router-dom";
import { useState } from "react";
import {FoodCategory} from "../../dummyData";
import Category from "./Category";
import { useDispatch } from "react-redux";
import {logout} from "../../actions/AuthActions";
import * as api from '../../api/index.js';


export default function Sidebar({filteredPost, SetFilteredPost, noCategory, rightMobile, setRightMobile, user}) {

  const dispatch = useDispatch();
  const [followers, setFollowers] = useState(true);
  const [friends, setFriends] = useState(true);
  const [isShow, setIsShow] = useState(true);
  const [isfollowersShow, setIsFollowersShow] = useState(true);
  const [isfollowingsShow, setIsFollowingsShow] = useState(true);
  const [categoryStyle, setCategoryStyle] = useState("categoryItems");
  const [followersStyle, setFollowersStyle] = useState("sidebarFriendList");
  const [followingsStyle, setFollowingsStyle] = useState("sidebarFriendList");

  const handleLogout = () => {
    dispatch(logout());
  }

  const showCategory = () => {
    setIsShow(!isShow);
    if (isShow) {
      setCategoryStyle(prev => prev.concat(" show"));
    } else {
      setCategoryStyle(prev => prev.replace(" show", ""));
    }
  }

  const showFollowers = async () => {
    try {
      const { data } = await api.getFollowers(user.id);
      setFollowers(data)
    } catch (error) {
      console.log("Error in getting followers : ",  error.response);
    }
    setIsFollowersShow(!isfollowersShow);
    if (isfollowersShow) {
      setFollowingsStyle(prev => prev.replace(" showFriendList", ""));
      setFollowersStyle(prev => prev.concat(" showFriendList"));
    } else {
      setFollowersStyle(prev => prev.replace(" showFriendList", ""));
    }
  }

  const showFollowings = async () => {
    try {
      const { data } = await api.getFollowings(user.id);
      setFriends(data)  
    } catch (error) {
      console.log("Error in getting followings : ",  error.response);
    }
    setIsFollowingsShow(!isfollowingsShow);
    if (isfollowingsShow) {
      setFollowersStyle(prev => prev.replace(" showFriendList", ""));
      setFollowingsStyle(prev => prev.concat(" showFriendList"));
    } else {
      setFollowingsStyle(prev => prev.replace(" showFriendList", ""));
    }
  }

  const RightMobileMenu = () => {
    setRightMobile(prev => !prev);
  }

  return (
    <>
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <HomeIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to="/" style={{textDecoration: "none", color: "black"}}>صفحه اصلی</Link></span>
          </li>
          <li className="sidebarListItem">
            <ChatIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to="/messenger" style={{textDecoration: "none", color: "black"}}> چت ها</Link></span>
          </li>
          <li className="sidebarListItem">
            <AccountCircleIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to={`/profile/${user.id}`} style={{textDecoration: "none", color: "black"}}>پروفایل</Link></span>
          </li>
          {!noCategory && 
          <li className="sidebarListItem sidebarCategory">
            <div className="sidebarListItemTitle">
              <CategoryIcon className="sidebarIcon" />
              <button className="sidebarListItemText categoryButton" onClick={showCategory}>دسته بندی ها</button>
            </div>
            <div className={categoryStyle}>
              <ul className="categoryItemsList">
                {FoodCategory.map(cat => (
                  <Category key={cat.id} cat={cat} filteredPost={filteredPost} SetFilteredPost={SetFilteredPost}/>
                ))}
              </ul>
            </div>
          </li>}

          <li className="sidebarListItem">
            <PersonIcon className="sidebarIcon" />
            <button className="sidebarListItemText categoryButton" onClick={showFollowers}>فالوور ها </button>
          </li>
          <li className="sidebarListItem">
            <PersonIcon className="sidebarIcon" />
            <button className="sidebarListItemText categoryButton" onClick={showFollowings}>فالویینگ ها </button>
          </li>
          <li className="sidebarListItem">
            <ExitToAppIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><button className="exit" onClick={handleLogout}>خروج از حساب کاربری</button></span>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <ul className={followingsStyle}>
          <h4 className="friendbarTitle">فالووینگ ها</h4>
          {friends && friends.length > 0 && friends.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
        <ul className={followersStyle}>
          <h4 className="friendbarTitle">فالوور ها</h4>
          {followers && followers.length > 0 && followers.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>

    
    <div className={rightMobile ? "mobile-nav is-active" : "mobile-nav"}>
      <button className={rightMobile ? "hamburger is-active" : "hamburger"} onClick={() => RightMobileMenu()}>
          <div className="bar"></div>
        </button>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <HomeIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to="/" style={{textDecoration: "none", color: "black"}}>صفحه اصلی</Link></span>
          </li>
          <li className="sidebarListItem">
            <ChatIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to="/messenger" style={{textDecoration: "none", color: "black"}}> چت ها</Link></span>
          </li>
          <li className="sidebarListItem">
            <AccountCircleIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><Link to={`/profile/${user._id}`} style={{textDecoration: "none", color: "black"}}>پروفایل</Link></span>
          </li>
          {!noCategory && 
          <li className="sidebarListItem sidebarCategory">
            <div className="sidebarListItemTitle">
              <CategoryIcon className="sidebarIcon" />
              <button className="sidebarListItemText categoryButton" onClick={showCategory}>دسته بندی ها</button>
            </div>
            <div className={categoryStyle}>
              <ul className="categoryItemsList">
                {FoodCategory.map(cat => (
                  <Category key={cat.id} cat={cat} filteredPost={filteredPost} SetFilteredPost={SetFilteredPost}/>
                ))}
              </ul>
            </div>
          </li>}

          <li className="sidebarListItem">
            <PersonIcon className="sidebarIcon" />
            <button className="sidebarListItemText categoryButton" onClick={showFollowers}>فالوور ها </button>
          </li>
          <li className="sidebarListItem">
            <PersonIcon className="sidebarIcon" />
            <button className="sidebarListItemText categoryButton" onClick={showFollowings}>فالویینگ ها </button>
          </li>
          <li className="sidebarListItem">
            <ExitToAppIcon className="sidebarIcon" />
            <span className="sidebarListItemText"><button className="exit" onClick={handleLogout}>خروج از حساب کاربری</button></span>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <ul className={followingsStyle}>
          <h4 className="friendbarTitle">فالووینگ ها</h4>
          {friends && friends.length > 0 && friends.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
        <ul className={followersStyle}>
          <h4 className="friendbarTitle">فالوور ها</h4>
          {followers && followers.length > 0 && followers.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}
