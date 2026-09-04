import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Sparkles, 
  FolderPlus, 
  MapPin, 
  Tag, 
  Calendar, 
  Download, 
  X, 
  Sliders, 
  HardDrive, 
  Image as ImageIcon,
  Check,
  Heart
} from 'lucide-react';
import { MagicMomentAlbum, MagicMomentPhoto } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const MagicMomentsView: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [albums, setAlbums] = useState<MagicMomentAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [photos, setPhotos] = useState<MagicMomentPhoto[]>([]);
  const [quotaInfo, setQuotaInfo] = useState<{ usedBytes: number; quotaBytes: number; percentage: number }>({
    usedBytes: 0,
    quotaBytes: 20 * 1024 * 1024,
    percentage: 0
  });

  // Modals & Active Viewers
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumTrip, setNewAlbumTrip] = useState('Bali Tropical Escapade');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<MagicMomentPhoto | null>(null);

  // Upload state
  const [uploadLocation, setUploadLocation] = useState('Bali, Indonesia');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadTags, setUploadTags] = useState('vacation, scenic');
  const [isUploading, setIsUploading] = useState(false);

  const loadData = async () => {
    try {
      const [albumList, quota] = await Promise.all([
        api.getAlbums(),
        api.getStorageQuota()
      ]);
      setAlbums(albumList);
      setQuotaInfo(quota);

      if (albumList.length > 0) {
        const firstId = selectedAlbumId || albumList[0].id;
        setSelectedAlbumId(firstId);
        const photoList = await api.getPhotos(firstId);
        setPhotos(photoList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectAlbum = async (albumId: string) => {
    setSelectedAlbumId(albumId);
    try {
      const list = await api.getPhotos(albumId);
      setPhotos(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    try {
      const created = await api.createAlbum({
        title: newAlbumTitle,
        destinationName: newAlbumTrip
      });
      setAlbums(prev => [created, ...prev]);
      setSelectedAlbumId(created.id);
      setPhotos([]);
      setCreateAlbumModalOpen(false);
      setNewAlbumTitle('');
      success('Album Created', `Created album "${created.title}"`);
    } catch (err: any) {
      error('Creation Error', err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      error('File Too Large', 'Maximum single file upload size is 15 MB.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('albumId', selectedAlbumId);
      formData.append('caption', uploadCaption || file.name);
      formData.append('locationName', uploadLocation || 'Scenic Location');
      formData.append('tags', uploadTags || 'Travel, Memory');

      const uploaded = await api.uploadPhoto(formData);

      setPhotos(prev => [uploaded, ...prev]);
      setUploadCaption('');
      await loadData();
      success('Memory Uploaded!', 'Photo stored in your Magic Moments cloud vault.');
    } catch (err: any) {
      error('Upload Failed', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnhanceFilter = async (photoId: string, filter: string) => {
    try {
      const res = await api.enhancePhoto(photoId, filter);
      setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, url: res.enhancedUrl } : p));
      if (activeLightboxPhoto?.id === photoId) {
        setActiveLightboxPhoto(prev => prev ? { ...prev, url: res.enhancedUrl } : null);
      }
      success('AI Filter Applied', `Photo adjusted with ${filter} preset.`);
    } catch (err: any) {
      error('Filter Error', err.message);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await api.deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      if (activeLightboxPhoto?.id === photoId) {
        setActiveLightboxPhoto(null);
      }
      await loadData();
      success('Photo Deleted', 'Quota space successfully reclaimed.');
    } catch (err: any) {
      error('Delete Error', err.message);
    }
  };

  const usedMB = (quotaInfo.usedBytes / (1024 * 1024)).toFixed(1);
  const totalMB = (quotaInfo.quotaBytes / (1024 * 1024)).toFixed(0);

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* 1. Header & Quota Meter */}
      <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            Trip Memory Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Magic Moments Photo Albums & AI Enhancer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserve high-resolution memories, apply neural filters, and manage your cloud quota.
          </p>
        </div>

        {/* 20MB Quota Progress Box */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-72 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HardDrive className="w-4 h-4 text-sky-600" />
              <span>Storage Quota</span>
            </div>
            <span className="font-mono text-slate-500 font-semibold">{usedMB} MB / {totalMB} MB</span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                quotaInfo.percentage > 85 ? 'bg-rose-500' :
                quotaInfo.percentage > 60 ? 'bg-amber-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(quotaInfo.percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>{quotaInfo.percentage}% used</span>
            <span>20 MB Free Tier Limit</span>
          </div>
        </div>
      </div>

      {/* 2. Album Selector Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {albums.map(a => (
            <button
              key={a.id}
              onClick={() => handleSelectAlbum(a.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedAlbumId === a.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              📁 {a.title} ({a.photoCount})
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateAlbumModalOpen(true)}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Album</span>
        </button>
      </div>

      {/* 3. Upload Box & Photos Grid */}
      <div className="space-y-6">
        {/* Upload Drawer / Strip */}
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-sky-400 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Memory Caption</label>
              <input
                type="text"
                placeholder="e.g. Sunset drinks at Uluwatu Cliffside..."
                value={uploadCaption}
                onChange={e => setUploadCaption(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Tag</label>
              <input
                type="text"
                value={uploadLocation}
                onChange={e => setUploadLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <label className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No memories uploaded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your high-res holiday shots above to store and enhance with AI neural filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map(photo => (
              <div
                key={photo.id}
                onClick={() => setActiveLightboxPhoto(photo)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Filter badge if any */}
                  {photo.appliedFilter && photo.appliedFilter !== 'none' && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-sky-500 text-white text-[10px] font-bold rounded-full shadow-sm capitalize">
                      ✨ {photo.appliedFilter}
                    </span>
                  )}

                  <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    📍 {photo.location}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{photo.caption}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{(photo.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {photo.tags?.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PHOTO LIGHTBOX & AI FILTER STUDIO MODAL */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold">{activeLightboxPhoto.caption}</span>
              </div>
              <button
                onClick={() => setActiveLightboxPhoto(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Center Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[380px] p-4">
              <img
                src={activeLightboxPhoto.imageUrl}
                alt={activeLightboxPhoto.caption}
                className="max-h-[60vh] max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Neural Filters & EXIF controls */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">AI Neural Enhancements:</span>
                  {(['none', 'sunset-glow', 'vibrant', 'vintage', 'auto-enhance'] as const).map(filterName => (
                    <button
                      key={filterName}
                      onClick={() => handleEnhanceFilter(activeLightboxPhoto.id, filterName)}
                      className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all ${
                        activeLightboxPhoto.appliedFilter === filterName
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {filterName.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeletePhoto(activeLightboxPhoto.id)}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metadata strip */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 text-[11px]">
                <div>📍 Location: <span className="text-slate-200">{activeLightboxPhoto.location}</span></div>
                <div>💾 Size: <span className="text-slate-200">{(activeLightboxPhoto.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span></div>
                <div>📅 Date: <span className="text-slate-200">{new Date(activeLightboxPhoto.uploadedAt).toLocaleDateString()}</span></div>
                <div>🏷️ Tags: <span className="text-slate-200">{activeLightboxPhoto.tags?.join(', ') || 'None'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ALBUM MODAL */}
      {createAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Photo Album</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiss Alpine Winter Moments"
                  value={newAlbumTitle}
                  onChange={e => setNewAlbumTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Trip</label>
                <input
                  type="text"
                  value={newAlbumTrip}
                  onChange={e => setNewAlbumTrip(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateAlbumModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-md"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
