import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = e => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Please make sure to give Room ID & username.");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username
      }
    });
  };

  const handleInputEnter = e => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="imageAndText">
          <img
            className="homePageLogo"
            src="./logo1.png"
            alt="code-colab-logo"
          />
          <div className="textPart">
                <div className="mainText"><strong>C</strong>ode<strong>C</strong>olab</div>
                <div className="secText">Real-Time Code Colaboration tool</div>
          </div>
        </div>
        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="Room ID"
            onChange={e => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="/" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built by <span>Raj</span>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
