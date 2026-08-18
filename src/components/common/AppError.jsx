import { useEffect } from "react";
import { useRouteError } from "react-router-dom";

export default function AppError() {
  const error = useRouteError();

  useEffect(() => {
    if (
      error?.message?.includes(
        "Failed to fetch dynamically imported module"
      )
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1>حدث خطأ... جاري إعادة تحميل الصفحة</h1>
    </div>
  );
}