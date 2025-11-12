import { useEffect } from 'react';
import { ads } from '../utils/ads';

export default function BannerAdPlaceholder() {
  useEffect(() => {
    ads.logBannerImpression();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 z-30">
      <div className="h-16 flex items-center justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          [Ad Placeholder - Replace with AdMob]
        </p>
      </div>
    </div>
  );
}
