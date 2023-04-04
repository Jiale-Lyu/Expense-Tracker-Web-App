import Link from "next/link";
import Router from "next/router";
import style from "../../styles/allStyles.module.scss";

// exporting default UserNav component
export default function Nav() {
  // handles user logout 
  function handleUserLogout() {
    let authCookie = document.cookie;
    authCookie += ";max-age=0";
    document.cookie = authCookie;
    localStorage.removeItem("loggedInUserId");
    Router.push("/");
  }

  // all the link to pages and user logout are given
  return (
    <nav className={style.navCover}>
      <div className={style.navContainer}>
        <ul className={style.navItems}>
          <li className={style.eachNav}>
            <a href="/home">
              Home
            </a>
          </li>
          <li className={style.eachNav}>
            <Link className="nav-link" href="/budget">
              Budget
            </Link>
          </li>
          <li className={style.eachNav}>
            <Link className="nav-link" href="/charts">
              Track Expenses
            </Link>
          </li>
          <li className={style.eachNav}>
            <Link className="nav-link" href="/shoppinglist">
              Shopping List
            </Link>
          </li>
        </ul>
        <button className={style.logout} onClick={(e) => handleUserLogout(e)}>
          Logout
        </button>
      </div>
    </nav>
  );
}
