import { ads } from '../utils/ads';

export const showInterstitialAd = async () => {
  // Show interstitial after every 3 completed tasks
  await ads.showInterstitial();
};
