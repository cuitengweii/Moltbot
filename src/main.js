// Main JavaScript file for ClawdTM Clone

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('ClawdTM Clone initialized');
    
    // Initialize Supabase if available
    if (typeof supabase !== 'undefined') {
        initializeSupabase();
    }
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize skill cards interactions
    initializeSkillCards();
});

function initializeSupabase() {
    console.log('Supabase initialized');
    
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log('User is logged in:', session.user.email);
            updateUIForLoggedInUser(session.user);
        } else {
            console.log('No user logged in');
        }
    });
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user.email);
            updateUIForLoggedInUser(session.user);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            updateUIForLoggedOutUser();
        }
    });
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
    
    // In a real implementation, this would make an API call
    // For now, just show a notification
    showNotification(`Searching for "${query}"...`, 'info');
    
    // Simulate search results after a delay
    setTimeout(() => {
        showNotification(`Found 15 results for "${query}"`, 'success');
    }, 1000);
}

function initializeSkillCards() {
    const installButtons = document.querySelectorAll('button:contains("Install")');
    
    installButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const skillCard = button.closest('.bg-white, .dark\\:bg-gray-800');
            const skillName = skillCard?.querySelector('h3')?.textContent || 'Unknown Skill';
            
            if (typeof supabase !== 'undefined' && supabase.auth.getSession()) {
                // Check if user is logged in
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session) {
                        // User is logged in, proceed with installation
                        installSkill(skillName, button);
                    } else {
                        // User not logged in, show login prompt
                        showNotification('Please log in to install skills', 'warning');
                        // In a real implementation, redirect to login
                    }
                });
            } else {
                // No auth system, simulate installation
                installSkill(skillName, button);
            }
        });
    });
}

function installSkill(skillName, button) {
    const originalText = button.textContent;
    
    // Show installing state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
    
    // Simulate installation process
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> Installed';
        button.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');
        
        showNotification(`Successfully installed "${skillName}"`, 'success');
        
        // Revert after 3 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-primary-500', 'hover:bg-primary-600');
        }, 3000);
    }, 2000);
}

function updateUIForLoggedInUser(user) {
    // Update user menu to show user info
    const userButton = document.querySelector('button:has(.fa-user)');
    if (userButton) {
        userButton.innerHTML = `<i class="fas fa-user"></i> ${user.email.split('@')[0]}`;
    }
}

function updateUIForLoggedOutUser() {
    // Reset user menu
    const userButton = document.querySelector('button:has(.fa-user)');
    if (userButton) {
        userButton.innerHTML = '<i class="fas fa-user"></i>';
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

// Utility function to check if element contains text
Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// Export functions for global access
window.ClawdTM = {
    search: performSearch,
    showNotification: showNotification,
    installSkill: installSkill
};