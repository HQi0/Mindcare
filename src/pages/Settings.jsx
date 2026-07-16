import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getProfile, getPrivacySettings, getAppSettings, getActiveSessions, updateProfile } from '../services/settingsService.js';
import { updatePassword } from '../services/authService.js';
import {
  IdentityCard,
  WellbeingCard,
  PrivacySection,
  AppPreferencesSection,
  SessionManagementCard,
  DangerZoneCard,
  SupportFooter,
  EditProfileModal,
  ChangePasswordModal
} from '../components/settings/SettingsSections.jsx';

export default function Settings() {
  const { data: profile, refetch: refetchProfile } = useFetch(getProfile, []);
  const { data: privacySettings } = useFetch(getPrivacySettings, []);
  const { data: appSettings } = useFetch(getAppSettings, []);
  const { data: sessions } = useFetch(getActiveSessions, []);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSaveProfile = async (alias, subtitle, avatarFile) => {
    await updateProfile(alias, subtitle, avatarFile);
    await refetchProfile();
    setShowEditModal(false);
  };

  const handleSavePassword = async (oldPassword, newPassword) => {
    await updatePassword(oldPassword, newPassword);
    setShowPasswordModal(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex gap-6">
        <IdentityCard profile={profile} onEditClick={() => setShowEditModal(true)} />
        <WellbeingCard profile={profile} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 flex flex-col gap-6">
          <PrivacySection settings={privacySettings} />
          <AppPreferencesSection settings={appSettings} />
        </div>
        <div className="flex flex-col gap-6">
          <SessionManagementCard sessions={sessions} />
          <DangerZoneCard />
          <SupportFooter />
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setShowEditModal(false)} 
          onSave={handleSaveProfile}
          onChangePasswordClick={() => {
            setShowEditModal(false);
            setShowPasswordModal(true);
          }}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal 
          onClose={() => setShowPasswordModal(false)}
          onSave={handleSavePassword}
        />
      )}
    </div>
  );
}
