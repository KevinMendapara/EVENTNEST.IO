// EventNest External API Integrations Configuration
// =========================================================================
// SECURITY WARNING: NEVER store private api keys or server-side secret tokens here.
// Frontend-only keys such as publishable public keys and IDs are safe to expose
// for browser requests, but private operations should happen behind a server proxy.
// =========================================================================

const API_CONFIG = {
    // 1. EmailJS Configuration (Public Browser IDs)
    // Get your public keys from https://dashboard.emailjs.com/
    EMAILJS_PUBLIC_KEY: "",     // Insert your EmailJS Public Key here
    EMAILJS_SERVICE_ID: "",      // Insert your EmailJS Service ID here
    EMAILJS_TEMPLATE_ID: "",     // Insert your EmailJS Template ID here

    // 2. Google Maps Configuration
    // Add your public key if using dynamic maps API features, otherwise it defaults to the free iframe search.
    GOOGLE_MAPS_API_KEY: "",

    // 3. OneSignal Push Notifications Configuration
    // Get your App ID from https://dashboard.onesignal.com/
    ONESIGNAL_APP_ID: "",        // Insert your OneSignal App ID here

    // 4. OpenWeatherMap Configuration
    // Get your API key from https://openweathermap.org/api
    // NOTE: For production, this weather request should be proxied through the backend server
    // to shield your API key from user inspection.
    OPENWEATHERMAP_API_KEY: ""   // Insert your OpenWeatherMap API key here
};
window.API_CONFIG = API_CONFIG;
