import React, { useState } from "react";
import NodesPanel from "./components/NodesPanel";
import ChatFlow from "./components/ChatFlow";
import SaveFlow from "./components/SaveFlow";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

function App() {
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  return (
    <React.Fragment>
      <SaveFlow setIsSaveClicked={setIsSaveClicked} />
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          <ChatFlow
            isSaveClicked={isSaveClicked}
            setIsSaveClicked={setIsSaveClicked}
          />
          <NodesPanel />
        </div>
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
