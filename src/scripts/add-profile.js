import { addTeamMember } from '../api/mockApiService.js';

class AddProfileManager {
  constructor() {
    this.form = document.getElementById('add-profile-form');
    this.imageInput = document.getElementById('profile-image');
    this.imagePreview = document.getElementById('profile-image-preview');
    this.skillsInput = document.getElementById('skills-input');
    this.skillsList = document.querySelector('.skills-list');
    this.projectsContainer = document.querySelector('.projects-container');
    this.formMessages = document.getElementById('form-messages');

    this.skills = [];
    this.projects = [];
    this.profileImageData = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    // Add a default empty project to ensure at least one project form is available
    this.addProject();
  }

  setupEventListeners() {
    // Image upload
    document.querySelector('.upload-btn').addEventListener('click', () => {
      this.imageInput.click();
    });

    document.querySelector('.image-preview').addEventListener('click', () => {
      this.imageInput.click();
    });

    this.imageInput.addEventListener('change', e => {
      this.handleImageUpload(e);
    });

    // Skills
    document.querySelector('.add-skill-btn').addEventListener('click', () => {
      this.addSkill();
    });

    this.skillsInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addSkill();
      }
    });

    // Projects
    document.querySelector('.add-project-btn').addEventListener('click', () => {
      this.addProject();
    });

    // Form submission
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Cancel button
    document.querySelector('[data-testid="cancel-btn"]').addEventListener('click', () => {
      this.handleCancel();
    });
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showMessage('Please select a valid image file.', 'error');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      this.showMessage('Image size should be less than 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.imagePreview.src = e.target.result;
      this.profileImageData = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  addSkill() {
    const skillText = this.skillsInput.value.trim();
    if (!skillText) return;

    // Check if skill already exists
    if (this.skills.includes(skillText)) {
      this.showMessage('This skill has already been added.', 'error');
      return;
    }

    this.skills.push(skillText);
    this.renderSkills();
    this.skillsInput.value = '';
  }

  removeSkill(skillToRemove) {
    this.skills = this.skills.filter(skill => skill !== skillToRemove);
    this.renderSkills();
  }

  renderSkills() {
    this.skillsList.innerHTML = '';
    this.skills.forEach(skill => {
      const skillTag = document.createElement('div');
      skillTag.className = 'skill-tag';
      skillTag.innerHTML = `
        <span>${this.escapeHtml(skill)}</span>
        <button type="button" class="remove-skill" data-testid="remove-skill-${skill.toLowerCase().replace(/\s+/g, '-')}" title="Remove skill">×</button>
      `;

      skillTag.querySelector('.remove-skill').addEventListener('click', () => {
        this.removeSkill(skill);
      });

      this.skillsList.appendChild(skillTag);
    });
  }

  addProject() {
    const projectId = Date.now();
    const project = {
      id: projectId,
      name: '',
      description: '',
      technologies: '',
      link: '',
    };

    this.projects.push(project);
    this.renderProjects();
  }

  removeProject(projectId) {
    this.projects = this.projects.filter(project => project.id !== projectId);
    this.renderProjects();
  }

  updateProject(projectId, field, value) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project[field] = value;
    }
  }

  renderProjects() {
    this.projectsContainer.innerHTML = '';

    this.projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <button type="button" class="remove-project" data-testid="remove-project-${project.id}" title="Remove project">×</button>
        <div class="project-grid">
          <div class="form-group">
            <label>Project Name *</label>
            <input 
              type="text" 
              value="${this.escapeHtml(project.name)}" 
              data-testid="project-name-${project.id}"
              placeholder="Enter project name"
              required
            />
          </div>
          <div class="form-group">
            <label>Technologies</label>
            <input 
              type="text" 
              value="${this.escapeHtml(project.technologies)}"
              data-testid="project-technologies-${project.id}"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea 
            rows="3"
            data-testid="project-description-${project.id}"
            placeholder="Describe the project and your role..."
          >${this.escapeHtml(project.description)}</textarea>
        </div>
        <div class="form-group">
          <label>Project Link</label>
          <input 
            type="url" 
            value="${this.escapeHtml(project.link)}"
            data-testid="project-link-${project.id}"
            placeholder="https://github.com/username/project"
          />
        </div>
      `;

      // Add event listeners for project inputs
      const nameInput = projectCard.querySelector(`[data-testid="project-name-${project.id}"]`);
      const techInput = projectCard.querySelector(
        `[data-testid="project-technologies-${project.id}"]`
      );
      const descInput = projectCard.querySelector(
        `[data-testid="project-description-${project.id}"]`
      );
      const linkInput = projectCard.querySelector(`[data-testid="project-link-${project.id}"]`);
      const removeBtn = projectCard.querySelector('.remove-project');

      nameInput.addEventListener('input', e => {
        this.updateProject(project.id, 'name', e.target.value);
      });

      techInput.addEventListener('input', e => {
        this.updateProject(project.id, 'technologies', e.target.value);
      });

      descInput.addEventListener('input', e => {
        this.updateProject(project.id, 'description', e.target.value);
      });

      linkInput.addEventListener('input', e => {
        this.updateProject(project.id, 'link', e.target.value);
      });

      removeBtn.addEventListener('click', () => {
        this.removeProject(project.id);
      });

      this.projectsContainer.appendChild(projectCard);
    });
  }

  validateForm() {
    const errors = [];
    const formData = new FormData(this.form);

    // Basic field validation
    if (!formData.get('name')?.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.get('title')?.trim()) {
      errors.push('Job title is required');
    }

    if (!formData.get('email')?.trim()) {
      errors.push('Email is required');
    }

    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Project validation - check DOM inputs directly
    const projectNameInputs = document.querySelectorAll('[data-testid*="project-name-"]');
    const validProjects = Array.from(projectNameInputs).filter(
      input => input.value && input.value.trim()
    );

    if (validProjects.length === 0) {
      errors.push('At least one project is required');
    }

    // Individual project validation - check each project name input
    projectNameInputs.forEach((input, index) => {
      const value = input.value;
      if (value && !value.trim()) {
        errors.push(`Project ${index + 1} name is required`);
      }
    });

    return errors;
  }

  async handleSubmit() {
    try {
      // Validate form
      const errors = this.validateForm();
      if (errors.length > 0) {
        this.showMessage(errors.join('<br>'), 'error');
        return;
      }

      // Show loading state
      const submitBtn = document.querySelector('[data-testid="submit-btn"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating Profile...';
      submitBtn.disabled = true;

      // Gather project data from DOM inputs
      const projectNameInputs = document.querySelectorAll('[data-testid*="project-name-"]');
      const projectTechInputs = document.querySelectorAll('[data-testid*="project-technologies-"]');
      const projectDescInputs = document.querySelectorAll('[data-testid*="project-description-"]');
      const projectLinkInputs = document.querySelectorAll('[data-testid*="project-link-"]');

      const projects = [];
      projectNameInputs.forEach((nameInput, index) => {
        const name = nameInput.value?.trim();
        if (name) {
          const techInput = projectTechInputs[index];
          const descInput = projectDescInputs[index];
          const linkInput = projectLinkInputs[index];

          projects.push({
            id: nameInput.getAttribute('data-testid').split('-').pop(),
            name: name,
            technologies: techInput?.value
              ? techInput.value
                  .split(',')
                  .map(tech => tech.trim())
                  .filter(tech => tech)
              : [],
            description: descInput?.value?.trim() || '',
            link: linkInput?.value?.trim() || '',
            role: 'Developer', // Default role
          });
        }
      });

      // Prepare form data
      const formData = new FormData(this.form);
      const profileData = {
        id: this.generateId(formData.get('name')),
        name: formData.get('name').trim(),
        title: formData.get('title').trim(),
        email: formData.get('email').trim(),
        location: formData.get('location')?.trim() || '',
        bio: formData.get('about')?.trim() || '',
        skills: this.skills,
        projects: projects,
        avatar: this.profileImageData || '/images/default-avatar.svg',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      // Save profile
      await addTeamMember(profileData);

      // Show success message with links to see the new profile
      this.showMessage(
        `Profile created successfully! <br>
        <a href="/" style="color: #007bff; text-decoration: underline; margin-right: 15px;">
          View in team directory
        </a>
        <a href="/?search=${encodeURIComponent(profileData.name)}" style="color: #007bff; text-decoration: underline;">
          Search for "${profileData.name}"
        </a><br>
        <small>Redirecting to profile page in 3 seconds...</small>`,
        'success'
      ); // Redirect to new profile after a delay (increased to 3 seconds)
      setTimeout(() => {
        window.location.href = `/profile.html?id=${profileData.id}`;
      }, 3000);
    } catch (error) {
      console.error('Error creating profile:', error);

      // Handle specific error types
      let errorMessage = 'Failed to create profile. Please try again.';

      if (error.code === 'DUPLICATE_EMAIL') {
        errorMessage =
          'A team member with this email address already exists. Please use a different email.';
      } else if (error.code === 'VALIDATION_ERROR') {
        errorMessage = error.message || 'Please check your form data and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.showMessage(errorMessage, 'error');

      // Reset submit button
      const submitBtn = document.querySelector('[data-testid="submit-btn"]');
      submitBtn.textContent = 'Create Profile';
      submitBtn.disabled = false;
    }
  }

  handleCancel() {
    if (this.hasUnsavedChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }

  hasUnsavedChanges() {
    const formData = new FormData(this.form);
    return (
      formData.get('name') ||
      formData.get('title') ||
      formData.get('email') ||
      formData.get('location') ||
      formData.get('about') ||
      this.skills.length > 0 ||
      this.projects.length > 0 ||
      this.profileImageData
    );
  }

  generateId(name) {
    const baseId = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  }

  showMessage(message, type) {
    this.formMessages.innerHTML = message;
    this.formMessages.className = `form-messages ${type}`;
    this.formMessages.classList.remove('hidden');
    this.formMessages.style.display = 'block';

    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
      setTimeout(() => {
        this.formMessages.classList.add('hidden');
      }, 5000);
    }

    // Scroll to message
    this.formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AddProfileManager();
});
