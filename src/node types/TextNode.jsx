import React from "react";
import MessageIcon from "../assets/icons/message.svg";
import WhatsappIcon from "../assets/icons/whatsapp.svg";
import { Handle, Position } from "reactflow";

const TextNode = ({ data }) => {
  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <div className=" w-[250px] shadow-2xl rounded-md">
        <div className="h-6 bg-green-200 rounded-t-md flex justify-between">
          <h3 className="text-sm font-bold">
            <img
              src={MessageIcon}
              alt="message icon"
              className="w-3 h-3 m-1 inline"
            />
            Send Message
          </h3>
          <div className="bg-white rounded-full w-4 h-4 m-1 flex justify-center items-center ">
            <img src={WhatsappIcon} alt="whatsapp icon" className="w-3 h-3" />
          </div>
        </div>
        <div className=" h-10 bg-white rounded-b-md overflow-y-scroll">
          <p className="mx-2 text-sm">{data.content}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TextNode;
