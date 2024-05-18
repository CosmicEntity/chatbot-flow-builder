import React, { useCallback, useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      setNodes((prevNodes) => {
        if (prevNodes.length === 0) {
          return [
            {
              id: uuidv4(),
              type: "text",
              position: {
                x: clientOffset.x,
                y: clientOffset.y,
              },
              data: { label: "Click to Edit Message", incomingEdge: true },
            },
          ];
        }

        return [
          ...prevNodes,
          {
            id: uuidv4(),
            type: "text",
            position: {
              x: clientOffset.x,
              y: clientOffset.y,
            },
            data: { label: "Click to Edit Message" },
          },
        ];
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (isSaveClicked) {
      let allNodesConnected = true;
      nodes.forEach((node) => {
        if (!node.data.incomingEdge) {
          allNodesConnected = false;
          return;
        }
      });

      if (!allNodesConnected) {
        toast.error("Node(s) not connected", {
          position: "top-center",
        });
        setIsSaveClicked(false);
      } else {
        toast.success("Changes saved successfully", {
          position: "top-center",
        });

        updateNodes(nodes);
        updateEdges(edges);
        setIsSaveClicked(false);
      }
    }
  }, [isSaveClicked]);

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
