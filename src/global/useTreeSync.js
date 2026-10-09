import { useEffect, useRef } from "react";

const TREE_CHANNEL = "ucc-tree-sync";
const CONFIG_CHANNEL = "ucc-config-sync";

export function useTreeSync({ state, dispatch, config, patchConfig, loaded }) {
  const treeChannelRef = useRef(null);
  const configChannelRef = useRef(null);
  const ignoreNextTreeRef = useRef(false);
  const ignoreNextConfigRef = useRef(false);

  useEffect(() => {
    const treeChannel = new BroadcastChannel(TREE_CHANNEL);
    treeChannelRef.current = treeChannel;
    treeChannel.onmessage = (e) => {
      ignoreNextTreeRef.current = true;
      dispatch({ type: "SYNC_TREE", payload: e.data });
    };

    const configChannel = new BroadcastChannel(CONFIG_CHANNEL);
    configChannelRef.current = configChannel;
    configChannel.onmessage = (e) => {
      ignoreNextConfigRef.current = true;
      patchConfig(e.data);
    };

    return () => {
      treeChannel.close();
      configChannel.close();
    };
  }, [dispatch, patchConfig]);

  useEffect(() => {
    if (!loaded) return;
    if (ignoreNextTreeRef.current) {
      ignoreNextTreeRef.current = false;
      return;
    }
    treeChannelRef.current?.postMessage({
      optionsByPref: state.optionsByPref,
      itemsById: state.itemsById,
      rootOrder: state.rootOrder,
    });
  }, [state.optionsByPref, state.itemsById, state.rootOrder, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (ignoreNextConfigRef.current) {
      ignoreNextConfigRef.current = false;
      return;
    }
    configChannelRef.current?.postMessage(config);
  }, [config, loaded]);
}