import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
} from "../../redux/features/authFeature";
import { ShowLogin, ShowLogout } from "../hiddenLink/hiddenLink";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "../../redux/features/cartFeature";

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        GAME<span>Shop</span>
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState("");
  const [scrollPage, setScrollPage] = useState(false);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fixNavBar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };

  window.addEventListener("scroll", fixNavBar);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName === null) {
          const emailCutted = user.email.indexOf("@");
          const user1 = user.email.substring(0, emailCutted);
          const userName = user1[0].toUpperCase() + user1.slice(1);
          setName(userName);
        } else {
          setName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName,
            userId: user.uid,
          })
        );
      } else {
        setName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, name]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart
        <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  );

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}

        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-menu"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>
          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>
            <AdminOnlyLink>
              <Link to="/admin/home">
                <li>
                  <button className="--btn --btn-primary">Admin</button>
                </li>
              </Link>
            </AdminOnlyLink>
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact us
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              <ShowLogin>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              </ShowLogin>
              <ShowLogout>
                <a href="#home">
                  <FaUserCircle size={16} />
                  Welcome {name}
                </a>
                <NavLink to="/order-history" className={activeLink}>
                  My Orders
                </NavLink>
                <NavLink to="/" onClick={logoutUser}>
                  Logout
                </NavLink>
              </ShowLogout>
            </span>
            {cart}
          </div>
        </nav>

        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenu size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
}

export default Header;
