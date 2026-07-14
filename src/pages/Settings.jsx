import useFetch from '../hooks/useFetch.js';
import { getProfile, getPrivacySettings, getAppSettings, getActiveSessions } from '../services/settingsService.js';
import {
  IdentityCard,
  WellbeingCard,
  PrivacySection,
  AppPreferencesSection,
  SessionManagementCard,
  DangerZoneCard,
  SupportFooter,
} from '../components/settings/SettingsSections.jsx';

export default function Settings() {
  const { data: profile } = useFetch(getProfile, []);
  const { data: privacySettings } = useFetch(getPrivacySettings, []);
  const { data: appSettings } = useFetch(getAppSettings, []);
  const { data: sessions } = useFetch(getActiveSessions, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex gap-6">
        <IdentityCard profile={profile} />
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
    </div>
  );
}
