import React, { useState, useEffect } from 'react';
import { 
  Car, Plus, Search, Edit2, Trash2, AlertTriangle, 
  Wrench, CheckCircle2, DollarSign, X, RefreshCw 
} from 'lucide-react';
import { vehicleApi, ApiError } from './services/api';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null); // null represents adding a new vehicle
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    price: '',
    vin: '',
    status: 'Available'
  });

  // Fetch vehicles on component mount and search query changes
  useEffect(() => {
    fetchVehicles();
  }, [searchQuery]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getVehicles(searchQuery);
      setVehicles(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
    // Clear field-specific validation error when user begins typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      price: '',
      vin: '',
      status: 'Available'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      vin: vehicle.vin,
      status: vehicle.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    // Front-end pre-validation (fast, offline validation)
    const clientErrors = {};
    if (!formData.make) clientErrors.make = 'Make is required';
    if (!formData.model) clientErrors.model = 'Model is required';
    if (!formData.year) clientErrors.year = 'Year is required';
    if (formData.year < 1886 || formData.year > 2100) clientErrors.year = 'Year must be between 1886 and 2100';
    if (!formData.color) clientErrors.color = 'Color is required';
    if (formData.price === '' || formData.price < 0) clientErrors.price = 'Price must be 0 or greater';
    if (!formData.vin) clientErrors.vin = 'VIN is required';
    if (formData.vin.length !== 17) clientErrors.vin = 'VIN must be exactly 17 characters';
    
    if (Object.keys(clientErrors).length > 0) {
      setFormErrors(clientErrors);
      return;
    }

    try {
      if (editingVehicle) {
        // Update operation
        await vehicleApi.updateVehicle(editingVehicle.id, formData);
      } else {
        // Create operation
        await vehicleApi.createVehicle(formData);
      }
      closeModal();
      fetchVehicles();
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError && err.status === 400 && err.payload?.errors) {
        // Populate specific field validation errors returned by Spring Boot's global exception handler
        setFormErrors(err.payload.errors);
      } else {
        // Generic database or exception message
        setFormErrors({ general: err.message || 'An error occurred while saving the vehicle.' });
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle from fleet operations?')) {
      try {
        await vehicleApi.deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to delete vehicle');
      }
    }
  };

  // Local filtering by status badge
  const filteredVehicles = statusFilter === 'All' 
    ? vehicles 
    : vehicles.filter(v => v.status === statusFilter);

  // Dynamic fleet metrics calculation
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const soldVehicles = vehicles.filter(v => v.status === 'Sold').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance').length;
  
  // Format Currency Utility
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <nav className="navbar">
        <div className="brand">
          <Car size={32} className="brand-accent" />
          <span>VEHICLE<span className="brand-accent">OS</span></span>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Vehicle
        </button>
      </nav>

      {/* Dynamic Statistics Cards */}
      <section className="dashboard-stats">
        <div className="stat-card cyan">
          <div className="stat-icon">
            <Car size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Fleet</span>
            <span className="stat-value">{totalVehicles}</span>
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Available</span>
            <span className="stat-value">{availableVehicles}</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sold</span>
            <span className="stat-value">{soldVehicles}</span>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-icon">
            <Wrench size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Maintenance</span>
            <span className="stat-value">{maintenanceVehicles}</span>
          </div>
        </div>
      </section>

      {/* Control Bar (Filters and Search) */}
      <section className="controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search make, model, color, status, or VIN..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label" style={{ marginBottom: 0 }}>Filter Status:</label>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button className="btn btn-secondary btn-icon" onClick={fetchVehicles} title="Refresh Fleet Data">
            <RefreshCw size={18} />
          </button>
        </div>
      </section>

      {/* Global Connection Error Message */}
      {error && (
        <div className="alert-banner">
          <AlertTriangle size={20} />
          <span>Connection Error: {error}. Please verify the Spring Boot backend server is running on port 8080.</span>
        </div>
      )}

      {/* Operations Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading fleet operations data...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="empty-state">
            <Car size={48} className="empty-icon" />
            <h3>No Vehicles Found</h3>
            <p>We couldn't find any vehicles in the database matching your criteria.</p>
            {searchQuery && (
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Make &amp; Model</th>
                <th>Year</th>
                <th>Color</th>
                <th>VIN</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{vehicle.make}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{vehicle.model}</div>
                  </td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.color}</td>
                  <td style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{vehicle.vin}</td>
                  <td style={{ fontWeight: 500, color: 'var(--primary)' }}>
                    {formatCurrency(vehicle.price)}
                  </td>
                  <td>
                    <span className={`badge badge-${vehicle.status.toLowerCase()}`}>
                      <span className="badge-dot"></span>
                      {vehicle.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn btn-secondary btn-icon" 
                        onClick={() => openEditModal(vehicle)}
                        title="Edit Vehicle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn btn-danger btn-icon" 
                        onClick={() => handleDelete(vehicle.id)}
                        title="Delete Vehicle"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Overlay Register Form Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingVehicle ? 'Update Vehicle Operations' : 'Register New Vehicle'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formErrors.general && (
                <div className="alert-banner">
                  <AlertTriangle size={18} />
                  <span>{formErrors.general}</span>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Make *</label>
                  <input 
                    type="text" 
                    name="make"
                    placeholder="e.g. Tesla, Toyota"
                    className={`form-input ${formErrors.make ? 'is-invalid' : ''}`}
                    value={formData.make}
                    onChange={handleInputChange}
                  />
                  {formErrors.make && <div className="invalid-feedback">{formErrors.make}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Model *</label>
                  <input 
                    type="text" 
                    name="model"
                    placeholder="e.g. Model S, RAV4"
                    className={`form-input ${formErrors.model ? 'is-invalid' : ''}`}
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                  {formErrors.model && <div className="invalid-feedback">{formErrors.model}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <input 
                    type="number" 
                    name="year"
                    placeholder="e.g. 2023"
                    className={`form-input ${formErrors.year ? 'is-invalid' : ''}`}
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                  {formErrors.year && <div className="invalid-feedback">{formErrors.year}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Color *</label>
                  <input 
                    type="text" 
                    name="color"
                    placeholder="e.g. Midnight Silver"
                    className={`form-input ${formErrors.color ? 'is-invalid' : ''}`}
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                  {formErrors.color && <div className="invalid-feedback">{formErrors.color}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Price (USD) *</label>
                  <input 
                    type="number" 
                    name="price"
                    step="0.01"
                    placeholder="e.g. 45000"
                    className={`form-input ${formErrors.price ? 'is-invalid' : ''}`}
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select 
                    name="status"
                    className={`form-input ${formErrors.status ? 'is-invalid' : ''}`}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  {formErrors.status && <div className="invalid-feedback">{formErrors.status}</div>}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">17-Character VIN *</label>
                  <input 
                    type="text" 
                    name="vin"
                    placeholder="e.g. 1FMCU9GD0MP123456"
                    className={`form-input ${formErrors.vin ? 'is-invalid' : ''}`}
                    value={formData.vin}
                    onChange={handleInputChange}
                    disabled={!!editingVehicle}
                  />
                  {formErrors.vin && <div className="invalid-feedback">{formErrors.vin}</div>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
