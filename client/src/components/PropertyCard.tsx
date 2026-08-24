import React from 'react';
import { Link } from 'react-router-dom';
import { Property, RecommendationItem } from '../types';
import { Bed, Bath, Maximize2, MapPin, Heart, GitCompare, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { propertyService } from '../services/propertyService';

interface PropertyCardProps {
  property: Property;
  recommendation?: RecommendationItem;
  onFavoriteToggle?: () => void;
  onCompareSelect?: (property: Property) => void;
  isCompared?: boolean;
  onExplainClick?: (rec: RecommendationItem) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  recommendation,
  onFavoriteToggle,
  onCompareSelect,
  isCompared,
  onExplainClick,
}) => {
  const [isFavorited, setIsFavorited] = React.useState(false);

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorited) {
        await propertyService.removeFavorite(property._id);
        setIsFavorited(false);
      } else {
        await propertyService.addFavorite(property._id);
        setIsFavorited(true);
      }
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (_) {}
  };

  const mainImg = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card glass-panel property-card h-100 border-0">
      <div className="property-img-wrapper">
        <img src={mainImg} alt={property.title} loading="lazy" />

        <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
          {property.verificationStatus === 'APPROVED' && (
            <span className="badge badge-verified d-flex align-items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {property.fraudRiskScore >= 60 && (
            <span className="badge badge-fraud d-flex align-items-center gap-1">
              <AlertTriangle size={12} /> Flagged {property.fraudRiskScore}/100
            </span>
          )}
          {recommendation && (
            <button
              onClick={() => onExplainClick && onExplainClick(recommendation)}
              className="badge badge-ai border-0 text-start d-flex align-items-center gap-1 ai-pulse cursor-pointer"
              title="Click to view AI recommendation reasoning"
            >
              <Sparkles size={12} /> {recommendation.matchScore}% AI Match
            </button>
          )}
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`btn btn-sm rounded-circle position-absolute top-0 end-0 m-3 ${
            isFavorited ? 'btn-danger text-white' : 'btn-dark text-white-50'
          }`}
          title="Save Favorite"
        >
          <Heart size={16} fill={isFavorited ? 'white' : 'none'} />
        </button>

        <div className="position-absolute bottom-0 start-0 m-3">
          <span className="badge bg-dark bg-opacity-75 text-white border border-secondary">
            {property.propertyType}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <h4 className="fw-bold gradient-text mb-0">{formatPrice(property.price)}</h4>
          <span className="small text-secondary">₹{property.pricePerSqFt}/sq.ft</span>
        </div>

        <h6 className="card-title text-white text-truncate fw-semibold mb-2" title={property.title}>
          {property.title}
        </h6>

        <p className="small text-secondary d-flex align-items-center gap-1 mb-3">
          <MapPin size={14} className="text-danger flex-shrink-0" />
          <span className="text-truncate">{property.locality}, {property.city}</span>
        </p>

        <div className="d-flex justify-content-around bg-dark bg-opacity-50 rounded-3 p-2 text-center text-secondary small mb-3 border border-secondary">
          <div className="d-flex align-items-center gap-1">
            <Bed size={15} className="text-indigo" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="vr border-secondary"></div>
          <div className="d-flex align-items-center gap-1">
            <Bath size={15} className="text-indigo" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="vr border-secondary"></div>
          <div className="d-flex align-items-center gap-1">
            <Maximize2 size={15} className="text-indigo" />
            <span>{property.area} sq.ft</span>
          </div>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link to={`/properties/${property._id}`} className="btn btn-sm btn-outline-light flex-grow-1">
            View Details
          </Link>
          {onCompareSelect && (
            <button
              onClick={() => onCompareSelect(property)}
              className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
              title="Add to Compare"
            >
              <GitCompare size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
