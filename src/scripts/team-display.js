/**
 * Team Display functionality for dynamically showing all team members
 * Loads team members from localStorage and displays them in the team grid
 */

import { getAllTeamMembers } from '../api/mockApiService.js';

class TeamDisplayManager {
  constructor() {
    this.teamGrid = document.querySelector('.team-grid');
    this.init();
  }

  async init() {
    if (this.teamGrid) {
      await this.loadAndDisplayTeamMembers();
    }
  }

  async loadAndDisplayTeamMembers() {
    try {
      const teamMembers = await getAllTeamMembers();
      this.displayTeamMembers(teamMembers);
    } catch (error) {
      console.warn('Failed to load team members for display:', error);
    }
  }

  displayTeamMembers(teamMembers) {
    // Clear existing team cards (except the static ones, or replace all)
    this.teamGrid.innerHTML = '';

    teamMembers.forEach(member => {
      const teamCard = this.createTeamCard(member);
      this.teamGrid.appendChild(teamCard);
    });
  }

  createTeamCard(member) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.setAttribute('data-testid', `${member.id}-card`);

    // Truncate long names for better display
    const displayName =
      member.name.length > 20 ? member.name.substring(0, 18) + '...' : member.name;

    // Truncate long titles for better display
    const displayTitle =
      member.title.length > 30 ? member.title.substring(0, 28) + '...' : member.title;

    card.innerHTML = `
      <h4 title="${this.escapeHtml(member.name)}">${this.escapeHtml(displayName)}</h4>
      <p class="job-title" title="${this.escapeHtml(member.title)}">${this.escapeHtml(displayTitle)}</p>
      <a 
        href="/profile.html?id=${encodeURIComponent(member.id)}" 
        class="profile-link" 
        data-testid="${member.id}-profile-link"
      >
        View Profile
      </a>
    `;

    return card;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Method to refresh the team display (useful after adding new members)
  async refresh() {
    await this.loadAndDisplayTeamMembers();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TeamDisplayManager();
});

// Make refresh method available globally for testing and other scripts
window.refreshTeamDisplay = async function () {
  const teamDisplay = new TeamDisplayManager();
  await teamDisplay.refresh();
};
