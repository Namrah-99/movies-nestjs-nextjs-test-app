"use client";
import React, { useEffect, useState } from "react";

import NavItems from "../NavItems";
import ProfileDropDown from "../ProfileDropDown";
import styles from "@/src/utils/styles";
import useUser from "@/src/hooks/useUser";

function Header() {
  const [signedIn, setsignedIn] = useState(false);
  const { user, loading } = useUser();
  useEffect(() => {
    if (!loading) {
      setsignedIn(!!user);
    }
  }, [loading, user]);
  return (
    <div>
      <header className="w-full bg-[#00000027]">
        <div className="w-[90%] m-auto h-[80px] flex items-center justify-between">
          <h1 className={`${styles.logo}`}>
            {user?.name ||
              "Movies Test App (Nest JS, GraphQL, Apollo Federation, Prisma, PostgreSQL, Next JS)"}
          </h1>
          {signedIn && <NavItems />}
          <ProfileDropDown
            signedIn={signedIn}
            setsignedIn={setsignedIn}
            user={user}
          />
        </div>
      </header>
    </div>
  );
}

export default Header;
