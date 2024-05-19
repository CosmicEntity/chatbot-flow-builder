import React, { useState } from "react";
import ChatFlow from "./components/ChatFlow";
import SaveFlow from "./components/SaveFlow";
import NodesPanel from "./components/NodesPanel";
import SettingsPanel from "./components/SettingsPanel";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [nodeData, setNodeData] = useState({});
  return (
    <React.Fragment>
      <SaveFlow setIsSaveClicked={setIsSaveClicked} />
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          <ChatFlow
            isSaveClicked={isSaveClicked}
            setIsSaveClicked={setIsSaveClicked}
            setShowSettings={setShowSettings}
            setNodeData={setNodeData}
            nodeData={nodeData}
          />
          {showSettings ? (
            <SettingsPanel
              nodeData={nodeData}
              setShowSettings={setShowSettings}
              isSaveClicked={isSaveClicked}
              setIsSaveClicked={setIsSaveClicked}
            />
          ) : (
            <NodesPanel />
          )}
        </div>
        <ToastContainer />
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
