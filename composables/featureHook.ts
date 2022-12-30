export default function featureHook() {
  function isProductionMode() {
    return import.meta.env.MODE === 'production'
  }

  function isDarkModeEnabled() {
    return import.meta.env.VITE_FEATURE_ENABLED_DARKMODE
  }

  return {
    isProductionMode,
    isDarkModeEnabled,
  }
}
