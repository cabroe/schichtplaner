import React, { useState } from 'react';
import SearchForm, { type SearchFormData } from '../../components/forms/SearchForm';

const UserHeader: React.FC = () => {
  const [, setSearchResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData: SearchFormData) => {
    setLoading(true);
    
    // Simuliere API-Aufruf für Benutzer-Suche
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSearchResults(JSON.stringify(searchData, null, 2));
    setLoading(false);
  };

  return (
    <>
        <div className="col">
            <div className="btn-list">
                <SearchForm 
                onSearch={handleSearch}
                loading={loading}
                className="mb-4"
              />
            </div>
        </div>
    </>
  );
};

export default UserHeader; 