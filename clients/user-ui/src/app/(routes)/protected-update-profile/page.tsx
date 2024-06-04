"use client";

import React from "react";
import withAuth from "@/src/components/hoc/withAuth";
import UpdateProfile from "@/src/views/User/UpdateProfile";

const page = () => {
  return (
    <div>
      <UpdateProfile />
    </div>
  );
};

export default withAuth(page);
