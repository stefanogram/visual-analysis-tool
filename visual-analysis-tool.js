#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Visual Analysis Tool for Cross-Device Compatibility
 * Analyzes baseline screenshots to identify layout issues
 * 2025 Standards Compliance
 * This tool is a personal swiss tool for my locakl development framework, if you have any quesitons
 * drop a message ;)
 */
class VisualAnalyzer {
  constructor() {
    this.baselinesDir = 'visual-tests/baselines';
    this.devices = ['Mobile', 'Mobile-Large', 'Tablet', 'Desktop'];
     // Add your (localhost) pages here to analyze. Example: ['home', 'about', 'services', 'contact', 'blog']
    this.pages = ['addpagehere', 'addpagehere', 'addpagehere', 'addpagehere', 'addpagehere'];
    this.issues = [];
  }

  async analyze() {
    console.log('Starting Cross-Device Visual Analysis...');
    console.log('2025 Mobile-First Responsive Design Standards Check\n');

    // Check file sizes (indicates content complexity differences)
    this.analyzeSizes();
    
    // Check for missing files
    this.checkMissingFiles();
    
    // Analyze specific compatibility patterns
    this.analyzeLayoutPatterns();
    
    // Generate recommendations
    this.generateRecommendations();
    
    return this.issues;
  }

  analyzeSizes() {
    console.log('📏 Analyzing screenshot file sizes across devices...');
    
    const sizes = {};
    
    this.pages.forEach(page => {
      sizes[page] = {};
      this.devices.forEach(device => {
        const filename = `${device}-${page}-baseline.png`;
        const filepath = path.join(this.baselinesDir, filename);
        
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          sizes[page][device] = stats.size;
        }
      });
    });

    // Analyze size discrepancies
    this.pages.forEach(page => {
      const pageSizes = sizes[page];
      const deviceSizes = Object.entries(pageSizes);
      
      if (deviceSizes.length < 4) {
        this.issues.push({
          type: 'MISSING_DEVICE_SUPPORT',
          page,
          severity: 'HIGH',
          description: `${page} page missing on some devices`,
          devices: this.devices.filter(d => !pageSizes[d])
        });
      }

      // Check for extreme size differences (indicates layout issues)
      const sizes_array = Object.values(pageSizes);
      if (sizes_array.length > 1) {
        const max = Math.max(...sizes_array);
        const min = Math.min(...sizes_array);
        const ratio = max / min;
        
        if (ratio > 3) {
          this.issues.push({
            type: 'LAYOUT_INCONSISTENCY',
            page,
            severity: 'MEDIUM',
            description: `Extreme content differences across devices (${ratio.toFixed(1)}x variation)`,
            sizes: pageSizes
          });
        }
      }
    });

    console.log(`OK--> Size analysis complete. Found ${this.issues.length} potential issues.\n`);
  }

  checkMissingFiles() {
    console.log('📋 Checking for missing baseline files...');
    
    let missing = 0;
    this.devices.forEach(device => {
      this.pages.forEach(page => {
        const filename = `${device}-${page}-baseline.png`;
        const filepath = path.join(this.baselinesDir, filename);
        
        if (!fs.existsSync(filepath)) {
          missing++;
          this.issues.push({
            type: 'MISSING_BASELINE',
            page,
            device,
            severity: 'HIGH',
            description: `Missing baseline for ${device} ${page}`,
            filename
          });
        }
      });
    });

    console.log(`OK--> File check complete. ${missing} missing files.\n`);
  }

  analyzeLayoutPatterns() {
    console.log('🎨 Analyzing layout patterns for 2025 best practices...');
    
    // Check for mobile navigation issues
    const mobileNavFiles = fs.readdirSync(this.baselinesDir)
      .filter(file => file.includes('nav') && file.includes('Mobile'));
    
    if (mobileNavFiles.length === 0) {
      this.issues.push({
        type: 'MOBILE_NAV_MISSING',
        severity: 'HIGH',
        description: 'No mobile navigation screenshots found - hamburger menu testing required'
      });
    }

    // Check homepage complexity across devices
    const homepageFiles = fs.readdirSync(this.baselinesDir)
      .filter(file => file.includes('homepage') && file.includes('baseline'));
    
    if (homepageFiles.length < 4) {
      this.issues.push({
        type: 'INCOMPLETE_HOMEPAGE_TESTING',
        severity: 'MEDIUM',
        description: 'Homepage not tested on all device sizes'
      });
    }

    console.log('OK-> Pattern analysis complete.\n');
  }

  generateRecommendations() {
    console.log('💡 Generating 2025 Mobile-First Recommendations...\n');
    
    // Group issues by severity
    const critical = this.issues.filter(i => i.severity === 'HIGH');
    const medium = this.issues.filter(i => i.severity === 'MEDIUM');
    const low = this.issues.filter(i => i.severity === 'LOW');

    console.log('🚨 CRITICAL ISSUES (Fix First):');
    critical.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.type}: ${issue.description}`);
      if (issue.devices) console.log(`   Missing devices: ${issue.devices.join(', ')}`);
    });

    console.log('\n⚠️  MEDIUM PRIORITY ISSUES:');
    medium.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.type}: ${issue.description}`);
    });

    console.log('\n📝 RECOMMENDED FIXES FOR 2025 STANDARDS:\n');

    // Generate specific technical recommendations
    if (critical.length > 0) {
      console.log('1. 📱 MOBILE-FIRST RESPONSIVE FIXES:');
      console.log('   - Implement consistent mobile navigation across all device sizes');
      console.log('   - Ensure hamburger menu functionality on Mobile/Mobile-Large');
      console.log('   - Add proper touch targets (44px minimum) for mobile interactions');
      console.log('   - Implement fluid typography with clamp() for consistent scaling');
    }

    if (medium.length > 0) {
      console.log('\n2. 🎨 LAYOUT CONSISTENCY FIXES:');
      console.log('   - Standardize content hierarchy across device breakpoints');
      console.log('   - Implement CSS Grid/Flexbox for consistent layouts');
      console.log('   - Add proper spacing scales using CSS custom properties');
      console.log('   - Ensure consistent component behavior across viewports');
    }

    console.log('\n3. 🚀 2025 PERFORMANCE OPTIMIZATIONS:');
    console.log('   - Implement responsive images with next/image');
    console.log('   - Add proper loading states for better perceived performance');
    console.log('   - Use CSS container queries for component-level responsiveness');
    console.log('   - Implement proper focus management for accessibility');

    console.log('\n📊 ANALYSIS SUMMARY:');
    console.log(`   Critical Issues: ${critical.length}`);
    console.log(`   Medium Issues: ${medium.length}`);
    console.log(`   Total Issues: ${this.issues.length}`);
    console.log(`   Devices Tested: ${this.devices.length}`);
    console.log(`   Pages Analyzed: ${this.pages.length}`);
  }
}

// Export for use in other modules
module.exports = VisualAnalyzer;

// Run if called directly
if (require.main === module) {
  const analyzer = new VisualAnalyzer();
  analyzer.analyze().then(() => {
    console.log('\n🎯 Visual analysis complete! Ready for fixes.\n');
  }).catch(console.error);
} 
