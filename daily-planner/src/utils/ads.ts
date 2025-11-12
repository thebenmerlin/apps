// AdMob placeholder utilities
export const ads = {
  bannerId: import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111',
  interstitialId: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712',

  logBannerImpression(): void {
    console.log('[AdMob Placeholder] Banner ad impression');
  },

  logInterstitialShow(): void {
    console.log('[AdMob Placeholder] Interstitial ad shown');
  },

  // Placeholder for future AdMob integration
  async showInterstitial(): Promise<void> {
    this.logInterstitialShow();
    // In production, this would call AdMob SDK
    return Promise.resolve();
  },
};
