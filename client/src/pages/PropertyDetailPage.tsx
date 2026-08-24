import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property, PricePrediction } from '../types';
import { propertyService } from '../services/propertyService';
import { aiService } from '../services/aiService';
import { PropertyMap } from '../components/PropertyMap';
import { ScheduleVisitModal } from '../components/ScheduleVisitModal';
import { InquiryModal } from '../components/InquiryModal';
import {
  Bed, Bath, Maximize2, MapPin, Calendar, CheckCircle2, ShieldCheck,
  Sparkles, Phone, Mail, User, AlertTriangle, GitCompare, Heart
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prop = await propertyService.getById(id);
        setProperty(prop);

        // Run XGBoost market valuation predictor
        const pred = await aiService.predictPrice({
          city: prop.city,
          locality: prop.locality,
          propertyType: prop.propertyType,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          area: prop.area,
          propertyAge: prop.propertyAge,
          floor: prop.floor,
          amenities: prop.amenities,
          parking: prop.parking,
        });
        setPrediction(pred);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-indigo"></div>
        <p className="text-secondary mt-2">Loading property specs & AI market estimate...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h3>Property Not Found</h3>
        <Link to="/properties" className="btn btn-sm btn-outline-light mt-3">Back to Search</Link>
      </div>
    );
  }

  const agent = typeof property.agentId === 'object' ? property.agentId : null;

  return (
    <div className="container py-4">
      {/* Header Info */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-indigo">{property.propertyType}</span>
            <span className="badge bg-secondary">{property.constructionStatus}</span>
            {property.verificationStatus === 'APPROVED' && (
              <span className="badge badge-verified d-flex align-items-center gap-1">
                <ShieldCheck size={12} /> Verified Listing
              </span>
            )}
            {property.fraudRiskScore >= 50 && (
              <span className="badge badge-fraud d-flex align-items-center gap-1">
                <AlertTriangle size={12} /> Flagged Fraud Risk {property.fraudRiskScore}/100
              </span>
            )}
          </div>
          <h2 className="fw-bold text-white mb-1">{property.title}</h2>
          <p className="text-secondary d-flex align-items-center gap-1 mb-0">
            <MapPin size={16} className="text-danger" /> {property.address}, {property.locality}, {property.city}
          </p>
        </div>

        <div className="text-md-end">
          <h2 className="fw-extrabold gradient-text mb-0">
            ₹{(property.price / 100000).toFixed(2)} Lakhs
          </h2>
          <span className="small text-secondary">₹{property.pricePerSqFt} / sq.ft</span>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="glass-panel overflow-hidden position-relative mb-3" style={{ height: 420 }}>
            <img
              src={property.images[activeImgIndex] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {property.images.length > 1 && (
            <div className="d-flex gap-2 overflow-auto pb-2">
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumbnail"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`rounded border cursor-pointer ${activeImgIndex === idx ? 'border-indigo' : 'border-secondary'}`}
                  style={{ width: 90, height: 70, objectFit: 'cover', opacity: activeImgIndex === idx ? 1 : 0.6 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Panel & Agent Card */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 mb-4">
            <h5 className="fw-bold text-white mb-3">Schedule or Inquire</h5>
            <div className="d-grid gap-2 mb-3">
              <button onClick={() => setShowScheduleModal(true)} className="btn gradient-btn py-2 d-flex align-items-center justify-content-center gap-2">
                <Calendar size={18} /> Schedule Site Visit
              </button>
              <button onClick={() => setShowInquiryModal(true)} className="btn btn-outline-light py-2">
                Contact Agent
              </button>
            </div>

            <div className="d-flex justify-content-around text-secondary small pt-2 border-top border-secondary">
              <span className="d-flex align-items-center gap-1"><Heart size={14} /> {property.favoritesCount} Saved</span>
              <span className="d-flex align-items-center gap-1"><User size={14} /> {property.views} Views</span>
            </div>
          </div>

          {/* AI Estimated Market Valuation Card */}
          {prediction && (
            <div className="glass-panel p-4 mb-4 border-indigo">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-white d-flex align-items-center gap-1">
                  <Sparkles className="text-indigo ai-pulse" size={18} /> AI Market Estimate
                </span>
                <span className="badge bg-indigo bg-opacity-25 text-indigo">XGBoost ML Model</span>
              </div>
              <div className="fs-4 fw-bold text-indigo mb-1">
                ₹{(prediction.predicted_price / 100000).toFixed(2)} Lakhs
              </div>
              <p className="small text-secondary mb-2">
                Estimated range: ₹{(prediction.lower_bound / 100000).toFixed(1)}L - ₹{(prediction.upper_bound / 100000).toFixed(1)}L ({prediction.confidence_interval} CI)
              </p>
              <div className="small text-white-50">
                {property.price < prediction.lower_bound ? (
                  <span className="text-success fw-semibold">Good Value: Priced 6% below predicted market rate</span>
                ) : (
                  <span>Fair market pricing aligned with comparable listings</span>
                )}
              </div>
            </div>
          )}

          {/* Agent Information */}
          {agent && (
            <div className="glass-panel p-3">
              <h6 className="fw-bold text-white mb-2">Listing Agent</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="gradient-btn rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                  <User size={24} />
                </div>
                <div>
                  <h6 className="fw-semibold text-white mb-0">{agent.name}</h6>
                  <span className="small text-secondary">{agent.agencyName || 'Verified Agent'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Overview Specifications Grid */}
      <div className="glass-panel p-4 mb-5">
        <h4 className="fw-bold text-white mb-4">Property Specifications</h4>
        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Bedrooms</div>
            <div className="fw-bold text-white fs-5">{property.bedrooms} BHK</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Bathrooms</div>
            <div className="fw-bold text-white fs-5">{property.bathrooms} Bath</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Super Built-up Area</div>
            <div className="fw-bold text-white fs-5">{property.area} sq.ft</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Floor Level</div>
            <div className="fw-bold text-white fs-5">Floor {property.floor} of {property.totalFloors}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Furnished Status</div>
            <div className="fw-bold text-white fs-5">{property.furnishedStatus}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Property Age</div>
            <div className="fw-bold text-white fs-5">{property.propertyAge} Years</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Parking Space</div>
            <div className="fw-bold text-white fs-5">{property.parking ? 'Reserved Parking' : 'No Parking'}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-secondary small">Negotiable Price</div>
            <div className="fw-bold text-white fs-5">{property.negotiable ? 'Yes' : 'Fixed Price'}</div>
          </div>
        </div>
      </div>

      {/* Description & Amenities */}
      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-3">About This Property</h4>
            <p className="text-secondary leading-relaxed mb-0">{property.description}</p>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-3">Amenities</h4>
            <div className="d-flex flex-wrap gap-2">
              {property.amenities.map((item, idx) => (
                <span key={idx} className="badge bg-dark border border-secondary text-white-50 p-2">
                  <CheckCircle2 size={14} className="text-success me-1" /> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geospatial Location Map */}
      <div className="mb-5">
        <h4 className="fw-bold text-white mb-3">Locality Map</h4>
        <PropertyMap properties={[property]} center={[property.latitude, property.longitude]} zoom={14} height="380px" />
      </div>

      <ScheduleVisitModal property={showScheduleModal ? property : null} onClose={() => setShowScheduleModal(false)} />
      <InquiryModal property={showInquiryModal ? property : null} onClose={() => setShowInquiryModal(false)} />
    </div>
  );
};
