import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Trash2,
  ImageOff,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Save,
} from 'lucide-react';

interface ProfileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasStoredProfile: boolean;
  hasUploadedPhotos: boolean;
  onSaveProfileLocally: () => void;
  onClearUploadedPhotos: () => void;
  onDeleteSavedProfile: () => void;
  onClearFavourites: () => void;
  onResetEntireApp: () => void;
  onEditProfile: () => void;
}

export const ProfileManagementModal: React.FC<ProfileManagementModalProps> = ({
  isOpen,
  onClose,
  hasStoredProfile,
  hasUploadedPhotos,
  onSaveProfileLocally,
  onClearUploadedPhotos,
  onDeleteSavedProfile,
  onClearFavourites,
  onResetEntireApp,
  onEditProfile,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-sand-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-700" />
            <h3 className="font-serif text-2xl font-bold text-sand-950">
              Profile & Privacy Controls
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-200 text-sand-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Privacy Status */}
          <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-sand-700 space-y-1">
            <div className="font-semibold text-sand-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Local Storage Overview
            </div>
            <p className="text-[11px] leading-relaxed">
              Photographs are held strictly in temporary browser memory. When you persist your profile, only your colour measurements, finish choices, and budget numbers are stored in your device's localStorage.
            </p>
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            {/* Save current profile to local storage */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-sand-200 bg-white hover:bg-sand-50 transition-colors">
              <div>
                <div className="font-semibold text-sand-900">Save Profile Locally</div>
                <div className="text-[11px] text-sand-500">
                  {hasStoredProfile ? 'Profile currently stored in your browser' : 'Store preferences on this device'}
                </div>
              </div>
              <button
                onClick={() => {
                  onSaveProfileLocally();
                  showNotification('Profile successfully saved in localStorage.');
                }}
                className="px-3 py-1.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white font-medium flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            {/* Edit Profile */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-sand-200 bg-white hover:bg-sand-50 transition-colors">
              <div>
                <div className="font-semibold text-sand-900">Edit Beauty Profile</div>
                <div className="text-[11px] text-sand-500">Update goals, skin depth, undertone, or budget</div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onEditProfile();
                }}
                className="px-3 py-1.5 rounded-full border border-sand-300 text-sand-800 hover:bg-sand-100 font-medium"
              >
                Edit
              </button>
            </div>

            {/* Clear Uploaded Photographs from memory */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-sand-200 bg-white hover:bg-sand-50 transition-colors">
              <div>
                <div className="font-semibold text-sand-900">Clear Uploaded Photographs</div>
                <div className="text-[11px] text-sand-500">
                  {hasUploadedPhotos ? 'Removes image binaries immediately from browser memory' : 'No photographs currently loaded'}
                </div>
              </div>
              <button
                onClick={() => {
                  onClearUploadedPhotos();
                  showNotification('Uploaded photographs cleared from browser memory.');
                }}
                disabled={!hasUploadedPhotos}
                className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${
                  hasUploadedPhotos
                    ? 'border border-sand-300 text-sand-800 hover:bg-sand-100'
                    : 'text-sand-400 border border-sand-200 cursor-not-allowed'
                }`}
              >
                <ImageOff className="w-3.5 h-3.5" />
                <span>Clear Photos</span>
              </button>
            </div>

            {/* Delete Saved Profile Data */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-rosewood-100 bg-rosewood-50/40">
              <div>
                <div className="font-semibold text-rosewood-900">Delete Stored Profile Data</div>
                <div className="text-[11px] text-rosewood-600">Permanently removes your saved profile from localStorage</div>
              </div>
              <button
                onClick={() => {
                  onDeleteSavedProfile();
                  showNotification('Saved profile removed from localStorage.');
                }}
                disabled={!hasStoredProfile}
                className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${
                  hasStoredProfile
                    ? 'bg-rosewood-700 hover:bg-rosewood-800 text-white'
                    : 'bg-sand-200 text-sand-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Data</span>
              </button>
            </div>

            {/* Clear Favourites */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-sand-200 bg-white hover:bg-sand-50 transition-colors">
              <div>
                <div className="font-semibold text-sand-900">Clear All Saved Favourites</div>
                <div className="text-[11px] text-sand-500">Empties your saved product list</div>
              </div>
              <button
                onClick={() => {
                  onClearFavourites();
                  showNotification('Favourites list cleared.');
                }}
                className="px-3 py-1.5 rounded-full border border-sand-300 text-sand-800 hover:bg-sand-100 font-medium"
              >
                Clear
              </button>
            </div>

            {/* Reset Application Completely */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-red-200 bg-red-50/60 mt-4">
              <div>
                <div className="font-semibold text-red-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Reset Entire Application
                </div>
                <div className="text-[11px] text-red-700">
                  Clears all storage, memory, photos, and returns to Welcome page
                </div>
              </div>
              <button
                onClick={() => {
                  onResetEntireApp();
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium flex items-center gap-1 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
