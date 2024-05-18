import React from "react";

const SaveFlow = ({ setIsSaveClicked }) => {
  const handleClick = () => {
    setIsSaveClicked(true);
  };
  return (
    <div className=" h-[6vh] border-b border-gray-300 flex justify-end items-center">
      <button
        className=" text-blue-300 bg-white text-xs font-bold  border-2 border-blue-300 p-2 mr-20 rounded-md hover:text-blue-400 hover:border-blue-400"
        onClick={handleClick}
      >
        Save Changes
      </button>
    </div>
  );
};

export default SaveFlow;
