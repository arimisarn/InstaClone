import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ModicationPage: React.FC = () => {
  const [showThreadsBadge, setShowThreadsBadge] = useState(false);
  const [showAccountSuggestions, setShowAccountSuggestions] = useState(true);
  const [bio, setBio] = useState('');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto">
        {/* Header avec profil */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg">armisa_nathaliee</h1>
              <p className="text-gray-400 text-sm">Natha Randrianaivosoā</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Modifier la photo
          </button>
        </div>

        {/* Site Web Section */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Site Web</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 font-medium mb-2">Site Web</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              La modification des liens est disponible uniquement sur mobile. Rendez-vous sur l'application Instagram et 
              modifiez votre profil pour changer les sites Web dans votre bio.
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Bio</h2>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
              rows={3}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {bio.length} / 150
            </div>
          </div>
        </div>

        {/* Threads Badge Section */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Afficher le badge Threads</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Afficher le badge Threads</span>
            <button
              onClick={() => setShowThreadsBadge(!showThreadsBadge)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showThreadsBadge ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showThreadsBadge ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Genre Section */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Genre</h2>
          <div className="relative">
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors">
              <option value="">Je préfère ne pas répondre</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Ceci ne sera pas affiché sur votre profil public.
          </p>
        </div>

        {/* Account Suggestions Section */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Afficher les suggestions de compte sur les profils</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Afficher les suggestions de compte sur les profils</span>
              <button
                onClick={() => setShowAccountSuggestions(!showAccountSuggestions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showAccountSuggestions ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showAccountSuggestions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Choisissez si les personnes peuvent voir des suggestions de comptes similaires sur votre profil et 
              si votre compte peut être suggéré sur d'autres profils.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4">
          <p className="text-gray-500 text-sm mb-1">
            Certaines informations de profil, comme votre nom, votre bio et vos liens, sont visibles par tout le monde.
          </p>
          <button className="text-blue-500 text-sm hover:underline">
            Découvrez les informations de profil visibles
          </button>
        </div>

        {/* Send Button */}
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModicationPage;