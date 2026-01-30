// Main JavaScript file for ClawdTM Clone
import { dataSource, getFeaturedSkills, searchSkills, installSkill, isSkillInstalled } from './data-source.js'

// Global state
let currentUser = null
let installedSkills = new Set()

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('ClawdTM Clone initialized');
    console.log('Data source:', dataSource.useSupabase ? 'Supabase' : 'Mock Data');
    
    // Initialize authentication
    initializeAuth();
    
    // Load and display skills
    loadFeaturedSkills();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize category browsing
    initializeCategories();
});

async function initializeAuth() {
    // Check if user is logged in (mock implementation)
    // In a real app, this would check localStorage or make an API call
    const savedUser = localStorage.getItem('clawdtm_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser(currentUser);
        
        // Load installed skills for logged-in user
        await loadInstalledSkills();
    }
}

async function loadFeaturedSkills() {
    const skillsGrid = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4');
    
    if (!skillsGrid) return;
    
    // Show loading state
    skillsGrid.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-spinner fa-spin text-primary-500 text-2xl"></i>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Loading skills...</p>
        </div>
    `;
    
    try {
        const result = await getFeaturedSkills();
        
        if (result.success) {
            skillsGrid.innerHTML = '';
            
            if (result.data.length === 0) {
                skillsGrid.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-500 dark:text-gray-400">No skills available yet</p>
                    </div>
                `;
                return;
            }
            
            // Load installation status for each skill
            const skillsWithStatus = await Promise.all(
                result.data.map(async (skill) => {
                    const isInstalled = await isSkillInstalled(skill.id, currentUser?.id);
                    return { ...skill, installed: isInstalled };
                })
            );
            
            skillsWithStatus.forEach(skill => {
                skillsGrid.appendChild(createSkillCard(skill));
            });
            
            // Initialize install buttons
            initializeSkillCards();
        } else {
            showNotification('Failed to load skills', 'error');
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        showNotification('Error loading skills', 'error');
    }
}

function createSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow animate-fade-in';
    
    card.innerHTML = `
        <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center">
                    <i class="${skill.icon} text-white text-lg"></i>
                </div>
                <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">${skill.name}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">by ${skill.author}</p>
                </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                ${skill.description}
            </p>
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">★ ${skill.rating} (${skill.reviewCount})</span>
                <button class="install-btn ${skill.installed ? 'installed' : ''} bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors" data-skill-id="${skill.id}">
                    ${skill.installed ? '<i class="fas fa-check"></i> Installed' : 'Install'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('translate-y-full');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('translate-y-full');
            }
        });
    }
}

function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        // Real-time search with debounce
        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.trim()) {
                    performSearch(e.target.value);
                }
            }, 300);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value);
            }
        });
        
        // Add search button functionality if exists
        const searchButton = input.nextElementSibling;
        if (searchButton && searchButton.tagName === 'BUTTON') {
            searchButton.addEventListener('click', () => {
                performSearch(input.value);
            });
        }
    });
}

async function performSearch(query) {
    if (!query.trim()) {
        await loadFeaturedSkills();
        return;
    }
    
    const skillsGrid = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4');
    
    if (!skillsGrid) return;
    
    // Show loading state
    skillsGrid.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-spinner fa-spin text-primary-500 text-2xl"></i>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
        </div>
    `;
    
    try {
        const result = await searchSkills(query);
        
        if (result.success) {
            skillsGrid.innerHTML = '';
            
            if (result.data.length === 0) {
                skillsGrid.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-500 dark:text-gray-400">No skills found matching "${query}"</p>
                    </div>
                `;
                return;
            }
            
            // Load installation status for each skill
            const skillsWithStatus = await Promise.all(
                result.data.map(async (skill) => {
                    const isInstalled = await isSkillInstalled(skill.id, currentUser?.id);
                    return { ...skill, installed: isInstalled };
                })
            );
            
            skillsWithStatus.forEach(skill => {
                skillsGrid.appendChild(createSkillCard(skill));
            });
            
            // Re-initialize install buttons for new cards
            initializeSkillCards();
            
            showNotification(`Found ${result.data.length} results for "${query}"`, 'success');
        } else {
            showNotification('Search failed', 'error');
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search error', 'error');
    }
}

function initializeCategories() {
    const categoryLinks = document.querySelectorAll('a[href="#"][class*="rounded-lg"]');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryName = link.querySelector('span').textContent;
            performSearch(categoryName);
        });
    });
}

function initializeSkillCards() {
    const installButtons = document.querySelectorAll('.install-btn');
    
    installButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                showNotification('Please log in to install skills', 'warning');
                return;
            }
            
            const skillId = parseInt(button.getAttribute('data-skill-id'));
            handleInstallSkill(skillId, button);
        });
    });
}

async function handleInstallSkill(skillId, button) {
    const originalText = button.textContent;
    const isCurrentlyInstalled = button.classList.contains('installed');
    
    // Show installing state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
                      (isCurrentlyInstalled ? 'Uninstalling...' : 'Installing...');
    
    try {
        if (isCurrentlyInstalled) {
            // Uninstall logic would go here
            await new Promise(resolve => setTimeout(resolve, 800));
            button.classList.remove('installed');
            button.innerHTML = 'Install';
            showNotification('Skill uninstalled', 'success');
        } else {
            const result = await installSkill(skillId, currentUser?.id);
            
            if (result.success) {
                button.classList.add('installed');
                button.innerHTML = '<i class="fas fa-check"></i> Installed';
                button.classList.remove('bg-primary-500', 'hover:bg-primary-600');
                button.classList.add('bg-green-500', 'hover:bg-green-600');
                showNotification(result.message, 'success');
            } else {
                showNotification(result.message || 'Installation failed', 'error');
                button.innerHTML = originalText;
            }
        }
    } catch (error) {
        console.error('Installation error:', error);
        showNotification('Installation failed', 'error');
        button.innerHTML = originalText;
    } finally {
        button.disabled = false;
    }
}

async function loadInstalledSkills() {
    if (!currentUser) return;
    
    try {
        // This would call SupabaseAPI.getUserInstalledSkills in a real implementation
        // For now, we'll just update the UI based on localStorage
        const savedInstalled = localStorage.getItem('clawdtm_installed_skills');
        if (savedInstalled) {
            installedSkills = new Set(JSON.parse(savedInstalled));
        }
    } catch (error) {
        console.error('Error loading installed skills:', error);
    }
}

function updateUIForLoggedInUser(user) {
    // Update user menu to show user info
    const userButton = document.querySelector('button:has(.fa-user)');
    if (userButton) {
        userButton.innerHTML = `<i class="fas fa-user"></i> ${user.username || user.email.split('@')[0]}`;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${
                type === 'success' ? 'fa-check' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                type === 'error' ? 'fa-times' :
                'fa-info'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Mock login function (for demo purposes)
window.mockLogin = function() {
    currentUser = {
        id: 'user_123',
        email: 'demo@example.com',
        username: 'demo_user'
    };
    localStorage.setItem('clawdtm_user', JSON.stringify(currentUser));
    updateUIForLoggedInUser(currentUser);
    showNotification('Logged in as demo user', 'success');
};

// Mock logout function
window.mockLogout = function() {
    currentUser = null;
    localStorage.removeItem('clawdtm_user');
    const userButton = document.querySelector('button:has(.fa-user)');
    if (userButton) {
        userButton.innerHTML = '<i class="fas fa-user"></i>';
    }
    showNotification('Logged out', 'info');
};

// Export functions for global access
window.ClawdTM = {
    search: performSearch,
    showNotification: showNotification,
    installSkill: handleInstallSkill,
    mockLogin: window.mockLogin,
    mockLogout: window.mockLogout
};