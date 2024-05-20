import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  MarkerType,
  Controls,
  useViewport,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDrop } from "react-dnd";
import useChatFlowStore from "../store/ChatFlowStore";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextNode from "../node types/TextNode";

const nodeTypes = { text: TextNode }; //Custom Node Type Registration

const ChatFlow = ({
  isSaveClicked,
  setIsSaveClicked,
  setShowSettings,
  setNodesData,
  setNodeData,
}) => {
  //Fetching State from Zustand Store
  const { nodesList, edgesList, updateNodes, updateEdges } = useChatFlowStore(
    (state) => ({
      nodesList: state.nodesList,
      edgesList: state.edgesList,
      updateNodes: state.updateNodes,
      updateEdges: state.updateEdges,
    })
  );

  const { x, y, zoom } = useViewport(); //Viewport State to get origin of reactflow component
  const xRef = useRef(x);
  const yRef = useRef(y);
  const zoomRef = useRef(zoom);

  const [nodes, setNodes] = useState(nodesList);
  const [edges, setEdges] = useState(edgesList);

  //Dropping Text Nodes in ReactFlow
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "text",
    drop: (item, monitor) => {
      //----------------node position calculation inside reactflow-------------------
      const clientOffset = monitor.getClientOffset();
      const bounds = reactFlowRef.current.getBoundingClientRect();
      const currentX = xRef.current;
      const currentY = yRef.current;
      const currentZoom = zoomRef.current;
      const zoomAdjustedClientX = (clientOffset.x - bounds.left) / currentZoom;
      const zoomAdjustedClientY = (clientOffset.y - bounds.top) / currentZoom;
      let zoomAdjustedX = -currentX / currentZoom;
      let zoomAdjustedY = -currentY / currentZoom;
      //------------- -----------------------------------------------------------
      setNodes((prevNodes) => {
        if (prevNodes.length === 0) {
          return [
            {
              id: uuidv4(),
              type: "text",
              position: {
                x: zoomAdjustedX + zoomAdjustedClientX,
                y: zoomAdjustedY + zoomAdjustedClientY,
              },
              data: {
                label: "Message",
                content: "Placeholder Text",
                incomingEdge: true,
              },
            },
          ];
        }

        return [
          ...prevNodes,
          {
            id: uuidv4(),
            type: "text",
            position: {
              x: zoomAdjustedX + zoomAdjustedClientX,
              y: zoomAdjustedY + zoomAdjustedClientY,
            },
            data: { label: "Message", content: "Placeholder Text" },
          },
        ];
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  //To get latest position of pointer inside drop area
  useEffect(() => {
    xRef.current = x;
    yRef.current = y;
    zoomRef.current = zoom;
  }, [x, y, zoom]);

  //To check if all nodes are connected & save the state
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
          autoClose: 3000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "colored",
        });
        setIsSaveClicked(false);
      } else {
        toast.success("Changes saved successfully", {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "colored",
        });

        updateNodes(nodes);
        updateEdges(edges);
        setIsSaveClicked(false);
      }
    }
  }, [isSaveClicked]);

  //To update state when nodes are edited in settings panel
  useEffect(() => {
    setNodes(nodesList);
  }, [nodesList]);

  const reactFlowRef = useRef(null);

  //-----------------------reactflow utility functions to change state of nodes and edges--------------------------
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
  //--------------------------------------------------------------------------------------------------------------

  return (
    <div style={{ width: "80vw", height: "94vh" }} ref={reactFlowRef}>
      <ReactFlow
        ref={drop}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        preventScrolling={false}
        onNodeClick={(e, node) => {
          setNodesData(nodes);
          setNodeData(node);
          setShowSettings(true);
        }}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ChatFlow;
