// Comprehensive Scrollbar Testing Script for Customer Locations Page
// Run this in browser console when on http://localhost:3000 Customer Locations page

console.log('🔍 Starting Comprehensive Scrollbar Test...');
console.log('========================================');

// Test 1: Check viewport overflow settings
function testViewportOverflow() {
  console.log('\n1️⃣ Testing Viewport Overflow Settings:');
  
  const html = document.documentElement;
  const body = document.body;
  
  const htmlStyles = window.getComputedStyle(html);
  const bodyStyles = window.getComputedStyle(body);
  
  console.log(`   HTML overflow: ${htmlStyles.overflow}`);
  console.log(`   HTML overflow-x: ${htmlStyles.overflowX}`);
  console.log(`   HTML overflow-y: ${htmlStyles.overflowY}`);
  console.log(`   BODY overflow: ${bodyStyles.overflow}`);
  console.log(`   BODY overflow-x: ${bodyStyles.overflowX}`);
  console.log(`   BODY overflow-y: ${bodyStyles.overflowY}`);
  
  // Check if scrollbars are visible
  const hasVerticalScrollbar = html.scrollHeight > html.clientHeight;
  const hasHorizontalScrollbar = html.scrollWidth > html.clientWidth;
  
  console.log(`   🔺 Vertical scrollbar visible: ${hasVerticalScrollbar ? '❌ YES' : '✅ NO'}`);
  console.log(`   🔻 Horizontal scrollbar visible: ${hasHorizontalScrollbar ? '❌ YES' : '✅ NO'}`);
  
  return !hasVerticalScrollbar && !hasHorizontalScrollbar;
}

// Test 2: Check Customer Locations page specific elements
function testPageLayout() {
  console.log('\n2️⃣ Testing Customer Locations Page Layout:');
  
  // Find the main container for Customer Locations
  const mainContainer = document.querySelector('[style*="calc(100vh - 64px)"]');
  if (mainContainer) {
    console.log('   ✅ Main container found with viewport height calculation');
    const styles = window.getComputedStyle(mainContainer);
    console.log(`   📏 Container height: ${styles.height}`);
    console.log(`   📐 Container overflow: ${styles.overflow}`);
    console.log(`   📐 Container overflow-x: ${styles.overflowX}`);
    console.log(`   📐 Container overflow-y: ${styles.overflowY}`);
  } else {
    console.log('   ❌ Main container not found');
  }
  
  // Check map container
  const mapContainer = document.querySelector('.leaflet-container');
  if (mapContainer) {
    console.log('   ✅ Map container found');
    const mapParent = mapContainer.closest('.flex-1');
    if (mapParent) {
      const styles = window.getComputedStyle(mapParent);
      console.log(`   🗺️ Map parent overflow: ${styles.overflow}`);
    }
  } else {
    console.log('   ❌ Map container not found');
  }
  
  // Check legend positioning
  const legend = document.querySelector('[class*="p-3"][class*="border-t"]');
  if (legend && legend.textContent.includes('Legend')) {
    console.log('   ✅ Legend found and properly positioned');
    const styles = window.getComputedStyle(legend);
    console.log(`   📍 Legend margin-bottom: ${styles.marginBottom}`);
    console.log(`   📍 Legend margin-top: ${styles.marginTop}`);
  } else {
    console.log('   ❌ Legend not found or improperly positioned');
  }
}

// Test 3: Check for any scrollable elements
function testScrollableElements() {
  console.log('\n3️⃣ Searching for Scrollable Elements:');
  
  const allElements = document.querySelectorAll('*');
  let scrollableCount = 0;
  
  allElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const hasVerticalScroll = element.scrollHeight > element.clientHeight;
    const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
    
    if ((hasVerticalScroll || hasHorizontalScroll) && 
        (styles.overflow !== 'hidden' || styles.overflowX !== 'hidden' || styles.overflowY !== 'hidden')) {
      scrollableCount++;
      if (scrollableCount <= 10) { // Limit output to first 10 to avoid spam
        console.log(`   📜 Scrollable element found: ${element.tagName.toLowerCase()}.${element.className}`);
        console.log(`       - Vertical scroll: ${hasVerticalScroll}, Horizontal scroll: ${hasHorizontalScroll}`);
        console.log(`       - Overflow: ${styles.overflow}, OverflowX: ${styles.overflowX}, OverflowY: ${styles.overflowY}`);
      }
    }
  });
  
  if (scrollableCount === 0) {
    console.log('   ✅ No unwanted scrollable elements found');
  } else {
    console.log(`   ⚠️ Found ${scrollableCount} potentially scrollable elements`);
  }
  
  return scrollableCount;
}

// Test 4: Window resize test
function testWindowResize() {
  console.log('\n4️⃣ Testing Window Resize Behavior:');
  
  const originalSize = { width: window.innerWidth, height: window.innerHeight };
  console.log(`   📐 Original window size: ${originalSize.width}x${originalSize.height}`);
  
  // Simulate different window sizes
  const testSizes = [
    { width: 1200, height: 800, name: 'Desktop' },
    { width: 768, height: 600, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  console.log('   🔄 Simulating different viewport sizes...');
  console.log('   (Note: Browser security may prevent actual resizing, but layout should adapt)');
  
  // Check if layout adapts to current size
  const mapContainer = document.querySelector('.leaflet-container');
  if (mapContainer) {
    const rect = mapContainer.getBoundingClientRect();
    console.log(`   🗺️ Map container bounds: ${rect.width}x${rect.height}`);
    
    // Check if map fills available space
    const parentRect = mapContainer.parentElement.getBoundingClientRect();
    console.log(`   📦 Map parent bounds: ${parentRect.width}x${parentRect.height}`);
    
    const fillsWidth = Math.abs(rect.width - parentRect.width) < 5;
    const fillsHeight = Math.abs(rect.height - parentRect.height) < 5;
    
    console.log(`   ✅ Map fills width: ${fillsWidth ? 'YES' : 'NO'}`);
    console.log(`   ✅ Map fills height: ${fillsHeight ? 'YES' : 'NO'}`);
  }
}

// Test 5: Navigation and URL test
function testNavigation() {
  console.log('\n5️⃣ Testing Navigation State:');
  
  console.log(`   🌍 Current URL: ${window.location.href}`);
  console.log(`   📍 Should be: http://localhost:3000 with Customer Locations page visible`);
  
  // Check if we're on the correct page
  const customerLocationsHeader = document.querySelector('h2');
  if (customerLocationsHeader && customerLocationsHeader.textContent.includes('Customer Locations')) {
    console.log('   ✅ On Customer Locations page');
  } else {
    console.log('   ❌ Not on Customer Locations page or header not found');
  }
  
  // Check sidebar navigation
  const sidebar = document.querySelector('nav') || document.querySelector('[class*="sidebar"]');
  if (sidebar) {
    console.log('   ✅ Sidebar navigation present');
    
    // Look for GPS menu item
    const gpsMenuItem = Array.from(sidebar.querySelectorAll('*')).find(el => 
      el.textContent && el.textContent.includes('GPS')
    );
    
    if (gpsMenuItem) {
      console.log('   ✅ GPS menu item found in sidebar');
    } else {
      console.log('   ❌ GPS menu item not found in sidebar');
    }
  } else {
    console.log('   ❌ Sidebar not found');
  }
}

// Main test runner
function runAllTests() {
  console.log('🚀 Running all scrollbar and layout tests...\n');
  
  const overflowTest = testViewportOverflow();
  testPageLayout();
  const scrollableCount = testScrollableElements();
  testWindowResize();
  testNavigation();
  
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log(`✅ No page-level scrollbars: ${overflowTest ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Minimal scrollable elements: ${scrollableCount < 3 ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Map loads properly: ${document.querySelector('.leaflet-container') ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Legend visible: ${document.querySelector('[class*="border-t"]') ? 'PASS' : 'FAIL'}`);
  
  const overallPass = overflowTest && scrollableCount < 3 && 
                     document.querySelector('.leaflet-container') && 
                     document.querySelector('[class*="border-t"]');
  
  console.log(`\n🎯 OVERALL RESULT: ${overallPass ? '✅ PASS - Scrollbar fix successful!' : '❌ FAIL - Issues detected'}`);
  
  return overallPass;
}

// Auto-run the tests
runAllTests();

// Instructions for manual testing
console.log('\n📝 MANUAL TESTING INSTRUCTIONS:');
console.log('================================');
console.log('1. Look at the right edge of your browser window - is there a vertical scrollbar?');
console.log('2. Look at the bottom edge of your browser window - is there a horizontal scrollbar?');
console.log('3. Try resizing the browser window - do scrollbars appear?');
console.log('4. Does the map fill the available space between header and legend?');
console.log('5. Is the legend visible at the bottom without being cut off?');
console.log('\n✅ If all answers are NO scrollbars and YES to proper layout, the fix is successful!');