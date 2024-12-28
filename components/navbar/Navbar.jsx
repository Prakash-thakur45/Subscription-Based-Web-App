import Link from "next/link";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import { auth } from "../../lib/auth";
import Image from "next/image";
import Logo from "../icons/Logo";
import NavLink from "./links/navLink/navLink";
const Navbar = async () => {
  const session = await auth();
  // console.log(session);
  return (
    <div className={styles.container}>
      <div className="ml-10">
        {/* <Link  href='/' className={styles.logo}><Logo/></Link> */}
        <Link href="/" className={styles.logo}>
          Logo
        </Link>

        {/* <nav className="ml-6 space-x-2 lg:block"> */}

        <NavLink item={{ title: "Pricing", path: "/" }}></NavLink>
        {session && (
          <NavLink item={{ title: "Account", path: "/account" }}>
            Account
          </NavLink>
        )}
        {/* </nav> */}
      </div>
      <div>
        <Links session={session} />
      </div>
    </div>
  );
};

export default Navbar;
