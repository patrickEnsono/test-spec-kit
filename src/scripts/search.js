/**
 * Search functionality for Ensono-QA team members
 * Follows Test-Spec-Kit constitution principles with reliable selectors
 */

// Team member data for searching
import { searchTeamMembers } from '../api/mockApiService.js';

class SearchManager {
  constructor() {
    this.searchInput = document.querySelector('[data-testid="search-input"]');
    this.searchButton = document.querySelector('[data-testid="search-button"]');
    this.searchResults = document.querySelector('[data-testid="search-results"]');
    this.resultsList = document.querySelector('[data-testid="results-list"]');
    this.noResults = document.querySelector('[data-testid="no-results"]');
    this.searchLoading = document.querySelector('[data-testid="search-loading"]');
    this.searchError = document.querySelector('[data-testid="search-error"]');

    this.debounceTimer = null;
    this.currentSearchTerm = '';

    this.init();
  }

  init() {
    if (this.searchInput && this.searchButton) {
      // Handle input with debouncing
      this.searchInput.addEventListener('input', e => {
        this.handleSearchInput(e.target.value);
      });

      // Handle search button click
      this.searchButton.addEventListener('click', e => {
        e.preventDefault();
        this.performSearch(this.searchInput.value);
      });

      // Handle Enter key
      this.searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch(this.searchInput.value);
        }
      });

      // Check for search query in URL params
      this.checkUrlSearchParam();
    }
  }

  checkUrlSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      this.searchInput.value = searchQuery;
      this.performSearch(searchQuery);
    }
  }

  handleSearchInput(value) {
    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // If empty, hide results
    if (!value.trim()) {
      this.hideResults();
      return;
    }

    // Debounce search
    this.debounceTimer = setTimeout(() => {
      this.performSearch(value);
    }, 300);
  }

  async performSearch(query) {
    if (!query || query.trim().length < 1) {
      this.hideResults();
      return;
    }

    const trimmedQuery = query.trim();
    this.currentSearchTerm = trimmedQuery;

    try {
      this.showLoading();

      const response = await searchTeamMembers(trimmedQuery);

      // Check if this is still the current search
      if (this.currentSearchTerm !== trimmedQuery) {
        return;
      }

      this.hideLoading();
      this.displayResults(response.results, trimmedQuery);
    } catch (error) {
      this.hideLoading();

      // Handle 404 errors differently for search vs navigation
      if (error.status === 404 || error.code === 'USER_NOT_FOUND') {
        // For search queries, show no results instead of redirecting
        this.displayResults([], trimmedQuery);
        return;
      }

      // Handle other errors
      this.showError(error.message || 'An error occurred while searching. Please try again.');
    }
  }

  showLoading() {
    if (this.searchLoading) {
      this.searchLoading.classList.remove('hidden');
    }
    if (this.searchResults) {
      this.searchResults.classList.remove('hidden');
    }
    if (this.noResults) {
      this.noResults.classList.add('hidden');
    }
    if (this.searchError) {
      this.searchError.classList.add('hidden');
    }
  }

  hideLoading() {
    if (this.searchLoading) {
      this.searchLoading.classList.add('hidden');
    }
  }

  showError(message) {
    if (this.searchError) {
      this.searchError.textContent = message;
      this.searchError.classList.remove('hidden');
    }
    if (this.searchResults) {
      this.searchResults.classList.remove('hidden');
    }
    if (this.noResults) {
      this.noResults.classList.add('hidden');
    }
    if (this.resultsList) {
      this.resultsList.innerHTML = '';
    }
  }

  displayResults(results, query) {
    if (!this.searchResults || !this.resultsList) return;

    // Show search results container
    this.searchResults.classList.remove('hidden');

    if (results.length === 0) {
      this.showNoResults();
      return;
    }

    // Hide no results and error messages
    if (this.noResults) {
      this.noResults.classList.add('hidden');
    }
    if (this.searchError) {
      this.searchError.classList.add('hidden');
    }

    // Clear previous results
    this.resultsList.innerHTML = '';

    // Display results
    results.forEach((member, index) => {
      const resultElement = this.createResultElement(member, index);
      this.resultsList.appendChild(resultElement);
    });
  }

  createResultElement(member, index) {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.setAttribute('data-testid', `search-result-${index}`);

    // Add match badge based on match type
    const matchBadge = member.matchType
      ? `<span class="match-badge ${member.matchType}" data-testid="match-badge-${member.matchType}">
        ${member.matchType.charAt(0).toUpperCase() + member.matchType.slice(1)} Match
      </span>`
      : '';

    div.innerHTML = `
      <div class="result-content">
        <h4 data-testid="result-name-${index}">${member.name}</h4>
        <p class="job-title" data-testid="result-title-${index}">${member.title}</p>
        <p class="location">${member.location}</p>
        ${matchBadge}
      </div>
      <button class="view-profile-btn" data-testid="view-profile-${index}" 
              onclick="window.location.href='/profile.html?id=${member.id}'">
        View Profile
      </button>
    `;

    return div;
  }

  showNoResults() {
    if (this.noResults) {
      this.noResults.classList.remove('hidden');
    }
    if (this.resultsList) {
      this.resultsList.innerHTML = '';
    }
    if (this.searchError) {
      this.searchError.classList.add('hidden');
    }
  }

  hideResults() {
    if (this.searchResults) {
      this.searchResults.classList.add('hidden');
    }
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SearchManager();
});

/**
 * Utility function for testing - get current search results count
 */
function getSearchResultsCount() {
  const searchResults = document.querySelector('[data-testid="search-results"]');
  if (!searchResults || searchResults.classList.contains('hidden')) {
    return 0;
  }

  const resultsList = document.querySelector('[data-testid="results-list"]');
  if (!resultsList) {
    return 0;
  }

  const resultItems = resultsList.querySelectorAll('.search-result-item');
  return resultItems.length;
}

/**
 * Utility function for testing - check if search is functional
 */
function isSearchFunctional() {
  const searchInput = document.querySelector('[data-testid="search-input"]');
  const searchButton = document.querySelector('[data-testid="search-button"]');
  const searchResults = document.querySelector('[data-testid="search-results"]');

  return !!(searchInput && searchButton && searchResults);
}

// Make functions available globally for testing
window.getSearchResultsCount = getSearchResultsCount;
window.isSearchFunctional = isSearchFunctional;
