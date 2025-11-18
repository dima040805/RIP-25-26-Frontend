import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/userSlice';
import './Header.css';

export default function Header() {
  const { isAuthenticated, username } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar">
        <Link to="/">
          <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ... ваш существующий SVG ... */}
          </svg>
        </Link>

        {/* Авторизация слева */}
        <div className="header-auth-left">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="username">Привет, {username}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <div className="guest-menu">
              <Link to="/login" className="login-btn">
                Войти
              </Link>
              <Link to="/register" className="register-btn">
                Регистрация
              </Link>
            </div>
          )}
        </div>

        {/* Центральное меню */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/planets" className="nav-link">Планеты</Link>

          {isAuthenticated && (
            <>
              <Link to="/researches" className="nav-link">Мои исследования</Link>
              <Link to="/profile" className="nav-link">Личный кабинет</Link>
              
              {/* ДОБАВЛЕНА КНОПКА ДЛЯ МОДЕРАТОРА */}
              <Link to="/moderator" className="nav-link moderator-link">
                Панель модератора
              </Link>
            </>
          )}
        </div>

        {/* Правая часть - корзина исследований */}
        <div className="header-actions-right">
          {/* Бургер-меню */}
          <div 
            className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
        <Link to="/planets" onClick={() => setIsMenuOpen(false)}>Планеты</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/researches" onClick={() => setIsMenuOpen(false)}>Мои исследования</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Личный кабинет</Link>
            
            {/* ДОБАВЛЕНА КНОПКА ДЛЯ МОДЕРАТОРА В МОБИЛЬНОМ МЕНЮ */}
            <Link to="/moderator" onClick={() => setIsMenuOpen(false)} className="moderator-link">
              Панель модератора
            </Link>
            
            <div className="mobile-user-info">
              <span className="mobile-username">Пользователь: {username}</span>
              <button onClick={handleLogout} className="mobile-logout">
                Выйти
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Войти</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
}