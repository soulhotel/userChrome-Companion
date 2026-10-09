import { useState, useEffect } from "react";

const PING_TIMEOUT_MS = 2000;

export function useConnection() {
  const [connected, setConnected] = useState(null);
  const [bridgeVersion, setBridgeVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [pingAttempt, setPingAttempt] = useState(0);

  useEffect(() => {
    let timeoutId;
    function handleConnected(e) {
      clearTimeout(timeoutId);
      setConnected(true);
      setBridgeVersion(e.detail?.version || null);
    }
    document.addEventListener("uccSupportConnected", handleConnected);
    timeoutId = setTimeout(() => setConnected(false), PING_TIMEOUT_MS);
    document.dispatchEvent(new CustomEvent("uccPing", { bubbles: true }));
    return () => {
      document.removeEventListener("uccSupportConnected", handleConnected);
      clearTimeout(timeoutId);
    };
  }, [pingAttempt]);

  function retryConnection() {
    setConnected(null);
    setDismissed(false);
    setPingAttempt((n) => n + 1);
  }

  function dismissConnection() {
    setDismissed(true);
  }

  return { connected, bridgeVersion, dismissed, retryConnection, dismissConnection };
}