import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Property } from '../types';

interface NaturalLanguageSearchBoxProps {
  onSearchCompleted: (result: { properties: Property[]; extractedParams: any }) => void;
}

export const NaturalLanguageSearchBox: React.FC<NaturalLanguageSearchBoxProps> = ({ onSearchCompleted }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedParams, setExtractedParams] = useState<any | null>(null);

  const samplePrompts = [
    '3BHK apartment in OMR under 80 lakhs with parking',
    'Independent villa near ECR with swimming pool',
    '2BHK flat in Velachery under 60 lakhs near metro',
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const data = await aiService.nlpSearch(prompt);
      setExtractedParams(data.extracted_parameters);
      onSearchCompleted({ properties: data.properties, extractedParams: data.extracted_parameters });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setPrompt(sampleText);
  };

  return (
    <div className="glass-panel p-4 mb-4 position-relative overflow-hidden border border-indigo">
      <div className="d-flex align-items-center gap-2 mb-2 text-white fw-bold fs-5">
        <Sparkles className="text-indigo ai-pulse" size={22} />
        <span>Natural Language <span className="gradient-text">AI Search Engine</span></span>
      </div>
      <p className="text-secondary small mb-3">
        Describe your dream property in simple English. Our AI will automatically parse intent into structured database search filters.
      </p>

      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group input-group-lg glass-panel p-1 border-secondary">
          <input
            type="text"
            className="form-control bg-transparent text-white border-0 shadow-none fs-6"
            placeholder="e.g. 'I need a 3BHK apartment in OMR under 80 lakhs with parking'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" className="btn gradient-btn px-4 d-flex align-items-center gap-2 rounded-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span> Parsing...
              </>
            ) : (
              <>
                AI Search <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span className="small text-secondary fw-medium me-1">Try asking:</span>
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-sm btn-outline-secondary text-white-50 rounded-pill py-0 px-2 small"
            onClick={() => handleSampleClick(sample)}
          >
            "{sample}"
          </button>
        ))}
      </div>

      {extractedParams && Object.keys(extractedParams).length > 0 && (
        <div className="mt-3 p-3 bg-dark bg-opacity-75 rounded-3 border border-secondary">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-indigo fw-semibold d-flex align-items-center gap-1">
              <CheckCircle2 size={14} /> AI Parsed Structured Search Parameters:
            </span>
            <span className="badge bg-indigo bg-opacity-25 text-indigo">Confidence 94%</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {extractedParams.propertyType && (
              <span className="badge bg-secondary">Type: {extractedParams.propertyType}</span>
            )}
            {extractedParams.bedrooms && (
              <span className="badge bg-secondary">{extractedParams.bedrooms} BHK</span>
            )}
            {extractedParams.maxPrice && (
              <span className="badge bg-secondary">Max Budget: ₹{(extractedParams.maxPrice / 100000).toFixed(0)} Lakhs</span>
            )}
            {extractedParams.locality && (
              <span className="badge bg-secondary">Locality: {extractedParams.locality}</span>
            )}
            {extractedParams.city && (
              <span className="badge bg-secondary">City: {extractedParams.city}</span>
            )}
            {extractedParams.parking && (
              <span className="badge bg-secondary">Parking: Yes</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
