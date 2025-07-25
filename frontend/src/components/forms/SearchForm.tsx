import React, { useState } from 'react';
import { Select } from '../ui';

export interface SearchFormProps {
  onSearch: (searchData: SearchFormData) => void;
  loading?: boolean;
  className?: string;
}

export interface SearchFormData {
  searchTerm: string;
  visibility: string;
  size: string;
  orderBy: string;
  order: string;
  page: number;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  loading = false, 
  className = '' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    searchTerm: '',
    visibility: '1', // Ja
    size: '50',
    orderBy: 'name',
    order: 'ASC',
    page: 1
  });

  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Optionen für die Dropdown-Felder
  const visibilityOptions = [
    { value: '3', label: 'Beides' },
    { value: '2', label: 'Nein' },
    { value: '1', label: 'Ja' }
  ];

  const sizeOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
    { value: '30', label: '30' },
    { value: '35', label: '35' },
    { value: '40', label: '40' },
    { value: '45', label: '45' },
    { value: '50', label: '50' },
    { value: '60', label: '60' },
    { value: '70', label: '70' },
    { value: '80', label: '80' },
    { value: '90', label: '90' },
    { value: '100', label: '100' },
    { value: '125', label: '125' },
    { value: '150', label: '150' },
    { value: '175', label: '175' },
    { value: '200', label: '200' },
    { value: '250', label: '250' },
    { value: '300', label: '300' },
    { value: '350', label: '350' },
    { value: '400', label: '400' },
    { value: '450', label: '450' },
    { value: '500', label: '500' }
  ];

  const orderByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'comment', label: 'Beschreibung' },
    { value: 'country', label: 'Land' },
    { value: 'number', label: 'Kundennummer' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'email', label: 'E-Mail' },
    { value: 'mobile', label: 'Mobil' },
    { value: 'fax', label: 'Fax' },
    { value: 'phone', label: 'Telefon' },
    { value: 'currency', label: 'Währung' },
    { value: 'address', label: 'Adresse' },
    { value: 'contact', label: 'Kontakt' },
    { value: 'company', label: 'Unternehmensbezeichnung' },
    { value: 'vat_id', label: 'Umsatzsteuer-ID' },
    { value: 'budget', label: 'Budget' },
    { value: 'timeBudget', label: 'Stundenkontingent' },
    { value: 'visible', label: 'Sichtbar' }
  ];

  const orderOptions = [
    { value: 'ASC', label: 'Aufsteigend' },
    { value: 'DESC', label: 'Absteigend' }
  ];

  return (
    <form 
      method="get" 
      className={`searchform ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="input-group inline-search position-static">
        {/* Filter-Dropdown Button */}
        <button 
          type="button" 
          className="btn dropdown-toggle" 
          data-bs-toggle="dropdown" 
          data-bs-auto-close="false" 
          aria-haspopup="true" 
          aria-expanded={isDropdownOpen}
          id="search-dropdown-btn" 
          title="Suchfilter"
          onClick={toggleDropdown}
        >
          <i className="icon fas fa-filter"></i>
        </button>

        {/* Filter-Dropdown Menu */}
        <div 
          className={`dropdown-menu p-3 search-dropdown ${isDropdownOpen ? 'show' : ''}`}
          data-popper-placement="bottom-start" 
          aria-labelledby="search-dropdown-btn"
        >
          {/* Sichtbar Filter */}
          <div className="mb-2 row">
            <label className="col-form-label col-sm-4 col-xs-5 required" htmlFor="visibility">
              Sichtbar
            </label>
            <div className="col-sm-8 col-xs-7">
              <Select
                name="visibility"
                options={visibilityOptions}
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                required
                className="form-select"
              />
            </div>
          </div>

          {/* Ergebnisse pro Seite */}
          <div className="mb-2 row">
            <label className="col-form-label col-sm-4 col-xs-5 required" htmlFor="size">
              Ergebnisse
            </label>
            <div className="col-sm-8 col-xs-7">
              <Select
                name="size"
                options={sizeOptions}
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                required
                className="form-select"
              />
            </div>
          </div>

          {/* Sortierung */}
          <div className="mb-2 row">
            <label className="col-form-label col-sm-4 col-xs-5 required" htmlFor="orderBy">
              Sortieren nach
            </label>
            <div className="col-sm-4 col-xs-6">
              <Select
                name="orderBy"
                options={orderByOptions}
                value={formData.orderBy}
                onChange={(e) => handleInputChange('orderBy', e.target.value)}
                required
                className="form-select"
              />
            </div>
            <div className="col-sm-4 col-xs-6">
              <Select
                name="order"
                options={orderOptions}
                value={formData.order}
                onChange={(e) => handleInputChange('order', e.target.value)}
                required
                className="form-select"
              />
            </div>
          </div>

          {/* Suchen Button im Dropdown */}
          <div className="row mt-3">
            <div className="col-12 text-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Suchen...
                  </>
                ) : (
                  'Suchen'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Suchfeld */}
        <input 
          type="text" 
          id="searchTerm" 
          name="searchTerm" 
          placeholder="Suchen" 
          className="form-control"
          value={formData.searchTerm}
          onChange={(e) => handleInputChange('searchTerm', e.target.value)}
        />

        {/* Such-Button */}
        <span className="input-group-text">
          <button 
            type="submit" 
            className="btn btn-icon btn-sm btn-ghost-secondary" 
            data-toggle="tooltip" 
            aria-label="Suchen" 
            data-bs-original-title="Suchen"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </span>
      </div>

      {/* Hidden Fields */}
      <input type="hidden" id="page" name="page" value={formData.page} />
      <input type="hidden" name="performSearch" value="performSearch" />
    </form>
  );
};

export default SearchForm; 