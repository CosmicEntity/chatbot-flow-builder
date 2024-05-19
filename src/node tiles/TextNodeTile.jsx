import React, { useRef } from "react";
import { ReactSVG } from "react-svg";
import MessageIcon from "../assets/icons/message.svg";
import { useDrag } from "react-dnd";
import "./NodeTiles.css";

const TextNodeTile = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "text",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  //------------------------ Tile Hover Effect-----------------------------------------------------

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
    <div
      className="h-16 w-32 m-2 border-2 border-blue-300 rounded-md flex flex-col justify-center items-center hover:cursor-pointer node-tile bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={drag}
    >
      <ReactSVG
        src={MessageIcon}
        ref={svgRef}
        beforeInjection={(svg) => {
          svgRef.current = svg;
          svg.setAttribute(
            "style",
            "width: 24px; height: 24px; stroke: #93C5FD;"
          );
        }}
      />
      <p className="text-sm text-blue-300">Message</p>
    </div>
  );
};

export default TextNodeTile;
