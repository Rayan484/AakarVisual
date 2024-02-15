import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import Link from "next/link";
function NavBar(props: any) {
  return (
    <Navbar bg="transparent box-shadow" className={styles.navbar} expand="lg">
      <Container>
        <Link className={`${styles.navbarbrand} ${styles.navlink}`} href="/">
          AAkar
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="p-2">
            <Link
              className={`m-2 ${styles.navlink}`}
              aria-current="page"
              href="/"
            >
              HOME
            </Link>
            <Link className={`m-2 ${styles.navlink}`} href="/about">
              ABOUT
            </Link>
            <Link className={`m-2 ${styles.navlink}`} href="/contact">
              CONTACT US
            </Link>
            <Link className={`m-2 ${styles.navlink}`} href="/colorvisualiser">
              COLOR VISUALISER{" "}
            </Link>
            <a
              className={`m-2 ${styles.navlink} ${styles.github}`}
              href="https://github.com/omseervi098/Aakar-SAM"
              target="_blank"
              rel="noopener"
            >
              GITHUB&nbsp;
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
//   return (
//     <Navbar bg="transparent" expand="lg">
//       <Container>
//         <NavLink className="navbar-brand" href="/">
//           InDesign
//         </NavLink>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
//           <Nav className="p-2">
//             <NavLink className="nav-link m-2" aria-current="page" exact href="/">
//               HOME
//             </NavLink>
//             <NavLink className="nav-link m-2" href="/about">
//               ABOUT
//             </NavLink>

//             <NavLink className="nav-link m-2" href="/contact">
//               CONTACT
//             </NavLink>

//             <NavLink className="nav-link m-2" href="/contact">
//               CONTACT US
//             </NavLink>
//             <NavLink className="nav-link m-2" href="/view">
//               360° View
//             </NavLink>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

export default NavBar;
