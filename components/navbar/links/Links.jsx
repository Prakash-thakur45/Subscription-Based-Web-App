"use client";

import { useState } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/navLink";
import { handleLogout } from "../../../lib/action";
import { Button } from "../../ui/button";

const links = [
  // {
  //   title: "Homepage",
  //   path: "/",
  // },
];

const Links = ({session}) => {
  console.log(session);

  // TEMPORARY
  // const session = true;
  // const isAdmin = true;

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink item={link} key={link.title} />
        ))}
        {session?.user ? (
          <>
            {/* {session.user?.isAdmin && <NavLink item={{ title: "Admin", path: "/admin" }} />} */}
            <form action={handleLogout}>
              <button className={styles.logout}>Logout</button>
              {/* <Button >Logout</Button> */}
            </form>
          </>
        ) : (
          <NavLink item={{ title: "Login", path: "/login" }} />
        )}
      </div>
    </div>
  );
};

export default Links;