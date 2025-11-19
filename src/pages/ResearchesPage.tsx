import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useAppSelector } from '../store/hooks';
import { api } from '../api';
import './ResearchesPage.css';

interface Research {
  id: number;
  creator_login: string;
  status: string;
  date_create: string;
  date_research?: string;
  date_form?: string;
  date_finish?: string;
  moderator_login?: string;
  total_planets: number;
  calculated_planets: number;
}

export default function ResearchesPage() {
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useAppSelector(state => state.user);
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  // Фильтры
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  // Short polling
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUserProfile();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadResearches();
    
    // Short polling каждые 5 секунд для обновления статусов
    const interval = setInterval(() => {
      setPollingCount(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pollingCount, statusFilter, dateFrom, dateTo, creatorFilter]);

  const loadUserProfile = async () => {
    try {
      const response = await api.users.profileList(username);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadResearches = async () => {
    setLoading(true);
    setError('');
    
    try {
      // ВСЕ фильтры отправляем на бэкенд
      const params: any = {};
      
      // Фильтрация по дате (бэкенд)
      if (dateFrom) params['from-date'] = dateFrom;
      if (dateTo) params['to-date'] = dateTo;
      
      // Фильтрация по статусу (бэкенд)
      if (statusFilter !== 'all') {
        params['status'] = statusFilter;
      }
      
      // Фильтрация по создателю (бэкенд)
      if (creatorFilter && userProfile?.is_moderator) {
        params['creator_login'] = creatorFilter;
      }
      
      const response = await api.researches.researchesList(params);
      
      let filteredResearches = response.data;
      

      
      setResearches(filteredResearches);
      
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка загрузки исследований');
    } finally {
      setLoading(false);
    }
  };

  const updateResearchStatus = async (researchId: number, newStatus: string) => {
    try {
      await api.research.finishUpdate(researchId, { status: newStatus });
      // Перезагружаем список после изменения статуса
      loadResearches();
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка обновления статуса');
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCreatorFilter('');
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

  const isModerator = userProfile?.is_moderator;
  const canModerate = (research: Research) => {
    return isModerator && research.status === 'formed';
  };

  const handleResearchClick = (researchId: number) => {
    navigate(`/research/${researchId}`);
  };

  const hasActiveFilters = statusFilter !== 'all' || dateFrom || dateTo || creatorFilter;

  const getCalculationProgress = (research: Research) => {
    if (research.total_planets === 0) return '—';
    
    const percentage = (research.calculated_planets / research.total_planets) * 100;
    
    if (research.calculated_planets === research.total_planets) {
      return (
        <span className="calculation-complete">
          {research.calculated_planets}/{research.total_planets} ✓
        </span>
      );
    }
    
    return (
      <span className="calculation-progress">
        {research.calculated_planets}/{research.total_planets}
        {percentage > 0 && (
          <span className="progress-percentage"> ({Math.round(percentage)}%)</span>
        )}
      </span>
    );
  };

  if (loading && researches.length === 0) {
    return (
      <div className="researches-page">
        <Header />
        <div className="loading">Загрузка исследований...</div>
      </div>
    );
  }

  return (
    <div className="researches-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.RESEARCHES },
        ]}
      />
      
      <main>
        <div className="researches-header">
          <h1>Исследования</h1>
          <p>Всего исследований: {researches.length}</p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Фильтры */}
        <div className="filters-section">
          <div className="filters-grid">
            {/* Фильтр по статусу */}
            <div className="filter-group">
              <label>Статус:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="formed">Сформированы</option>
                <option value="completed">Завершены</option>
                <option value="rejected">Отклонены</option>
              </select>
            </div>

            {/* Фильтр по дате от */}
            <div className="filter-group">
              <label>Дата от:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Фильтр по дате до */}
            <div className="filter-group">
              <label>Дата до:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Фильтр по создателю (только для модераторов) */}
            {isModerator && (
              <div className="filter-group">
                <label>Создатель:</label>
                <input
                  type="text"
                  value={creatorFilter}
                  onChange={(e) => setCreatorFilter(e.target.value)}
                  placeholder="Фильтр по логину"
                />
              </div>
            )}

            {/* Кнопки управления фильтрами */}
            <div className="filter-actions">
              <button onClick={loadResearches} className="btn-refresh">
                Обновить
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-clear">
                  Сбросить фильтры
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="researches-table-container">
          {researches.length > 0 ? (
            <table className="researches-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Создатель</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Планеты</th>
                  <th>Расчеты</th>
                  {isModerator && <th>Модератор</th>}
                  {isModerator && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {researches.map((research) => (
                  <tr 
                    key={research.id}
                    className="research-row"
                    onClick={() => handleResearchClick(research.id)}
                  >
                    <td className="research-id">#{research.id}</td>
                    <td>{research.creator_login}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(research.status)}`}>
                        {getStatusText(research.status)}
                      </span>
                    </td>
                    <td>{new Date(research.date_create).toLocaleDateString('ru-RU')}</td>
                    <td>{research.total_planets}</td>
                    <td>
                      {getCalculationProgress(research)}
                    </td>
                    
                    {isModerator && (
                      <td>{research.moderator_login || '—'}</td>
                    )}
                    
                    {isModerator && (
                      <td className="actions-cell">
                        {canModerate(research) && (
                          <>
                            <button 
                              className="btn-approve"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateResearchStatus(research.id, 'completed');
                              }}
                            >
                              Одобрить
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateResearchStatus(research.id, 'rejected');
                              }}
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                        {research.status === 'completed' && (
                          <span className="approved-badge">✓ Одобрено</span>
                        )}
                        {research.status === 'rejected' && (
                          <span className="rejected-badge">✗ Отклонено</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-researches">
              <p>Исследования не найдены</p>
              {hasActiveFilters && (
                <button 
                  className="btn-clear-filter"
                  onClick={clearFilters}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}