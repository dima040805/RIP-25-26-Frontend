import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useAppSelector } from '../store/hooks';
import { api } from '../api';
import './ModeratorDashboard.css';

interface Research {
  id: number;
  creator_login: string;
  status: string;
  date_create: string;
  date_research?: string;
  date_form?: string;
  date_finish?: string;
  moderator_login?: string;
}

export default function ModeratorDashboard() {
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useAppSelector(state => state.user);
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Фильтры
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  // Short polling интервал
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Проверяем права модератора
    checkModeratorRights();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadResearches();
    
    // Short polling каждые 5 секунд
    const interval = setInterval(() => {
      setPollingCount(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pollingCount, statusFilter, dateFrom, dateTo]);

  const checkModeratorRights = async () => {
    try {
      const response = await api.users.profileList(username);
      if (!response.data.is_moderator) {
        navigate('/researches');
      }
    } catch (error) {
      setError('Ошибка проверки прав доступа');
    }
  };

  const loadResearches = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFrom) params['from-date'] = dateFrom;
      if (dateTo) params['to-date'] = dateTo;
      
      const response = await api.researches.researchesList(params);
      
      // Фильтрация по создателю на фронтенде
      let filteredResearches = response.data;
      if (creatorFilter) {
        filteredResearches = filteredResearches.filter((research: Research) =>
          research.creator_login.toLowerCase().includes(creatorFilter.toLowerCase())
        );
      }
      
      setResearches(filteredResearches);
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка загрузки исследований');
    } finally {
      setLoading(false);
    }
  };

  const startRadiusCalculation = async (researchId: number) => {
    try {
      // Получаем детали исследования
      const researchResponse = await api.research.researchDetail(researchId);
      const researchData = researchResponse.data;
      
      // Запускаем расчет для каждой планеты в исследовании
      if (researchData.planets && researchData.planetsResearch) {
        for (const planet of researchData.planets) {
          const planetResearch = researchData.planetsResearch.find(
            (pr: any) => pr.planet_id === planet.id
          );
          
          if (planetResearch && planetResearch.planet_shine) {
            // Отправляем запрос в асинхронный сервис
            await fetch('http://localhost:8000/calculate-radius/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                research_id: researchId,
                planet_id: planet.id,
                star_radius: planet.star_radius,
                planet_shine: planetResearch.planet_shine
              })
            });
          }
        }
      }
      
      console.log(`Расчет радиусов для исследования ${researchId} запущен`);
    } catch (error: any) {
      console.error('Ошибка запуска расчета:', error);
      // Не показываем ошибку пользователю, просто логируем
    }
  };

  const updateResearchStatus = async (researchId: number, newStatus: string) => {
    try {
      await api.research.finishUpdate(researchId, { status: newStatus });
      
      // ЕСЛИ ОДОБРИЛИ (completed) - ЗАПУСКАЕМ РАСЧЕТ РАДИУСОВ
      if (newStatus === 'completed') {
        await startRadiusCalculation(researchId);
        alert('Исследование одобрено! Расчет радиусов запущен. Результаты появятся через 5-10 секунд.');
      } else {
        alert(`Статус исследования изменен на "${getStatusText(newStatus)}"`);
      }
      
      loadResearches(); // Перезагружаем список
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка обновления статуса');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'draft': 'Черновик',
      'formed': 'Сформирована', 
      'completed': 'Завершена',
      'rejected': 'Отклонена',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: { [key: string]: string } = {
      'draft': 'status-draft',
      'formed': 'status-formed',
      'completed': 'status-completed',
      'rejected': 'status-rejected'
    };
    return classMap[status] || '';
  };

  const canChangeStatus = (currentStatus: string) => {
    return currentStatus === 'formed';
  };

  const filteredResearches = statusFilter === 'all' 
    ? researches 
    : researches.filter(research => research.status === statusFilter);

  return (
    <div className="moderator-dashboard">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.RESEARCHES, path: '/researches' },
          { label: 'Панель модератора' },
        ]}
      />
      
      <main>
        <div className="moderator-header">
          <h1>Панель модератора</h1>
          <p>Управление исследованиями пользователей</p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Фильтры */}
        <div className="moderator-filters">
          <div className="filter-group">
            <label>Статус:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="content-list-section"
            >
              <option value="all">Все статусы</option>
              <option value="formed">Сформированы</option>
              <option value="completed">Завершены</option>
              <option value="rejected">Отклонены</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Дата от:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="content-list-section"
            />
          </div>

          <div className="filter-group">
            <label>Дата до:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="content-list-section"
            />
          </div>

          <div className="filter-group">
            <label>Создатель:</label>
            <input
              type="text"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              placeholder="Фильтр по логину"
              className="content-list-section"
            />
          </div>

          <button onClick={loadResearches} className="btn-refresh">
            Обновить
          </button>
        </div>

        {/* Таблица исследований */}
        <div className="researches-table-container">
          {loading ? (
            <div className="loading">Загрузка исследований...</div>
          ) : filteredResearches.length > 0 ? (
            <table className="moderator-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Создатель</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата исследования</th>
                  <th>Дата формирования</th>
                  <th>Дата завершения</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearches.map((research) => (
                  <tr key={research.id}>
                    <td className="research-id">#{research.id}</td>
                    <td>{research.creator_login}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(research.status)}`}>
                        {getStatusText(research.status)}
                      </span>
                    </td>
                    <td>{new Date(research.date_create).toLocaleDateString('ru-RU')}</td>
                    <td>{research.date_research ? new Date(research.date_research).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>{research.date_form ? new Date(research.date_form).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>{research.date_finish ? new Date(research.date_finish).toLocaleDateString('ru-RU') : '—'}</td>
                    <td className="actions-cell">
                      {canChangeStatus(research.status) && (
                        <>
                          <button 
                            className="btn-approve"
                            onClick={() => updateResearchStatus(research.id, 'completed')}
                          >
                            Одобрить и рассчитать
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => updateResearchStatus(research.id, 'rejected')}
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                      
                      {/* Кнопка просмотра для всех статусов */}
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/research/${research.id}`)}
                      >
                        Просмотр
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-researches">
              <p>Исследования не найдены</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}