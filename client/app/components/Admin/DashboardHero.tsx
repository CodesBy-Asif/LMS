"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import ThemeToggle from "@/app/components/ThemeToggle";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  useGetAllNotificationQuery,
  useMarkNotificationReadMutation,
} from "@/redux/features/Notifiaction/notificationApi";
type Notification = {
  _id: string;
  message: string;
  title: string;
  status: "read" | "unread";
  userId: string;
};

const Header: FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useGetAllNotificationQuery({});
  const [markRead] = useMarkNotificationReadMutation();

  // Fetch notifications
  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data]);

  // Initialize Socket connection
  useEffect(() => {
    if (!user) return;

    const s = io("https://socket-dpdp.onrender.com/", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(s);
    s.on("connect", () => console.log("✅ Connected to socket:", s.id));
    s.on("disconnect", () => console.log("❌ Disconnected from socket"));

    s.on("newNotification", (data: any) => {
      console.log(data)

      const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.warn("Audio play blocked:", err));
console.log(data)
      setNotifications((prev) => [data, ...prev]);
      
    });

    return () => {
      s.off("newNotification");
      s.disconnect();
    };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markRead(id); // backend call
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
    } catch (error) {
      console.log("Failed to mark as read:", error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-end w-full px-6 py-3 bg-sidebar text-foreground shadow-sm relative">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Icon */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-accent/10 transition"
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5" />
            {notifications.some((n) => n.status === "unread") && (
              <span className="absolute top-1 right-1 block w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-border font-semibold text-sm">
                Notifications
              </div>

              <ul className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <li
                      key={note._id}
                      className={`p-3 hover:bg-accent/10 cursor-pointer text-sm transition ${
                        note.status === "read" ? "text-muted-foreground" : ""
                      }`}
                      onClick={() => handleMarkAsRead(note._id)}
                    >
                      {note.message}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-sm text-muted-foreground text-center">
                    No new notifications
                  </li>
                )}

                <li
                  className="p-3 text-sm text-muted-foreground text-center border-t border-border hover:bg-accent/5 cursor-pointer"
                  onClick={() => {
                    setIsFullscreen(true);
                    setIsOpen(false);
                  }}
                >
                  View all notifications
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* ✅ Fullscreen Notification View */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[999] flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">All Notifications</h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-accent/10 rounded-full"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div
                  key={note._id}
                  className={`p-4 border border-border rounded-xl shadow-sm cursor-pointer hover:bg-accent/5 transition ${
                    note.status === "read" ? "opacity-60" : ""
                  }`}
                  onClick={() => handleMarkAsRead(note._id)}
                >
                  <p className="font-medium">{note.title}</p>
                  <p className="text-sm text-muted-foreground">{note.message}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No notifications available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
