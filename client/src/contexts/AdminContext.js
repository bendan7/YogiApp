import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useMeetingsContext } from "./MeetingContext";

const AdminContext = React.createContext();

export function useAdminContext() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const { currentUser, GetAuthHeader } = useAuth();

  //upcoming meetings list
  const { meetings } = useMeetingsContext();

  async function NewMeeting(meeting) {
    var headers = await GetAuthHeader();
    headers.method = "post";

    return fetch(
      `http://localhost:5001/nof-app-dev/europe-west3/app/meetings`,
      headers,
      JSON.stringify({ x: 5 })
    );
  }

  useEffect(() => {}, []);

  const value = {
    meetings,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
