import React, { useState, useEffect } from 'react';
import { NaturalLanguageSearchBox } from '../components/NaturalLanguageSearchBox';
import { PropertyCard } from '../components/PropertyCard';
import { Property, RecommendationItem } from '../types';
import { propertyService } from '../services/propertyService';
import { aiService } from '../services/aiService';
import { Sparkles, TrendingUp, ShieldCheck, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhyThisPropertyModal } from '../components/WhyThisPropertyModal';

export const HomePage: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedRec, setSelectedRec] = useState<RecommendationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propData = await propertyService.searchProperties({ limit: 6 });
        setFeaturedProperties(propData.properties);

        const recData = await aiService.getRecommendations();
        setRecommendations(recData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNlpSearchResults = (result: { properties: Property[] }) => {
    setFeaturedProperties(result.properties);
  };

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="row align-items-center mb-5 py-4">
        <div className="col-lg-7">
          <span className="badge bg-indigo bg-opacity-25 text-indigo mb-3 p-2 px-3 rounded-pill fw-semibold border border-indigo d-inline-flex align-items-center gap-2">
            <Sparkles size={14} className="ai-pulse" /> AI-Driven Real Estate Intelligence v1.0
          </span>
          <h1 className="display-4 fw-extrabold text-white mb-3 leading-tight">
            Discover Homes Powered by <br />
            <span className="gradient-text">Machine Learning & AI</span>
          </h1>
          <p className="lead text-secondary mb-4">
            Smart property recommendations, ML price valuations, natural language search parsing, and automated fraud protection—built for buyers, agents, and administrators.
          </p>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 text-white-50">
              <TrendingUp className="text-success" size={20} />
              <span>XGBoost Valuation</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-white-50">
              <Sparkles className="text-indigo" size={20} />
              <span>Natural Language Search</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-white-50">
              <ShieldCheck className="text-warning" size={20} />
              <span>Listing Fraud Guard</span>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-panel p-4 text-center position-relative">
            <div className="display-6 fw-bold gradient-text mb-1">98.4%</div>
            <div className="text-secondary small mb-3">AI Price Prediction Accuracy</div>
            <hr className="border-secondary my-3" />
            <div className="row g-2 text-start">
              <div className="col-6">
                <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary">
                  <div className="fw-bold text-white fs-5">5,000+</div>
                  <div className="small text-secondary">Verified Properties</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary">
                  <div className="fw-bold text-white fs-5">&lt; 100ms</div>
                  <div className="small text-secondary">Geospatial Search</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Natural Language AI Search Box */}
      <NaturalLanguageSearchBox onSearchCompleted={handleNlpSearchResults} />

      {/* AI Recommendations Carousel / Grid */}
      {recommendations.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <Sparkles className="text-indigo" size={24} /> Top AI Recommendations for You
              </h3>
              <p className="text-secondary small mb-0">Ranked by hybrid content-vector matching & behavioral preferences</p>
            </div>
            <Link to="/properties" className="btn btn-sm btn-outline-light d-flex align-items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.propertyId} className="col-md-6 col-lg-4">
                <PropertyCard
                  property={rec.property}
                  recommendation={rec}
                  onExplainClick={(r) => setSelectedRec(r)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Properties Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
              <Building2 className="text-indigo" size={24} /> Featured Verified Listings
            </h3>
            <p className="text-secondary small mb-0">Explore hand-picked properties verified by platform administrators</p>
          </div>
          <Link to="/properties" className="btn btn-sm btn-outline-light">Browse All Properties</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-indigo"></div>
            <p className="text-secondary mt-2">Loading properties...</p>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProperties.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      <WhyThisPropertyModal recommendation={selectedRec} onClose={() => setSelectedRec(null)} />
    </div>
  );
};
