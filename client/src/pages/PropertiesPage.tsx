import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMap } from '../components/PropertyMap';
import { Property, RecommendationItem } from '../types';
import { propertyService, SearchFilters } from '../services/propertyService';
import { aiService } from '../services/aiService';
import { Search, Map, Grid, Filter, RefreshCw, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WhyThisPropertyModal } from '../components/WhyThisPropertyModal';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [recommendationsMap, setRecommendationsMap] = useState<Record<string, RecommendationItem>>({});
  const [selectedRec, setSelectedRec] = useState<RecommendationItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [loading, setLoading] = useState(true);

  // Filters state
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Comparison selection list
  const [compareList, setCompareList] = useState<Property[]>([]);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const filters: SearchFilters = {
        city: city || undefined,
        locality: locality || undefined,
        propertyType: propertyType || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        sortBy: sortBy as any,
        page,
        limit: 9,
      };

      const data = await propertyService.searchProperties(filters);
      setProperties(data.properties);
      setTotalPages(data.pagination.pages);

      // Fetch recommendation scores for candidate properties
      const recs = await aiService.getRecommendations();
      const recMap: Record<string, RecommendationItem> = {};
      recs.forEach((r) => {
        recMap[r.propertyId] = r;
      });
      setRecommendationsMap(recMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, sortBy]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  const handleReset = () => {
    setCity('');
    setLocality('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSortBy('newest');
    setPage(1);
  };

  const handleCompareSelect = (prop: Property) => {
    if (compareList.find((p) => p._id === prop._id)) {
      setCompareList(compareList.filter((p) => p._id !== prop._id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare up to 4 properties at a time.');
        return;
      }
      setCompareList([...compareList, prop]);
    }
  };

  const handleProceedCompare = () => {
    const ids = compareList.map((p) => p._id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">Explore Property Listings</h2>
          <p className="text-secondary small mb-0">Use advanced search filters, geospatial maps, and AI recommendations</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {compareList.length > 0 && (
            <button onClick={handleProceedCompare} className="btn btn-sm gradient-btn d-flex align-items-center gap-2">
              <GitCompare size={16} /> Compare ({compareList.length})
            </button>
          )}

          <div className="btn-group glass-panel p-1">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-dark text-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-dark text-secondary'}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={16} /> Map View
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Search Sidebar Filter */}
        <div className="col-lg-3">
          <div className="glass-panel p-3">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
              <span className="fw-bold text-white d-flex align-items-center gap-1">
                <Filter size={16} className="text-indigo" /> Filters
              </span>
              <button type="button" className="btn btn-xs btn-link text-secondary p-0" onClick={handleReset}>
                Reset
              </button>
            </div>

            <form onSubmit={handleApplyFilters}>
              <div className="mb-3">
                <label className="form-label small text-secondary">City</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="e.g. Chennai, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Locality</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="e.g. OMR, Adyar"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Property Type</label>
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Commercial Property">Commercial Property</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-secondary">Min Price</label>
                  <input
                    type="number"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-secondary">Max Price</label>
                  <input
                    type="number"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Min BHK Bedrooms</label>
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+ BHK</option>
                  <option value="2">2+ BHK</option>
                  <option value="3">3+ BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Sort By</label>
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <button type="submit" className="btn btn-sm gradient-btn w-100 mt-2">
                Apply Search Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results Main Area */}
        <div className="col-lg-9">
          {viewMode === 'map' ? (
            <PropertyMap properties={properties} height="600px" radiusKm={5} />
          ) : loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-indigo"></div>
              <p className="text-secondary mt-2">Executing search & applying AI rankings...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-panel p-5 text-center text-secondary">
              <h5>No Properties Found</h5>
              <p className="small mb-3">Try adjusting your budget bounds or locality filters.</p>
              <button className="btn btn-sm btn-outline-light" onClick={handleReset}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {properties.map((p) => (
                  <div key={p._id} className="col-md-6 col-xl-4">
                    <PropertyCard
                      property={p}
                      recommendation={recommendationsMap[p._id]}
                      onCompareSelect={handleCompareSelect}
                      isCompared={!!compareList.find((item) => item._id === p._id)}
                      onExplainClick={(rec) => setSelectedRec(rec)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="align-self-center text-secondary small">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <WhyThisPropertyModal recommendation={selectedRec} onClose={() => setSelectedRec(null)} />
    </div>
  );
};
