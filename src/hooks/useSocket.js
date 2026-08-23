// hooks/useSocket.js
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function useSocket() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      auth: {
        token: accessToken, // ✅ ده اللي io.use() هيقراه
      },
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [accessToken]);

  return socket;
}