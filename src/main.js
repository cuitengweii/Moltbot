// Main JavaScript file for ClawdTM Clone
import { mockSkills, categories, featuredSkills } from './data.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('ClawdTM Clone initialized');
    
    // Load and display skills
    loadSkills();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize skill cards interactions
    initializeSkillCards();
});

function loadSkills() {
    const skillsGrid = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4');
    
    if (!skillsGrid) return;
    
    // Clear existing content (except the first 4 cards which are template)
    skillsGrid.innerHTML = '';
    
    // Display featured skills
    featuredSkills.forEach(skillId => {
        const skill = mockSkills.find(s => s.id === skillId);
        if (skill) {
            skillsGrid.appendChild(createSkillCard(skill));
        }
    });
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
                <button class="install-btn bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors" data-skill-id="${skill.id}">
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

function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    // Filter skills based on search query
    const filteredSkills = mockSkills.filter(skill => 
        skill.name.toLowerCase().includes(query.toLowerCase()) ||
        skill.description.toLowerCase().includes(query.toLowerCase()) ||
        skill.author.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update skills grid with search results
    updateSkillsGrid(filteredSkills);
    
    showNotification(`Found ${filteredSkills.length} results for "${query}"`, 'success');
}

function updateSkillsGrid(skills) {
    const skillsGrid = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4');
    
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = '';
    
    if (skills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400">No skills found matching your search</p>
            </div>
        `;
        return;
    }
    
    skills.forEach(skill => {
        skillsGrid.appendChild(createSkillCard(skill));
    });
    
    // Re-initialize install buttons for new cards
    initializeSkillCards();
}

function initializeSkillCards() {
    const installButtons = document.querySelectorAll('.install-btn');
    
    installButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const skillId = parseInt(button.getAttribute('data-skill-id'));
            const skill = mockSkills.find(s => s.id === skillId);
            
            if (skill) {
                installSkill(skill, button);
            }
        });
    });
}

function installSkill(skill, button) {
    const originalText = button.textContent;
    
    // Show installing state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
    
    // Simulate installation process
    setTimeout(() => {
        skill.installed = true;
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> Installed';
        button.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');
        
        showNotification(`Successfully installed "${skill.name}"`, 'success');
        
        // Don't revert - keep as installed
    }, 2000);
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

// Export functions for global access
window.ClawdTM = {
    search: performSearch,
    showNotification: showNotification,
    installSkill: installSkill
};