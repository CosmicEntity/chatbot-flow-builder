import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  MarkerType,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDrop } from "react-dnd";
import useChatFlowStore from "../store/ChatFlowStore";

import TextNode from "../node types/TextNode";

const nodeTypes = { text: TextNode };

const ChatFlow = ({ isSaveClicked, setIsSaveClicked }) => {
  const { nodesList, edgesList, addNode, updateNodes, updateEdges } =
    useChatFlowStore((state) => ({
      nodesList: state.nodesList,
      edgesList: state.edgesList,
      addNode: state.addNode,
      updateNodes: state.updateNodes,
      updateEdges: state.updateEdges,
    }));

  const [nodes, setNodes] = useState(nodesList);
  const [edges, setEdges] = useState(edgesList);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "text",
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: Math.random().toString(),
          type: "text",
          position: {
            x: clientOffset.x,
            y: clientOffset.y,
          },
          data: { label: "Click to Edit Message" },
        },
      ]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  if (isSaveClicked) {
    updateNodes(nodes);
    updateEdges(edges);
    setIsSaveClicked(false);
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((nds) => applyEdgeChanges(changes, nds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      // Check if the target node already has an incoming edge;
      const targetNode = nodes.find((node) => node.id === params.target);
      console.log(targetNode);
      // If the target node already has an incoming edge, return early to prevent multiple sources
      if (targetNode.data.incomingEdge) {
        return;
      }

      // Set the incomingEdge property for the target node
      targetNode.data.incomingEdge = true;

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              strokeWidth: 2,
            },
          },
          eds
        )
      );
    },
    [nodes, edges, setEdges]
  );

  return (
    <div style={{ width: "80vw", height: "94vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        preventScrolling={false}
        ref={drop}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ChatFlow;
