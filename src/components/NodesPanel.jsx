import React from "react";
import TextNodeTile from "../node tiles/TextNodeTile";

const NodesPanel = () => {
  return (
    <div className="border-l border-gray-300 w-[20vw]  ">
      {/*Type of Node */}
      <TextNodeTile />
    </div>
  );
};

export default NodesPanel;
