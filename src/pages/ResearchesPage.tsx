import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useAppSelector } from '../store/hooks';
import { api } from '../api';
import './ResearchesPage.css';

export default function ResearchesPage() {
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useAppSelector(state => state.user);
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadResearches();
  }, [isAuthenticated, navigate]);

  const loadResearches = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.researches.researchesList();
      
      // Бэкенд уже возвращает только исследования текущего пользователя
      // Убираем черновики, так как они отображаются в корзине
      const researchesWithoutDrafts = response.data.filter((research: any) => 
        research.status !== 'draft'
      );
      
      setResearches(researchesWithoutDrafts);
    } catch (error: any) {
      setError(error.response?.data?.description || 'Ошибка загрузки исследований');
    } finally {
      setLoading(false);
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

  const filteredResearches = statusFilter === 'all' 
    ? researches 
    : researches.filter(research => research.status === statusFilter);

  const handleResearchClick = (researchId: number) => {
    navigate(`/research/${researchId}`);
  };

  if (loading) {
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
          <h1>Мои исследования</h1>
          <p>Всего исследований: {researches.length}</p>
          <p>Пользователь: {username}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Фильтры по статусу */}
        <div className="filters-section">
          <div className="status-filters">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Все
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'formed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('formed')}
            >
              Сформированы
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Завершены
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Отклонены
            </button>
          </div>
        </div>

        <div className="researches-table-container">
          {filteredResearches.length > 0 ? (
            <table className="researches-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата исследования</th>
                  <th>Дата формирования</th>
                  <th>Дата завершения</th>
                  <th>Модератор</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearches.map((research) => (
                  <tr 
                    key={research.id}
                    className="research-row"
                    onClick={() => handleResearchClick(research.id)}
                  >
                    <td className="research-id">#{research.id}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(research.status)}`}>
                        {getStatusText(research.status)}
                      </span>
                    </td>
                    <td>{new Date(research.date_create).toLocaleDateString('ru-RU')}</td>
                    <td>{research.date_research ? new Date(research.date_research).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>{research.date_form ? new Date(research.date_form).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>{research.date_finish ? new Date(research.date_finish).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>{research.moderator_login || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-researches">
              <p>Исследования не найдены</p>
              {statusFilter !== 'all' && (
                <button 
                  className="btn-clear-filter"
                  onClick={() => setStatusFilter('all')}
                >
                  Показать все исследования
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}