// Sample blog post data
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with JavaScript ES6",
        description: "Learn the essential features of ES6 that every developer should know, including arrow functions, destructuring, and modules.",
        category: "tech",
        date: "2024-01-15",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 2,
        title: "My Trip to Tokyo: A Food Adventure",
        description: "Exploring the incredible street food scene in Tokyo, from ramen shops to sushi bars and everything in between.",
        category: "travel",
        date: "2024-01-10",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 3,
        title: "The Perfect Homemade Pizza Recipe",
        description: "Step-by-step guide to making restaurant-quality pizza at home, including dough preparation and topping combinations.",
        category: "food",
        date: "2024-01-08",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 4,
        title: "Building Responsive Web Apps with CSS Grid",
        description: "Master CSS Grid to create flexible, responsive layouts that work perfectly on all devices and screen sizes.",
        category: "tech",
        date: "2024-01-05",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 5,
        title: "Backpacking Through Southeast Asia",
        description: "A complete guide to backpacking through Thailand, Vietnam, and Cambodia on a budget, with tips and recommendations.",
        category: "travel",
        date: "2024-01-03",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 6,
        title: "Mastering French Cooking Techniques",
        description: "Learn fundamental French cooking techniques that will elevate your culinary skills and impress your dinner guests.",
        category: "food",
        date: "2024-01-01",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 7,
        title: "Introduction to Machine Learning",
        description: "A beginner-friendly introduction to machine learning concepts, algorithms, and practical applications in everyday life.",
        category: "tech",
        date: "2023-12-28",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 8,
        title: "Hidden Gems of European Cities",
        description: "Discover lesser-known attractions and local favorites in popular European destinations that tourists often miss.",
        category: "travel",
        date: "2023-12-25",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 9,
        title: "Artisan Bread Baking at Home",
        description: "Learn the art of baking professional-quality artisan bread in your home kitchen with simple ingredients and techniques.",
        category: "food",
        date: "2023-12-22",
        image: "/placeholder.svg?height=200&width=350"
    },
    {
        id: 10,
        title: "Modern Web Development Trends 2024",
        description: "Explore the latest trends in web development, from new frameworks to emerging technologies shaping the future.",
        category: "tech",
        date: "2023-12-20",
        image: "/placeholder.svg?height=200&width=350"
    }
];

// Global variables
let currentPage = 1;
let postsPerPage = 6;
let filteredPosts = [...blogPosts];
let currentCategory = 'all';
let searchQuery = '';

// DOM elements
const postsGrid = document.getElementById('postsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const noResults = document.getElementById('noResults');

// Initialize the blog
function init() {
    renderPosts();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Pagination
    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));
}

// Handle search functionality
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    currentPage = 1;
    filterPosts();
    renderPosts();
}

// Handle category filtering
function handleFilter(e) {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentCategory = e.target.dataset.category;
    currentPage = 1;
    filterPosts();
    renderPosts();
}

// Filter posts based on category and search query
function filterPosts() {
    filteredPosts = blogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery) || 
                            post.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
}

// Render posts to the grid
function renderPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    if (postsToShow.length === 0) {
        postsGrid.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    postsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    document.getElementById('pagination').style.display = 'flex';
    
    postsGrid.innerHTML = postsToShow.map(post => createPostCard(post)).join('');
    updatePagination();
}

// Create HTML for a post card
function createPostCard(post) {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <article class="post-card">
            <img src="${post.image}" alt="${post.title}" class="post-image">
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-description">${post.description}</p>
                <time class="post-date">${formattedDate}</time>
            </div>
        </article>
    `;
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Change page
function changePage(direction) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPosts();
        
        // Smooth scroll to top of posts grid
        postsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', init);