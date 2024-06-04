"use client";
import React, { useEffect, useState } from "react";
import Movies from "./Movies/Movies";
import useUser from "../hooks/useUser";

function HomeScreen() {
  const [signedIn, setsignedIn] = useState(false);

  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      setsignedIn(!!user);
    }
  }, [loading, user]);
  return (
    <div>
      {signedIn ? <Movies /> : <div className="bg-header h-screen"></div>}
    </div>
  );
}

export default HomeScreen;
