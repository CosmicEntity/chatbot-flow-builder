import React, { useEffect, useRef, useState } from "react";
import ArrowLeft from "../assets/icons/arrowLeft.svg";
import useChatFlowStore from "../store/ChatFlowStore";

import { ReactSVG } from "react-svg";

const SettingsPanel = ({
  nodeData,
  setShowSettings,
  isSaveClicked,
  setIsSaveClicked,
}) => {
  const [message, setMessage] = useState(nodeData?.data?.content);
  const [updatedNodes, setUpdatedNodes] = useState([]);

  const { nodesList, updateNodes } = useChatFlowStore((state) => ({
    nodesList: state.nodesList,
    updateNodes: state.updateNodes,
  }));

  useEffect(() => {
    if (isSaveClicked) {
      updateNodes(updatedNodes);
      setIsSaveClicked(false);
    }
  }, [isSaveClicked]);

  //   ------------------------ Updating Edited Node ---------------------------------------------------------

  const handleNodeUpdate = () => {
    setUpdatedNodes(
      nodesList.map((node) => {
        if (node.id === nodeData.id) {
          return {
            ...node,
            data: {
              ...node.data,
              content: message,
            },
          };
        }
        return node;
      })
    );
    setIsSaveClicked(true);
  };

  // -----------------------------------------------------------------------------------------------------

  //------------------------ Arrow Hover Effect-----------------------------------------------------

  const svgRef = useRef(null);
  const handleMouseEnter = () => {
    if (svgRef.current) {
      svgRef.current.style.stroke = "#60A5FA";
    }
  };
  const handleMouseLeave = () => {
    if (svgRef.current) {
      svgRef.current.style.stroke = "#93C5FD";
    }
  };
  // -----------------------------------------------------------------------------------------------------

  return (
    <div className="border-l border-gray-300 w-[20vw]">
      <div className="h-[6vh] border-b border-gray-300 flex justify-center items-center">
        <div
          className="hover:cursor-pointer flex-1 p-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowSettings(false)}
        >
          <ReactSVG
            src={ArrowLeft}
            ref={svgRef}
            beforeInjection={(svg) => {
              svgRef.current = svg;
              svg.setAttribute(
                "style",
                "width: 18px; height: 24px; stroke: #93C5FD;"
              );
            }}
          />
        </div>
        <div className="font-semibold text-sm flex-auto">
          {nodeData.data.label}
        </div>
      </div>
      <div className="h-[20vh] border-b border-gray-300 flex flex-col justify-center items-center">
        <label htmlFor="message" className="text-sm text-gray-400 w-[80%] mb-1">
          Text:
        </label>
        <textarea
          id="message"
          className="border-2 border-gray-300 w-[80%] h-16 overflow-auto"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onBlur={handleNodeUpdate}
        ></textarea>
      </div>
    </div>
  );
};

export default SettingsPanel;
