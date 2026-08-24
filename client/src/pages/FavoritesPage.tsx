import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await propertyService.getFavorites();
      const props = data.map((f: any) => f.propertyId).filter(Boolean);
      setFavorites(props);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Heart className="text-danger" size={28} fill="currentColor" />
        <h2 className="fw-bold text-white mb-0">Saved Favorite Properties</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-indigo"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="glass-panel p-5 text-center text-secondary">
          <Heart size={48} className="text-secondary mb-3" />
          <h5>No Saved Properties Yet</h5>
          <p className="small mb-3">Click the heart icon on any property card to save it to your wishlist.</p>
          <Link to="/properties" className="btn gradient-btn">Browse Properties</Link>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((p) => (
            <div key={p._id} className="col-md-6 col-lg-4">
              <PropertyCard property={p} onFavoriteToggle={fetchFavorites} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
