import React, { useState } from "react";
import ChatFlow from "./components/ChatFlow";
import SaveFlow from "./components/SaveFlow";
import NodesPanel from "./components/NodesPanel";
import SettingsPanel from "./components/SettingsPanel";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import { ReactFlowProvider } from "reactflow";
import "./App.css";

function App() {
  const [isSaveClicked, setIsSaveClicked] = useState(false); // to check if save button is clicked & pass the state to ChatFlow to save nodes state
  const [showSettings, setShowSettings] = useState(false); // To show settings panel when node is clicked
  const [nodeData, setNodeData] = useState({}); //stores state of clicked node & sends it to SettingsPanel
  const [nodesData, setNodesData] = useState([]); //stores state of all nodes & sends it to SettingsPanel to be updated
  return (
    <React.Fragment>
      {/* Save button */}
      <SaveFlow setIsSaveClicked={setIsSaveClicked} />
      {/* Proveds Drag and Drop Functionality */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          {/* Provides reactflow internal hooks */}
          <ReactFlowProvider>
            {/* reactlow Component */}
            <ChatFlow
              isSaveClicked={isSaveClicked}
              setIsSaveClicked={setIsSaveClicked}
              setShowSettings={setShowSettings}
              setNodeData={setNodeData}
              setNodesData={setNodesData}
            />
          </ReactFlowProvider>
          {showSettings ? (
            //Shows Settings Panel to edit node content
            <SettingsPanel
              nodeData={nodeData}
              nodesData={nodesData}
              setShowSettings={setShowSettings}
              isSaveClicked={isSaveClicked}
              setIsSaveClicked={setIsSaveClicked}
            />
          ) : (
            //Shows types of node available, currently only text message node is available
            <NodesPanel />
          )}
        </div>
        <ToastContainer />
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
