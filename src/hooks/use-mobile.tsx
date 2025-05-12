import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Проверяем доступность window при SSR
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  React.useEffect(() => {
    // Добавляем проверку доступности window для SSR
    if (typeof window === "undefined") return;

    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Используем ResizeObserver вместо медиа-запроса для лучшей поддержки
    const resizeObserver = new ResizeObserver(() => {
      checkMobile();
    });

    resizeObserver.observe(document.body);

    // Резервный вариант для устройств, не поддерживающих ResizeObserver
    window.addEventListener("resize", checkMobile);

    // Проверяем немедленно при монтировании
    checkMobile();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}
