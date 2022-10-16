import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";
import { initSocket } from "../socket.js";
import ACTIONS from "../actions.js";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection_error", err => handleError(err));
      socketRef.current.on("connection_failed", err => handleError(err));
      function handleError(e) {
        console.log("SOCKET ERROR", e);
        toast.error("Socket error occured! Please try again later.");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: roomId,
        username: location.state ? location.state.username : "Annonymous"
      });
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            console.log(`${username} joined`);
            toast.success(`${username} has joined the room.`);
          }

          setClients(clients);
          //console.log(clients);
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients(prev => {
          return prev.filter(client => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      //socketRef.current.disconnect();
      //socketRef.current.off(ACTIONS.JOINED);
      //socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
    toast.error("Logged out from the colab room.");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <div>
              <img className="logoImage" src="/logo1.png" alt="logo" />
            </div>
            <div className="logoText">
              <strong>C</strong>ode <strong>C</strong>olab
            </div>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map(client => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor socketRef={socketRef} roomId={roomId}></Editor>
      </div>
    </div>
  );
};

export default EditorPage;
