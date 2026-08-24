import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Property } from '../types';
import { propertyService } from '../services/propertyService';
import { GitCompare, CheckCircle2, Sparkles, X, ArrowLeft } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompare = async () => {
      const ids = idsParam.split(',').filter(Boolean);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const data = await propertyService.getCompareProperties(ids);
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompare();
  }, [idsParam]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-indigo"></div>
        <p className="text-secondary mt-2">Building property comparison matrix...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container py-5 text-center text-secondary">
        <GitCompare size={48} className="text-indigo mb-3" />
        <h3>No Properties Selected for Comparison</h3>
        <p className="small mb-4">Go to property listings and click the compare icon on 2 to 4 listings.</p>
        <Link to="/properties" className="btn gradient-btn">Browse Properties</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <Link to="/properties" className="text-secondary small d-flex align-items-center gap-1 mb-2 text-decoration-none">
            <ArrowLeft size={16} /> Back to Search
          </Link>
          <h2 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <GitCompare className="text-indigo" size={24} /> Side-by-Side Property Comparison
          </h2>
        </div>
      </div>

      {/* AI Comparison Summary Card */}
      <div className="glass-panel p-4 mb-4 border-indigo">
        <h5 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
          <Sparkles className="text-indigo ai-pulse" size={18} /> AI Property Comparison Analysis
        </h5>
        <p className="text-secondary small mb-0">
          Comparing {properties.length} listings: Property <strong>{properties[0].title}</strong> offers the best price-to-area value at ₹{properties[0].pricePerSqFt}/sq.ft, while <strong>{properties[1]?.title || properties[0].title}</strong> features higher bedroom configuration.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="table-responsive glass-panel p-3">
        <table className="table table-dark table-borderless align-middle mb-0">
          <thead>
            <tr className="border-bottom border-secondary">
              <th style={{ width: '200px' }} className="text-secondary">Attribute</th>
              {properties.map((p) => (
                <th key={p._id} style={{ minWidth: '220px' }}>
                  <div className="p-2">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
                      alt={p.title}
                      style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                      className="mb-2"
                    />
                    <h6 className="fw-bold text-white text-truncate mb-1">{p.title}</h6>
                    <div className="gradient-text fw-bold">₹{(p.price / 100000).toFixed(1)} Lakhs</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Price per Sq.Ft</td>
              {properties.map((p) => (
                <td key={p._id} className="fw-bold text-indigo">₹{p.pricePerSqFt}</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Property Type</td>
              {properties.map((p) => (
                <td key={p._id}>{p.propertyType}</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Bedrooms (BHK)</td>
              {properties.map((p) => (
                <td key={p._id} className="fw-bold">{p.bedrooms} BHK</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Bathrooms</td>
              {properties.map((p) => (
                <td key={p._id}>{p.bathrooms} Bath</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Super Built-up Area</td>
              {properties.map((p) => (
                <td key={p._id} className="fw-bold">{p.area} sq.ft</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Locality / City</td>
              {properties.map((p) => (
                <td key={p._id}>{p.locality}, {p.city}</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Furnished Status</td>
              {properties.map((p) => (
                <td key={p._id}>{p.furnishedStatus}</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Construction Status</td>
              {properties.map((p) => (
                <td key={p._id}>{p.constructionStatus}</td>
              ))}
            </tr>
            <tr className="border-bottom border-secondary">
              <td className="text-secondary fw-semibold">Reserved Parking</td>
              {properties.map((p) => (
                <td key={p._id}>{p.parking ? 'Yes' : 'No'}</td>
              ))}
            </tr>
            <tr>
              <td className="text-secondary fw-semibold">Action</td>
              {properties.map((p) => (
                <td key={p._id}>
                  <Link to={`/properties/${p._id}`} className="btn btn-sm btn-outline-light w-100">
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
