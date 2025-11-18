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
  
  const { isAuthenticated } = useAppSelector(state => state.user);
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Просто показываем все заявки без фильтрации
      setResearches(response.data);
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
        <div className="research-header">
          <h1>Мои исследования</h1>
          <p>Всего исследований: {researches.length}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="researches-table-container">
          {researches.length > 0 ? (
            <div className="research-table-wrapper">
              {/* Заголовок таблицы */}
              <div className="research-table-header">
                <span className="research-id-header">ID</span>
                <span className="status-header">Статус</span>
                <span className="creator-header">Создатель</span>
                <span className="date-create-header">Дата создания</span>
                <span className="date-research-header">Дата исследования</span>
                <span className="date-form-header">Дата формирования</span>
                <span className="date-finish-header">Дата завершения</span>
                <span className="moderator-header">Модератор</span>
              </div>

              {/* Тело таблицы */}
              <div className="research-table-body">
                {researches.map((research) => (
                  <div 
                    key={research.id}
                    className="research-table-row"
                    onClick={() => handleResearchClick(research.id)}
                  >
                    <span className="research-id">#{research.id}</span>
                    <span className={`status-badge ${getStatusClass(research.status)}`}>
                      {getStatusText(research.status)}
                    </span>
                    <span className="creator">
                      {research.creator_login || '—'}
                    </span>
                    <span className="date-create">
                      {new Date(research.date_create).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="date-research">
                      {research.date_research ? new Date(research.date_research).toLocaleDateString('ru-RU') : '—'}
                    </span>
                    <span className="date-form">
                      {research.date_form ? new Date(research.date_form).toLocaleDateString('ru-RU') : '—'}
                    </span>
                    <span className="date-finish">
                      {research.date_finish ? new Date(research.date_finish).toLocaleDateString('ru-RU') : '—'}
                    </span>
                    <span className="moderator">
                      {research.moderator_login || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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