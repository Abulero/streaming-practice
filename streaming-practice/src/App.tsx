/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./App.css";

function App() {
  const [displayData, setData] = useState("");
  const [locked, setLocked] = useState(false);
  const socket = new WebSocket("ws://localhost:8080/");

  let currentData = "";

  socket.onmessage = ({ data }) => {
    let socketData: string = data;

    setLocked(true);

    if (socketData.includes("[DONE]")) {
      setLocked(false);

      socketData = socketData.replace("[DONE]", "");
    }

    currentData += socketData;

    setData(currentData);
  };

  return (
    <div className="container">
      <h1>Data Streaming</h1>
      <p className="dataViewer">{displayData}</p>
      <div className="button-container">
        <button
          className="streaming-button"
          onClick={() => {
            currentData = "";
            socket.send("Start");
          }}
          disabled={locked}
        >
          {locked ? "Streaming..." : "Start data stream"}
        </button>
        <button
          className="streaming-button-red"
          onClick={() => {
            if (locked) {
              socket.send("Stop");
              setLocked(false);
            } else {
              currentData = "";
              setData("");
            }
          }}
        >
          {locked ? "Stop" : "Clear"}
        </button>
      </div>
    </div>
  );
}

export default App;
