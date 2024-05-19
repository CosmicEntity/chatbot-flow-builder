import { updateEdge } from "reactflow";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const chatFlowStore = (set) => ({
  nodesList: [],
  edgesList: [],
  updateNodes: (nodes) => {
    set(() => ({
      nodesList: nodes,
    }));
  },
  updateEdges: (edges) => {
    set(() => ({
      edgesList: edges,
    }));
  },
});

const useChatFlowStore = create(
  devtools(persist(chatFlowStore, { name: "chat-flow" }))
);

export default useChatFlowStore;
