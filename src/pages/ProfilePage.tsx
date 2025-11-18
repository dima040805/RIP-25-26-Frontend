// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useAppSelector } from '../store/hooks';
import { api } from '../api';
import './ProfilePage.css';

interface UserProfile {
  login: string;
  is_moderator: boolean;
  id: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useAppSelector(state => state.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Состояния для смены пароля
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, navigate]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Используем текущий логин пользователя из Redux store
      const response = await api.users.profileList(username);
      setProfile(response.data);
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка загрузки профиля');
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setSuccessMessage('');

    // Валидация
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Все поля обязательны для заполнения');
      setChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов');
      setChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      setChangingPassword(false);
      return;
    }

    try {
      // Отправляем запрос на смену пароля
      // Предполагаем, что есть эндпоинт для смены пароля
      // Если нет - нужно добавить в API
      await api.users.profileUpdate(username, {
        current_password: currentPassword,
        new_password: newPassword
      });

      setSuccessMessage('Пароль успешно изменен!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка смены пароля');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="loading">Загрузка профиля...</div>
      </div>
    );
  }

return (
  <div className="profile-page">
    <Header />
    
    <BreadCrumbs
      crumbs={[
        { label: ROUTE_LABELS.PROFILE },
      ]}
    />
    
    <main>
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <p>Управление вашим профилем</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="profile-content">
        {/* Информация о пользователе */}
        <div className="profile-section">
          <h2>Информация о профиле</h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Логин:</label>
              <span>{profile?.login || username}</span>
            </div>
            <div className="info-item">
              <label>ID:</label>
              <span>{profile?.id || '—'}</span>
            </div>
            <div className="info-item">
              <label>Роль:</label>
              <span>{profile?.is_moderator ? 'Модератор' : 'Пользователь'}</span>
            </div>
          </div>
        </div>

        {/* Смена пароля */}
        <div className="profile-section">
          <h2>Смена пароля</h2>
          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Текущий пароль</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль"
                required
                disabled={changingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль (мин. 6 символов)"
                required
                minLength={6}
                disabled={changingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                required
                disabled={changingPassword}
              />
            </div>

            <button 
              type="submit" 
              className="btn-change-password"
              disabled={changingPassword}
            >
              {changingPassword ? 'Смена пароля...' : 'Сменить пароль'}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
);
}