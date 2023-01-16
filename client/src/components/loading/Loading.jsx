import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import './loading.css';
const Loading = () => {
  return (
    <div className="loadingBox">
        <CircularProgress style={{color: "#ff8181", width: "10%", height: "10%"}}/>
        <h4 className="loadingText">در حال بارگذاری</h4>
    </div>
  )
}

export default Loading