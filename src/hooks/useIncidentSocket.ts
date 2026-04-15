import { useEffect } from "react";

export function useIncidentSocket(onMessage: (data: any) => void) {
  useEffect(() => {
    // Dummy websocket simulation (replace later with real backend)
    const interval = setInterval(() => {
      const fakeData = {
        id: Date.now().toString(),
        lat: 23.81,
        lng: 90.41,
        type: "Live Alert",
        description: "New incident from socket",
      };

      onMessage(fakeData);
    }, 15000);

    return () => clearInterval(interval);
  }, [onMessage]);
}