import { createContext, useContext, useReducer } from "react";
import { reducer } from "../global/reducer";
import { initialState } from "./initialState";
import { defaultConfig } from "./config";
import { useHydration } from "./storage";
import { usePrefBridge } from "../global/usePrefBridge";
import { useTreeSync } from "../global/useTreeSync";

export const StateContext = createContext(null);
export const DispatchContext = createContext(null);
export const ConfigContext = createContext(null);
export const ResetContext = createContext(null);

export function useStateReducer() {
  return useReducer(reducer, initialState);
}

export function useConfigReducer() {
  return useReducer((c, patch) => ({ ...c, ...patch }), defaultConfig);
}

export const useAppState = () => useContext(StateContext);
export const useAppDispatch = () => useContext(DispatchContext);
export const useConfig = () => useContext(ConfigContext);
export const useResetEverything = () => useContext(ResetContext);

export function AppProvider({ children }) {
  const [state, dispatch] = useStateReducer();
  const [config, patchConfig] = useConfigReducer();

  const { loaded, hydratedTreeRef } = useHydration({ dispatch, patchConfig, state, config });
  usePrefBridge({ state, dispatch, loaded, hydratedTreeRef });
  useTreeSync({ state, dispatch, config, patchConfig, loaded });
  
  async function resetEverything() {
    dispatch({ type: "APPLY_PRESET", payload: { optionsByPref: {}, itemsById: {}, rootOrder: [] } });
    patchConfig({ ...defaultConfig, hasOnboarded: false });
  }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ConfigContext.Provider value={[config, patchConfig]}>
          <ResetContext.Provider value={resetEverything}>{children}</ResetContext.Provider>
        </ConfigContext.Provider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}