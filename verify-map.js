// Simple verification script to check if map elements are working
// Run this in browser console when on Customer Locations page

console.log('🗺️ Verifying Leaflet Map Implementation...');

// Check if Leaflet is loaded
if (typeof window.L !== 'undefined') {
  console.log('✅ Leaflet library loaded successfully');
} else {
  console.log('❌ Leaflet library not found');
}

// Check if map container exists
const mapContainer = document.querySelector('.leaflet-container');
if (mapContainer) {
  console.log('✅ Map container found');
  console.log('   - Container size:', mapContainer.offsetWidth + 'x' + mapContainer.offsetHeight);
} else {
  console.log('❌ Map container not found');
}

// Check if tiles are loaded
const tiles = document.querySelectorAll('.leaflet-tile');
console.log(`📍 Map tiles loaded: ${tiles.length}`);

// Check if custom markers exist
const customMarkers = document.querySelectorAll('.custom-marker');
console.log(`🎯 Custom markers found: ${customMarkers.length}`);

// Check marker colors
customMarkers.forEach((marker, index) => {
  const style = marker.querySelector('div').style.backgroundColor;
  console.log(`   Marker ${index + 1}: ${style}`);
});

// Check if legend exists
const legend = document.querySelector('[class*="p-3"][class*="border-t"]');
if (legend && legend.textContent.includes('Legend')) {
  console.log('✅ Legend found below map');
} else {
  console.log('❌ Legend not found');
}

// Check if Google Maps attribution exists
const attribution = document.querySelector('.leaflet-control-attribution');
if (attribution && attribution.textContent.includes('Google Maps')) {
  console.log('✅ Google Maps attribution found');
} else {
  console.log('❌ Google Maps attribution missing');
}

console.log('🏁 Map verification complete');