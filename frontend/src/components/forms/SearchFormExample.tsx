import React, { useState } from 'react';
import SearchForm, { type SearchFormData } from './SearchForm';

const SearchFormExample: React.FC = () => {
  const [searchResults, setSearchResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData: SearchFormData) => {
    setLoading(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSearchResults(JSON.stringify(searchData, null, 2));
    setLoading(false);
  };

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">SearchForm Beispiel</h3>
            </div>
            <div className="card-body">
              <SearchForm 
                onSearch={handleSearch}
                loading={loading}
                className="mb-4"
              />
              
              {searchResults && (
                <div className="mt-4">
                  <h4>Suchparameter:</h4>
                  <pre className="bg-light p-3 rounded">
                    {searchResults}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFormExample; 