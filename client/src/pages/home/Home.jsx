import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Leftbar from "../../components/leftbar/Leftbar";
import "./home.css"
import { useState } from "react";

export default function Home({user}) {

  document.title = "صفحه اصلی"

  const [filteredPost, SetFilteredPost] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [veganItems, setVeganItems] = useState([]);
  const [rightMobile, setRightMobile] = useState(false);
  const [leftMobile, setLeftMobile] = useState(false);

  return (
    <>
      <Topbar user={user}/>
      <div className="homeContainer">
        <Sidebar 
          filteredPost={filteredPost} 
          SetFilteredPost={SetFilteredPost}
          rightMobile={rightMobile}
          setRightMobile={setRightMobile}
          user={user}
        />
        <Feed
          filteredPost={filteredPost} 
          favoriteItems = {favoriteItems}
          topItems={topItems}
          veganItems={veganItems}
          leftMobile={leftMobile}
          rightMobile={rightMobile}
          setRightMobile={setRightMobile}
          setLeftMobile={setLeftMobile}
          user={user}/>
        <Leftbar 
          setFavoriteItems={setFavoriteItems} 
          setTopItems={setTopItems} 
          setVeganItems={setVeganItems}
          leftMobile={leftMobile}
          setLeftMobile={setLeftMobile}
          user={user}/>
      </div>
    </>
  );
}
