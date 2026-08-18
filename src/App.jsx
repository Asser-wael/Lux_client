import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import { router } from "./routes/AppRoutes.jsx";
import Loading from "./components/common/Loading.jsx";
import { subscribeToPush } from "./utils/pushSubscribe.js";
import useSocket from "./hooks/useSocket.js";
import { playSound, sounds } from "./utils/playSound.js";
import { showToast } from "./utils/showToast.jsx";
import { getUser } from "./features/auth/authSlice.js";
import { getCart } from "./features/cart/cartSlice.js";
import { addOrder } from "./features/order/orderSlice.js";

function App() {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (accessToken != null) {
      dispatch(getUser());
    }
  }, [accessToken, dispatch]);
  useEffect(() => {
    if (socket && localStorage.getItem("userOrder")) {
      socket.emit("userOrder", localStorage.getItem("userOrder"));
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (order) => {
      playSound?.(sounds.newOrder);

      showToast({
        type: "adminOrder",
        message: `New order received from ${order.shippingAddress.fullName}`,
      });

      socket.emit("userOrder", order._id);

      localStorage.setItem("userOrder", `userOrder-${order._id}`)

      dispatch(addOrder(order))
    };

    const handleWarning = (data) => {
      playSound?.(sounds.lowStock);

      showToast({
        type: "lowStock",
        message: `${data.name} is running low on stock (${data.color} - ${data.size})`,
      });
    };

    const handleOrderStatus = (data) => {
      playSound?.(sounds.orderStatus);

      showToast({
        type: "orderStatus",
        message: `Order status updated to ${data.status}`,
      });
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("warning", handleWarning);
    socket.on("orderStatus", handleOrderStatus);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("warning", handleWarning);
      socket.off("orderStatus", handleOrderStatus);
    };
  }, [socket]);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      subscribeToPush();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin" && socket) {
      socket.emit("admin");
    }
  }, [user, socket]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 24,
          right: 24,
        }}
        toastOptions={{
          duration: 4000,
        }}
      />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;