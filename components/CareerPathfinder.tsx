
import React, { useState, useCallback } from 'react';
import { SUBJECTS } from '../constants';
import { Subject, CareerSuggestion } from '../types';
import { suggestCareersForSubjects } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import BackButton from './common/BackButton';
import { Lightbulb, Briefcase } from 'lucide-react';

interface CareerPathfinderProps {
  onBack: () => void;
}

const CareerPathfinder: React.FC<CareerPathfinderProps> = ({ onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((prev) =>
      prev.some((s) => s.id === subject.id)
        ? prev.filter((s) => s.id !== subject.id)
        : [...prev, subject]
    );
  };

  const handleSubmit = useCallback(async () => {
    if (selectedSubjects.length === 0) {
      setError("Vui lòng chọn ít nhất một môn học.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsSubmitted(true);
    try {
      const subjectNames = selectedSubjects.map((s) => s.name);
      const result = await suggestCareersForSubjects(subjectNames);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubjects]);
  
  const reset = () => {
      setIsSubmitted(false);
      setSelectedSubjects([]);
      setSuggestions([]);
      setError(null);
  }

  if (isSubmitted) {
    return (
        <div>
            <BackButton onClick={reset} />
            <h2 className="text-2xl font-bold text-center mb-2">Gợi ý nghề nghiệp dựa trên sở thích của bạn</h2>
            <p className="text-center text-slate-600 mb-8">
                Các môn học đã chọn: {selectedSubjects.map(s => s.name).join(', ')}
            </p>

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

            {!isLoading && !error && (
                <div className="space-y-6">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 transition-transform transform hover:scale-105 duration-300">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                                {suggestion.careerName}
                            </h3>
                            <p className="mt-2 text-slate-600">{suggestion.description}</p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                <h4 className="font-semibold text-slate-700 flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                    Lý do phù hợp:
                                </h4>
                                <p className="mt-1 text-slate-600 text-sm">{suggestion.suitability}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <div>
        <BackButton onClick={onBack} />
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Định hướng nghề nghiệp</h2>
            <p className="mt-2 text-slate-600">Chọn những môn học bạn yêu thích hoặc học tốt nhất để AI gợi ý con đường sự nghiệp.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.some(s => s.id === subject.id);
                return (
                    <button
                        key={subject.id}
                        onClick={() => toggleSubject(subject)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
                            isSelected 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white text-slate-700 hover:bg-indigo-50'
                        }`}
                    >
                        {subject.name}
                    </button>
                )
            })}
        </div>
        
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <div className="mt-10 text-center">
            <button
                onClick={handleSubmit}
                disabled={selectedSubjects.length === 0 || isLoading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300"
            >
                {isLoading ? 'Đang phân tích...' : 'Nhận gợi ý từ AI'}
            </button>
        </div>
    </div>
  );
};

export default CareerPathfinder;
