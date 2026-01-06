// src/lib/notify.js
export const playNotificationSound = () => {
  if (typeof window === "undefined") return;
  const audio = new Audio("/notify.mp3");
  audio.play().catch(() => {
    console.log("Notification sound blocked by browser");
  });
};
