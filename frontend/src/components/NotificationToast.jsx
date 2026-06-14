import React from "react";

const NotificationToast = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`glass-card notification-toast ${notification.type}`} style={{
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 9999,
      padding: "16px 24px",
      background: notification.type === "error" ? "rgba(239, 68, 68, 0.95)" : "rgba(16, 185, 129, 0.95)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "white",
      borderRadius: "12px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      {notification.type === "error" ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span style={{ fontWeight: 600, fontSize: "14px" }}>{notification.message}</span>
    </div>
  );
};

export default NotificationToast;
