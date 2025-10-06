import { mockData } from './mockData.js';

const NO_RESULT_QUERY_LENGTH_THRESHOLD = 6;

/**
 * Get all team members from localStorage or fallback to mock data
 */
function getAllTeamMembersData() {
  try {
    const stored = localStorage.getItem('teamMembers');
    if (stored) {
      const parsedData = JSON.parse(stored);
      return Array.isArray(parsedData) ? parsedData : mockData.teamMembers;
    }
  } catch (error) {
    console.warn('Failed to parse stored team members, using default data:', error);
  }
  return [...mockData.teamMembers];
}

/**
 * Save team members to localStorage
 */
function saveTeamMembersData(teamMembers) {
  try {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  } catch (error) {
    console.warn('Failed to save team members to localStorage:', error);
  }
}

/**
 * Search team members by query
 * @param {string} query - Search query
 * @returns {Promise<{results: Array, total: number}>}
 */
export async function searchTeamMembers(query) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  if (!query || query.trim().length === 0) {
    return { results: [], total: 0 };
  }

  const normalizedQuery = query.toLowerCase().trim();

  // If query is too short, return empty results (reduced from 2 to 1 character)
  if (normalizedQuery.length < 1) {
    return { results: [], total: 0 };
  }

  const teamMembers = getAllTeamMembersData();
  const results = teamMembers.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(normalizedQuery);
    const titleMatch = member.title.toLowerCase().includes(normalizedQuery);
    const skillMatch =
      member.skills && member.skills.some(skill => skill.toLowerCase().includes(normalizedQuery));
    const projectMatch = member.projects.some(project => {
      const projectNameMatch = project.name.toLowerCase().includes(normalizedQuery);
      let techMatch = false;

      // Handle both string and array formats for technologies
      if (project.technologies) {
        if (Array.isArray(project.technologies)) {
          techMatch = project.technologies.some(tech =>
            tech.toLowerCase().includes(normalizedQuery)
          );
        } else if (typeof project.technologies === 'string') {
          // Split by comma and check each technology
          techMatch = project.technologies
            .split(',')
            .some(tech => tech.trim().toLowerCase().includes(normalizedQuery));
        }
      }

      return projectNameMatch || techMatch;
    });

    if (nameMatch || titleMatch || skillMatch || projectMatch) {
      // Add match type for badge display
      member.matchType = nameMatch
        ? 'name'
        : titleMatch
          ? 'title'
          : skillMatch
            ? 'skill'
            : 'project';
      return true;
    }

    return false;
  });

  // If no results found and query seems like a very specific search, throw an error
  if (results.length === 0 && normalizedQuery.length > NO_RESULT_QUERY_LENGTH_THRESHOLD) {
    const error = new Error(`No users found matching "${query}"`);
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return {
    results: results.map(member => ({
      ...member,
      // Reset matchType for clean results
      matchType: member.matchType,
    })),
    total: results.length,
  };
}

/**
 * Get team member by ID
 * @param {string} id - Team member ID
 * @returns {Promise<Object>}
 */
export async function getTeamMember(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  const teamMembers = getAllTeamMembersData();
  const member = teamMembers.find(m => m.id === id);

  if (!member) {
    const error = new Error(`Team member with ID "${id}" not found`);
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return { ...member };
}

/**
 * Get all team members
 * @returns {Promise<Array>}
 */
export async function getAllTeamMembers() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  return getAllTeamMembersData();
}

/**
 * Add a new team member
 * @param {Object} memberData - New team member data
 * @returns {Promise<Object>}
 */
export async function addTeamMember(memberData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  // Validate required fields
  if (!memberData.name || !memberData.title || !memberData.email) {
    const error = new Error('Name, title, and email are required fields');
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const teamMembers = getAllTeamMembersData();

  // Check if email already exists
  const existingMember = teamMembers.find(m => m.email === memberData.email);
  if (existingMember) {
    const error = new Error('A team member with this email already exists');
    error.status = 409;
    error.code = 'DUPLICATE_EMAIL';
    throw error;
  }

  // Check if ID already exists (just in case)
  const existingId = teamMembers.find(m => m.id === memberData.id);
  if (existingId) {
    const error = new Error('A team member with this ID already exists');
    error.status = 409;
    error.code = 'DUPLICATE_ID';
    throw error;
  }

  // Create new member object with defaults
  const newMember = {
    id: memberData.id,
    name: memberData.name.trim(),
    title: memberData.title.trim(),
    email: memberData.email.trim(),
    location: memberData.location || '',
    bio: memberData.bio || '',
    avatar: memberData.avatar || '/images/default-avatar.svg',
    skills: memberData.skills || [],
    projects: memberData.projects || [],
    joinedDate: memberData.joinedDate || new Date().toISOString().split('T')[0],
  };

  // Add to team members and save to localStorage
  teamMembers.push(newMember);
  saveTeamMembersData(teamMembers);

  // Return the created member
  return { ...newMember };
}
