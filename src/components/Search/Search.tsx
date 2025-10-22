// components/Search/Search.tsx
import './Search.css';

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Search({ query, onQueryChange, onSearch }: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 21.2851L17.6085 14.8941C18.6145 13.3754 19.1996 11.5576 19.1996 9.59999C19.1996 4.29743 14.9018 0 9.5998 0C4.29778 0 0 4.29839 0 9.60094C0 14.9016 4.29778 19.2009 9.5998 19.2009C11.5565 19.2009 13.3762 18.6141 14.8944 17.6091L21.2849 24L24 21.2851ZM2.71992 9.6019C2.71992 5.80223 5.8008 2.72352 9.59982 2.72352C13.3998 2.72352 16.4806 5.80223 16.4806 9.6019C16.4806 13.4016 13.3998 16.4822 9.59982 16.4822C5.8008 16.4822 2.71992 13.4016 2.71992 9.6019Z" fill="#58585B"/>
      </svg>
      
      <input 
        type="text" 
        className="Search-content-list-section" 
        placeholder="Введите планету" 
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button type="submit">Найти</button>
    </form>
  );
}