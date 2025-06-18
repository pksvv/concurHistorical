// Made with 🤖 by Claude Code

import { MARKETS, YEARS, GLOBAL_REPORTS, MARKET_REPORTS, RECEIPTS } from './data.js';

// Authentication
const CORRECT_PASSWORD_HASH = '5c898dbe0736c3b5439d13e1cb166428f299769b474880bb631eb8f9b7a98a1f'; // SHA-256 of "concur2025"

class ConcurApp {
  constructor() {
    this.currentTab = 'reports';
    this.isAuthenticated = false;
    this.init();
  }

  // Initialize the application
  init() {
    this.bindEvents();
    this.setupAuthentication();
    this.populateDropdowns();
  }

  // Event binding
  bindEvents() {
    // Authentication
    document.getElementById('auth-submit').addEventListener('click', () => this.authenticate());
    document.getElementById('auth-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.authenticate();
    });

    // Tab switching
    document.getElementById('tab-reports').addEventListener('click', () => this.switchTab('reports'));
    document.getElementById('tab-receipts').addEventListener('click', () => this.switchTab('receipts'));

    // Search functionality
    document.getElementById('search-button').addEventListener('click', () => this.searchReports());
    document.getElementById('fetch-button').addEventListener('click', () => this.fetchReceipt());

    // Form validation
    document.getElementById('market-select').addEventListener('change', () => this.validateSearchForm());
    document.getElementById('year-select').addEventListener('change', () => this.validateSearchForm());

    // Enter key handling
    document.getElementById('report-id-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.fetchReceipt();
    });
  }

  // Authentication setup
  setupAuthentication() {
    const authModal = document.getElementById('auth-modal');
    const app = document.getElementById('app');
    
    // Show auth modal initially
    authModal.style.display = 'flex';
    app.classList.add('hidden');
  }

  // Authenticate user
  async authenticate() {
    const input = document.getElementById('auth-input');
    const errorDiv = document.getElementById('auth-error');
    const password = input.value.trim();

    if (!password) {
      errorDiv.textContent = 'Please enter an access code';
      return;
    }

    try {
      // Hash the entered password
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashHex === CORRECT_PASSWORD_HASH) {
        this.isAuthenticated = true;
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        errorDiv.textContent = '';
      } else {
        errorDiv.textContent = 'Invalid access code';
        input.value = '';
      }
    } catch (error) {
      errorDiv.textContent = 'Authentication error occurred';
      console.error('Auth error:', error);
    }
  }

  // Switch between tabs
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).setAttribute('aria-selected', 'true');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    document.getElementById(`panel-${tabName}`).classList.add('active');
    
    this.currentTab = tabName;
  }

  // Populate dropdown menus
  populateDropdowns() {
    const marketSelect = document.getElementById('market-select');
    const yearSelect = document.getElementById('year-select');

    // Populate markets
    MARKETS.forEach(market => {
      const option = document.createElement('option');
      option.value = market;
      option.textContent = market;
      marketSelect.appendChild(option);
    });

    // Populate years
    YEARS.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }

  // Validate search form
  validateSearchForm() {
    const marketSelect = document.getElementById('market-select');
    const yearSelect = document.getElementById('year-select');
    const searchButton = document.getElementById('search-button');

    const isValid = marketSelect.value !== '' && yearSelect.value !== '';
    searchButton.disabled = !isValid;
  }

  // Search for reports
  searchReports() {
    const market = document.getElementById('market-select').value;
    const year = document.getElementById('year-select').value;
    const resultsContainer = document.getElementById('results-list');

    if (!market || !year) {
      this.showToast('Please select both market and year', 'error');
      return;
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Create results sections
    const globalSection = this.createResultsSection('Global Reports', GLOBAL_REPORTS);
    resultsContainer.appendChild(globalSection);

    // Add market-specific reports if they exist
    const marketReports = MARKET_REPORTS[market];
    if (marketReports && marketReports.length > 0) {
      const marketSection = this.createResultsSection(`${market} Reports`, marketReports);
      resultsContainer.appendChild(marketSection);
    }

    // Show success message
    const totalReports = GLOBAL_REPORTS.length + (marketReports ? marketReports.length : 0);
    this.showToast(`Found ${totalReports} reports for ${market} ${year}`, 'success');
  }

  // Create results section
  createResultsSection(title, reports) {
    const section = document.createElement('div');
    section.className = 'results-section';

    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);

    reports.forEach(report => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'report-link';
      link.textContent = report;
      link.setAttribute('aria-label', `Download ${report}`);
      
      // Add click handler for future integration
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast(`Download would start for: ${report}`, 'success');
      });
      
      section.appendChild(link);
    });

    return section;
  }

  // Fetch receipt by report ID
  fetchReceipt() {
    const reportIdInput = document.getElementById('report-id-input');
    const reportId = reportIdInput.value.trim();
    const resultContainer = document.getElementById('receipt-result');

    if (!reportId) {
      this.showToast('Please enter a Report ID', 'error');
      return;
    }

    // Clear previous results
    resultContainer.innerHTML = '';

    // Check if receipt exists
    const receiptUrl = RECEIPTS[reportId];
    
    if (receiptUrl) {
      // Create download link
      const section = document.createElement('div');
      section.className = 'results-section';
      section.style.padding = '16px';

      const heading = document.createElement('h3');
      heading.textContent = 'Receipt Found';
      section.appendChild(heading);

      const link = document.createElement('a');
      link.href = receiptUrl;
      link.className = 'report-link';
      link.textContent = `Download Receipt ${reportId}`;
      link.setAttribute('aria-label', `Download receipt for ${reportId}`);
      link.download = `${reportId}.pdf`;
      
      section.appendChild(link);
      resultContainer.appendChild(section);
      
      this.showToast(`Receipt found for ${reportId}`, 'success');
    } else {
      // Show not found message
      const notFound = document.createElement('div');
      notFound.className = 'no-results';
      notFound.textContent = `No receipt found for Report ID: ${reportId}`;
      resultContainer.appendChild(notFound);
      
      this.showToast('Receipt not found', 'error');
    }
  }

  // Show toast notification
  showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    
    container.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ConcurApp();
});