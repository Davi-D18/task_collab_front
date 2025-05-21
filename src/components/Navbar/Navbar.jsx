import { CircleCheckBig, LogOut, Menu, User, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./Navbar.module.scss"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <CircleCheckBig className={styles.logoIcon} />
          <span>TaskCollab</span>
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={styles.navLink} onClick={toggleMenu}>
                Tarefas
              </Link>
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <User size={16} />
                  <span>{user?.username}</span>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink} onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink} onClick={toggleMenu}>
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
