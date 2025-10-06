import { getTeamMember } from '../api/mockApiService.js';

class ProfileManager {
  constructor() {
    this.profileContainer = document.querySelector('[data-testid="profile-container"]');
    this.loadingState = document.querySelector('[data-testid="loading-container"]');
    this.errorState = document.querySelector('[data-testid="error-container"]');
    this.retryButton = document.querySelector('[data-testid="retry-button"]');

    this.init();
  }

  init() {
    // Get member ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');

    if (!memberId) {
      this.showError('No member ID provided');
      return;
    }

    this.loadProfile(memberId);

    // Add retry functionality
    if (this.retryButton) {
      this.retryButton.addEventListener('click', () => {
        this.loadProfile(memberId);
      });
    }
  }

  async loadProfile(memberId) {
    try {
      this.showLoading();

      const member = await getTeamMember(memberId);
      this.renderProfile(member);
    } catch (error) {
      console.error('Failed to load profile:', error);

      // Handle 404 errors by showing error state instead of redirecting
      if (error.status === 404 || error.code === 'USER_NOT_FOUND') {
        this.showError(`Profile not found. The user "${memberId}" does not exist.`);
        return;
      }

      // Handle other errors
      this.showError(error.message || 'Failed to load profile. Please try again.');
    }
  }

  showLoading() {
    if (this.loadingState) {
      this.loadingState.style.display = 'block';
      this.loadingState.classList.remove('hidden');
    }
    if (this.profileContainer) {
      this.profileContainer.style.display = 'none';
      this.profileContainer.classList.add('hidden');
    }
    if (this.errorState) {
      this.errorState.style.display = 'none';
      this.errorState.classList.add('hidden');
    }
  }

  showError(message) {
    if (this.errorState) {
      this.errorState.style.display = 'block';
      this.errorState.classList.remove('hidden');
      const errorMessage = this.errorState.querySelector('[data-testid="error-message"]');
      if (errorMessage) {
        errorMessage.textContent = message;
      }
    }
    if (this.loadingState) {
      this.loadingState.style.display = 'none';
      this.loadingState.classList.add('hidden');
    }
    if (this.profileContainer) {
      this.profileContainer.style.display = 'none';
      this.profileContainer.classList.add('hidden');
    }
  }

  renderProfile(member) {
    if (!this.profileContainer) return;

    // Hide loading and error states
    if (this.loadingState) {
      this.loadingState.style.display = 'none';
      this.loadingState.classList.add('hidden');
    }
    if (this.errorState) {
      this.errorState.style.display = 'none';
      this.errorState.classList.add('hidden');
    }

    // Show profile container
    this.profileContainer.style.display = 'block';
    this.profileContainer.classList.remove('hidden');

    // Update page title
    document.title = `${member.name} - Ensono QA`;

    // Update profile content
    this.updateElement('[data-testid="profile-name"]', member.name);
    this.updateElement('[data-testid="profile-title"]', member.title);
    this.updateElement('[data-testid="profile-email"]', member.email);
    this.updateElement('[data-testid="profile-location"]', member.location);
    this.updateElement('[data-testid="profile-bio"]', member.bio);

    // Update avatar
    const avatar = document.querySelector('[data-testid="profile-avatar"]');
    if (avatar && member.avatar) {
      avatar.src = member.avatar;
      avatar.alt = `${member.name}'s avatar`;
    }

    // Update skills
    this.renderSkills(member.skills);

    // Update projects
    this.renderProjects(member.projects);
  }

  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
      element.textContent = content;
    }
  }

  renderSkills(skills) {
    const skillsContainer = document.querySelector('[data-testid="profile-skills"]');
    if (!skillsContainer || !skills) return;

    skillsContainer.innerHTML = '';

    skills.forEach((skill, index) => {
      const skillElement = document.createElement('span');
      skillElement.className = 'skill-tag';
      // Create data-testid from skill name (kebab-case)
      const testId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
      skillElement.setAttribute('data-testid', testId);
      skillElement.textContent = skill;
      skillsContainer.appendChild(skillElement);
    });
  }

  renderProjects(projects) {
    const projectsContainer = document.querySelector('[data-testid="profile-projects"]');
    if (!projectsContainer || !projects) return;

    projectsContainer.innerHTML = '';

    projects.forEach((project, index) => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project-card'; // Changed from 'project-item' to 'project-card'
      projectElement.setAttribute('data-testid', `project-${index}`);

      projectElement.innerHTML = `
        <h4 data-testid="project-name-${index}">${project.name}</h4>
        <p class="project-role" data-testid="project-role-${index}">${project.role}</p>
        <p class="project-description">${project.description}</p>
        <div class="project-technologies" data-testid="project-technologies-${index}">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      `;

      projectsContainer.appendChild(projectElement);
    });
  }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
});
