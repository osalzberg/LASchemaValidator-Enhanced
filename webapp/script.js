/**
 * ===============================================================================
 * AZURE LOG ANALYTICS SCHEMA VALIDATOR - COMPREHENSIVE JAVASCRIPT ENGINE
 * ===============================================================================
 * 
 * OVERVIEW:
 * This is the core JavaScript engine for validating Azure Log Analytics schema files.
 * It implements Microsoft's official validation requirements for NGSchema (dedicated schema)
 * format and provides an enhanced user experience with detailed error reporting.
 * 
 * BUSINESS PURPOSE:
 * Azure Log Analytics requires specific schema formats for log ingestion. This validator
 * helps teams ensure their schema packages meet all Microsoft requirements before deployment,
 * preventing costly validation failures in production.
 * 
 * KEY FEATURES:
 * ✓ Validates manifest files (.manifest.json) - Main schema definitions
 * ✓ Validates transform manifest files (.transform.manifest.json) - Data transformation definitions  
 * ✓ Validates KQL files (.kql) - Kusto Query Language transforms and functions
 * ✓ Validates sample data files (.json) - Input/output test data
 * ✓ Analyzes complete folder structures for proper organization
 * ✓ Provides detailed error reporting with fix suggestions
 * ✓ Implements Microsoft's NGSchema v3 requirements
 * ✓ Detects performance issues (e.g., Dynamic type usage)
 * ✓ Interactive UI with progress tracking and drill-down capabilities
 * 
 * TECHNICAL ARCHITECTURE:
 * 1. File Upload & Processing: Drag-drop, file selection, and folder upload support
 * 2. Validation Engine: Comprehensive rule checking against Microsoft requirements  
 * 3. Results Display: Interactive accordion UI with detailed error reporting
 * 4. Performance Optimizations: Efficient DOM manipulation and memory management
 * 
 * MICROSOFT AZURE INTEGRATION:
 * - Implements official NGSchema v3 validation rules
 * - Checks for required TimeGenerated columns (DateTime type)
 * - Validates against forbidden system columns (Type, TenantId, etc.)
 * - Enforces column naming restrictions and data type requirements
 * - Provides Dynamic type performance warnings with alternatives
 * 
 * TEAM GUIDANCE:
 * - This code follows Azure design patterns and Microsoft's validation requirements
 * - All validation rules are based on official Microsoft documentation
 * - Error messages include specific suggestions for fixing common issues
 * - The UI provides both high-level summaries and detailed drill-down capabilities
 * ===============================================================================
 */

// ===== GLOBAL STATE MANAGEMENT =====
// These variables maintain application state throughout the validation process

/** 
 * @type {File[]} uploadedFiles - Array of files selected for validation
 * Contains File objects with metadata like name, size, and relative paths
 */
let uploadedFiles = [];

/** 
 * @type {Object[]} validationResults - Array of validation results for each processed file
 * Each result contains: filename, type, status, issues[], warnings[], originalContent
 */
let validationResults = [];

// ===== APPLICATION INITIALIZATION =====
// This section handles the startup sequence and initial setup of the application

/**
 * 🚀 APPLICATION STARTUP TRIGGER
 * This is the very first thing that happens when someone opens your validator webpage
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * Think of this as the "power button" for your app. When someone loads the webpage,
 * this automatically detects that everything is ready and kicks off the initialization process.
 * 
 * BUSINESS VALUE:
 * Ensures the app is fully ready before users can interact with it, preventing errors
 * and providing a smooth experience from the moment they arrive.
 * 
 * TECHNICAL DETAILS:
 * - Waits for DOM (webpage structure) to be completely loaded
 * - Calls initializeApp() to set up all the interactive features
 * - This is a standard web development pattern for app initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * 🏗️ MAIN APP INITIALIZATION ENGINE
 * This is the "setup crew" that prepares everything your users will interact with
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * Imagine setting up a complex workspace - this function is like having a team that:
 * - Connects all the buttons and controls
 * - Sets up drag-and-drop zones for files
 * - Prepares help tooltips and keyboard shortcuts
 * - Makes sure everything works smoothly together
 * 
 * BUSINESS VALUE:
 * Creates a professional, polished user experience that feels intuitive and responsive.
 * Users can immediately start validating their Azure files without confusion.
 * 
 * SETUP SEQUENCE:
 * 1. Check for required HTML elements (safety check)
 * 2. Connect all interactive buttons and controls
 * 3. Initialize helpful tooltips and animations
 * 4. Set up file upload capabilities (drag-drop + browse)
 * 5. Enable keyboard shortcuts for power users
 * 6. Prepare validation tools for immediate use
 */
function initializeApp() {
    console.log('🚀 Initializing Azure Log Analytics Schema Validator...');
    
    // Check if required elements exist in the DOM
    // These elements are defined in index.html and are critical for app functionality
    const uploadSection = document.getElementById('upload-section');
    const guideSection = document.getElementById('guide-section');
    const validationBtn = document.querySelector('button[onclick="toggleValidation()"]');
    const guideBtn = document.querySelector('button[onclick="toggleGuide()"]');
    
    console.log('📋 Element check:', {
        uploadSection: !!uploadSection,
        guideSection: !!guideSection,
        validationBtn: !!validationBtn,
        guideBtn: !!guideBtn
    });
    
    // Set up all event listeners for user interactions
    setupEventListeners();
    
    // Initialize Bootstrap tooltips for enhanced UX
    initializeTooltips();
    
    // Configure file upload input handlers (both single files and folders)
    setupFileInput();
    
    // Prevent unwanted drag & drop behavior outside upload areas
    setupDragDropPrevention();
    
    // Enable keyboard shortcuts for power users (V = validation, G = guide, ESC = close)
    setupKeyboardShortcuts();
    
    // Ensure drag and drop handlers are properly attached
    setupDragDropHandlers();
    
    // Get reference to validate button for later use
    const validateBtn = document.getElementById('validateBtn');
    
    console.log('✅ App initialization complete!');
}

/**
 * 🔗 EVENT LISTENER COORDINATOR
 * This connects user actions (clicks, changes) to the functions that handle them
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * Think of this as the "receptionist" for your app - it listens for when users interact
 * with different parts of the interface and makes sure the right functions get called.
 * 
 * USER INTERACTIONS HANDLED:
 * - Radio button selections (manifest, KQL, samples, etc.)
 * - File type changes that update upload instructions
 * - Button clicks for toggling sections
 * 
 * BUSINESS VALUE:
 * Creates a responsive interface where every click and selection does exactly what
 * the user expects, making the app feel professional and intuitive.
 */
function setupEventListeners() {
    // Upload type radio buttons
    const uploadTypeRadios = document.querySelectorAll('input[name="uploadType"]');
    uploadTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateUploadInstructions);
    });
    
    // Toggle buttons - using onclick attributes in HTML, no need for additional event listeners
    const toggleValidationBtn = document.querySelector('button[onclick="toggleValidation()"]');
    const toggleGuideBtn = document.querySelector('button[onclick="toggleGuide()"]');
    
}

/**
 * 🛡️ DRAG & DROP SECURITY GUARD
 * Prevents unwanted file drops that could break the user experience
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * Imagine you have a special drop zone for files, but you don't want users accidentally
 * dropping files anywhere else on the page. This function acts like a security guard
 * that says "only drop files in the designated area!"
 * 
 * BUSINESS VALUE:
 * Prevents user frustration from accidentally dropping files in wrong places.
 * Ensures files only get processed when dropped in the correct upload area.
 * 
 * TECHNICAL DETAILS:
 * - Blocks default browser behavior for drag events outside upload zones
 * - Allows normal drag-drop functionality within the designated upload area
 * - Prevents browser from trying to open dropped files as new pages
 */
function setupDragDropPrevention() {
    // Prevent default drag behaviors on document
    document.addEventListener('dragenter', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        // Only prevent default if not dropping on upload area
        const uploadArea = document.querySelector('.upload-area');
        if (!uploadArea || !uploadArea.contains(e.target)) {
            e.preventDefault();
        }
    });
}

/**
 * 💡 HELPFUL TOOLTIP ACTIVATOR
 * Sets up those handy little popup tips that appear when you hover over certain elements
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * You know those helpful little bubbles that pop up when you hover over buttons or icons
 * to tell you what they do? This function turns on that feature for your entire app.
 * 
 * BUSINESS VALUE:
 * Makes the app more user-friendly by providing instant help and explanations.
 * Reduces the need for external documentation - help is built right into the interface.
 * 
 * TECHNICAL DETAILS:
 * - Uses Bootstrap's tooltip component if available
 * - Safely handles cases where Bootstrap isn't loaded
 * - Automatically finds all elements marked for tooltips and activates them
 */
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltips.forEach(tooltip => {
                new bootstrap.Tooltip(tooltip);
            });
        }
    } catch (error) {
    }
}

/**
 * 📁 FILE INPUT CONNECTOR
 * Links the file selection buttons to the file processing system
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * This connects the "Browse Files" and "Select Folder" buttons to the actual file processing.
 * When someone clicks these buttons and selects files, this function makes sure those
 * files get sent to the validation system.
 * 
 * BUSINESS VALUE:
 * Provides multiple ways for users to upload files (individual files or entire folders),
 * making the tool flexible for different workflow preferences.
 * 
 * FILE HANDLING CAPABILITIES:
 * - Individual file selection (for single manifest or KQL files)
 * - Folder selection (for complete Azure schema packages)
 * - Automatic forwarding to the main file processing function
 */
function setupFileInput() {
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    folderInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
}

// ===== NAVIGATION & USER INTERFACE FUNCTIONS =====
// These functions handle user interactions with the main interface elements

/**
 * 🔼 SMOOTH SCROLL TO UPLOAD SECTION
 * Takes users directly to the file upload area with a smooth scrolling animation
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * When someone wants to upload files for validation, this function smoothly scrolls
 * the page to the upload section so they can see exactly where to drop their files.
 * 
 * BUSINESS VALUE:
 * Improves user experience by eliminating confusion about where to upload files.
 * Provides visual guidance that makes the tool feel more professional and user-friendly.
 */
function scrollToUpload() {
    document.getElementById('upload-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

/**
 * 📚 SMOOTH SCROLL TO HELP GUIDE
 * Takes users directly to the documentation and help section
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * If someone needs help understanding Azure Log Analytics validation, this function
 * smoothly scrolls to the comprehensive guide section with examples and tutorials.
 * 
 * BUSINESS VALUE:
 * Reduces support requests by making help easily accessible.
 * Helps users learn the tool quickly without external documentation.
 */
function scrollToGuide() {
    document.getElementById('guide-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

/**
 * 📖 INTERACTIVE GUIDE TOGGLE
 * Shows/hides the comprehensive help guide with smooth animations
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * This is like having a built-in help system that appears and disappears smoothly.
 * Users can toggle the guide on when they need help, and off when they want to focus
 * on validation. The button text changes to show what action is available.
 * 
 * BUSINESS VALUE:
 * Provides contextual help without cluttering the interface.
 * Users can access detailed Azure Log Analytics guidance whenever needed.
 * 
 * USER EXPERIENCE FEATURES:
 * - Smooth show/hide animations
 * - Button text updates ("View Guide" ↔ "Hide Guide")
 * - Auto-scroll to guide when opened
 * - Returns to main area when closed
 * - Visual button color changes for clear feedback
 */
function toggleGuide() {
    const guideSection = document.getElementById('guide-section');
    const button = document.getElementById('viewGuideBtn');
    
    if (!guideSection) {
        return;
    }
    
    if (!button) {
        return;
    }
    
    if (guideSection.style.display === 'none' || guideSection.style.display === '') {
        // Show the guide
        guideSection.style.display = 'block';
        guideSection.classList.remove('hide');
        guideSection.classList.add('show');
        
        // Update button
        button.innerHTML = '<i class="fas fa-times me-2"></i>Hide Guide';
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-outline-danger');
        
        // Auto-scroll to the guide section
        setTimeout(() => {
            guideSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 100);
    } else {
        // Hide the guide
        guideSection.classList.remove('show');
        guideSection.classList.add('hide');
        
        // Update button
        button.innerHTML = '<i class="fas fa-book me-2"></i>View Guide';
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-outline-primary');
        
        // Hide after animation completes
        setTimeout(() => {
            guideSection.style.display = 'none';
            guideSection.classList.remove('hide');
        }, 300);
        
        // Scroll back to the hero section
        document.querySelector('.hero-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

/**
 * 🔧 INTERACTIVE VALIDATION SECTION TOGGLE
 * Shows/hides the main file upload and validation area with smooth animations
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * This is the main "work area" toggle - it reveals the file upload zone where users
 * can drag-drop files or browse for Azure schema files to validate. When hidden,
 * it keeps the interface clean and focused.
 * 
 * BUSINESS VALUE:
 * Provides a clean, uncluttered interface that only shows tools when needed.
 * Users can focus on learning first (with the guide) then switch to validation mode.
 * 
 * USER EXPERIENCE FEATURES:
 * - Smooth show/hide animations with CSS transitions
 * - Dynamic button text updates ("Start Validation" ↔ "Hide Validation")
 * - Button color changes (blue → red) for clear visual feedback
 * - Auto-scroll to validation area when opened
 * - Returns to hero section when closed
 * - Maintains state during file upload process
 */
function toggleValidation() {
    const uploadSection = document.getElementById('upload-section');
    const button = document.querySelector('button[onclick="toggleValidation()"]');
    
    
    if (!uploadSection) {
        return;
    }
    
    if (!button) {
        return;
    }
    
    if (uploadSection.style.display === 'none' || uploadSection.style.display === '') {
        // Show the upload section
        uploadSection.style.display = 'block';
        uploadSection.classList.remove('hide');
        uploadSection.classList.add('show');
        
        // Update button
        button.innerHTML = '<i class="fas fa-times me-2"></i>Hide Validation';
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-danger');
        
        // Auto-scroll to the upload section
        setTimeout(() => {
            uploadSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 100);
    } else {
        // Hide the upload section
        uploadSection.classList.remove('show');
        uploadSection.classList.add('hide');
        
        // Update button
        button.innerHTML = '<i class="fas fa-upload me-2"></i>Start Validation';
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-primary');
        
        // Hide after animation completes
        setTimeout(() => {
            uploadSection.style.display = 'none';
            uploadSection.classList.remove('hide');
        }, 300);
        
        // Scroll back to the hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }
}

// Functions with auto-scroll for main buttons
function startValidationWithScroll() {
    const uploadSection = document.getElementById('upload-section');
    const button = document.getElementById('startValidationBtn');
    
    if (!uploadSection) {
        return;
    }
    
    if (!button) {
        return;
    }
    
    if (uploadSection.style.display === 'none' || uploadSection.style.display === '') {
        // Show the upload section
        uploadSection.style.display = 'block';
        uploadSection.classList.remove('hide');
        uploadSection.classList.add('show');
        
        // Update button
        button.innerHTML = '<i class="fas fa-times me-2"></i>Hide Validation';
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-danger');
        
        // Auto-scroll to the upload section
        setTimeout(() => {
            uploadSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 100);
    } else {
        // Hide the upload section
        uploadSection.classList.remove('show');
        uploadSection.classList.add('hide');
        
        // Update button
        button.innerHTML = '<i class="fas fa-upload me-2"></i>Start Validation';
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-primary');
        
        // Hide after animation completes
        setTimeout(() => {
            uploadSection.style.display = 'none';
            uploadSection.classList.remove('hide');
        }, 300);
        
        // Scroll back to the hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }
}

function viewGuideWithScroll() {
    const guideSection = document.getElementById('guide-section');
    const button = document.getElementById('viewGuideBtn');
    
    if (!guideSection) {
        return;
    }
    
    if (!button) {
        return;
    }
    
    if (guideSection.style.display === 'none' || guideSection.style.display === '') {
        // Show the guide
        guideSection.style.display = 'block';
        guideSection.classList.remove('hide');
        guideSection.classList.add('show');
        
        // Update button
        button.innerHTML = '<i class="fas fa-times me-2"></i>Hide Guide';
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-outline-danger');
        
        // Auto-scroll to the guide section
        setTimeout(() => {
            guideSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 100);
    } else {
        // Hide the guide
        guideSection.classList.remove('show');
        guideSection.classList.add('hide');
        
        // Update button
        button.innerHTML = '<i class="fas fa-book me-2"></i>View Guide';
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-outline-primary');
        
        // Hide after animation completes
        setTimeout(() => {
            guideSection.style.display = 'none';
            guideSection.classList.remove('hide');
        }, 300);
        
        // Scroll back to the hero section
        document.querySelector('.hero-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// File upload type change handler
function updateUploadInstructions() {
    const selectedType = document.querySelector('input[name="uploadType"]:checked').value;
    const uploadContent = document.querySelector('.upload-content h4');
    const uploadDescription = document.querySelector('.upload-content p');
    
    const instructions = {
        manifest: {
            title: 'Upload Manifest File',
            description: 'Select your .manifest.json file for validation'
        },
        kql: {
            title: 'Upload KQL Files',
            description: 'Select .kql files (transforms, queries, functions)'
        },
        samples: {
            title: 'Upload Sample Data',
            description: 'Select .json files with input/output samples'
        },
        complete: {
            title: 'Upload Complete Package',
            description: 'Select all files from your schema package'
        },
        folder: {
            title: 'Upload Folder',
            description: 'Select an entire folder containing your schema package'
        }
    };
    
    uploadContent.textContent = instructions[selectedType].title;
    uploadDescription.textContent = instructions[selectedType].description;
}

// Drag and drop handlers
function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.classList.add('drag-over');
    }
}

function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.classList.add('drag-over');
    }
}

function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Only remove the class if we're leaving the upload area entirely
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea && !uploadArea.contains(event.relatedTarget)) {
        uploadArea.classList.remove('drag-over');
    }
}

function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.classList.remove('drag-over');
    }
    
    // Handle both files and folder drops
    const items = event.dataTransfer.items;
    const files = event.dataTransfer.files;
    
    
    if (items && items.length > 0) {
        // Handle drag and drop with folder support
        handleDraggedItems(items);
    } else if (files && files.length > 0) {
        // Fallback to regular file handling
        handleFiles(files);
    }
}

// New function to handle dragged items (including folders)
function handleDraggedItems(items) {
    const allFiles = [];
    const promises = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
                promises.push(traverseFileTree(entry, allFiles));
            }
        }
    }
    
    Promise.all(promises).then(() => {
        if (allFiles.length > 0) {
            handleFiles(allFiles);
        }
    });
}

// Recursive function to traverse file tree
function traverseFileTree(item, allFiles, path = '') {
    return new Promise((resolve) => {
        if (item.isFile) {
            item.file(function(file) {
                // Add relative path information to file object
                const fileWithPath = new File([file], file.name, { type: file.type });
                fileWithPath.relativePath = path + file.name;
                fileWithPath.webkitRelativePath = path + file.name;
                allFiles.push(fileWithPath);
                resolve();
            });
        } else if (item.isDirectory) {
            const dirReader = item.createReader();
            dirReader.readEntries(function(entries) {
                const promises = [];
                for (let i = 0; i < entries.length; i++) {
                    promises.push(traverseFileTree(entries[i], allFiles, path + item.name + '/'));
                }
                Promise.all(promises).then(() => resolve());
            });
        } else {
            resolve();
        }
    });
}

// File handling
function handleFiles(files) {
    
    if (files.length === 0) {
        return;
    }
    
    // Clear any existing validation results when new files are selected
    clearValidationResults();
    
    uploadedFiles = Array.from(files);
    
    // Sort files by path for better organization
    uploadedFiles.sort((a, b) => {
        const pathA = a.webkitRelativePath || a.name;
        const pathB = b.webkitRelativePath || b.name;
        return pathA.localeCompare(pathB);
    });
    
    displayFileList();
    enableValidateButton();
    
    // Auto-scroll to the validate button after files are loaded
    setTimeout(() => {
        const validateBtn = document.getElementById('validateBtn');
        if (validateBtn) {
            validateBtn.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, 300); // Small delay to ensure file list is rendered
}

// Function to clear validation results and reset UI when new files are selected
function clearValidationResults() {
    // Hide results section
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Clear results content
    const resultsDiv = document.getElementById('validationResults');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
    
    // Clear global validation results
    validationResults = [];
    
    // Reset validate button to normal state
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Validate Files';
        validateBtn.classList.remove('btn-danger', 'btn-warning');
        validateBtn.classList.add('btn-success');
        validateBtn.disabled = false;
    }
}

function displayFileList() {
    const fileListDiv = document.getElementById('fileList');
    const fileItemsDiv = document.getElementById('fileListContent');
    
    if (uploadedFiles.length === 0) {
        fileListDiv.style.display = 'none';
        return;
    }
    
    fileListDiv.style.display = 'block';
    fileItemsDiv.innerHTML = '';
    
    // Group files by folder if they have relative paths
    const filesByFolder = {};
    const standaloneFiles = [];
    
    uploadedFiles.forEach((file, index) => {
        const relativePath = file.webkitRelativePath || file.relativePath;
        if (relativePath && relativePath.includes('/')) {
            const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));
            if (!filesByFolder[folderPath]) {
                filesByFolder[folderPath] = [];
            }
            filesByFolder[folderPath].push({ file, index });
        } else {
            standaloneFiles.push({ file, index });
        }
    });
    
    // Display folder structure
    const folderPaths = Object.keys(filesByFolder).sort();
    folderPaths.forEach(folderPath => {
        // Add folder header
        const folderHeader = document.createElement('div');
        folderHeader.className = 'folder-header mb-2';
        folderHeader.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-folder text-primary me-2"></i>
                <strong>${folderPath}</strong>
                <span class="badge bg-secondary ms-2">${filesByFolder[folderPath].length} files</span>
            </div>
        `;
        fileItemsDiv.appendChild(folderHeader);
        
        // Add files in folder
        filesByFolder[folderPath].forEach(({ file, index }) => {
            const fileItem = createFileListItem(file, index, true);
            fileItemsDiv.appendChild(fileItem);
        });
    });
    
    // Display standalone files
    if (standaloneFiles.length > 0 && folderPaths.length > 0) {
        const standaloneHeader = document.createElement('div');
        standaloneHeader.className = 'folder-header mb-2 mt-3';
        standaloneHeader.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-file text-secondary me-2"></i>
                <strong>Individual Files</strong>
                <span class="badge bg-secondary ms-2">${standaloneFiles.length} files</span>
            </div>
        `;
        fileItemsDiv.appendChild(standaloneHeader);
    }
    
    standaloneFiles.forEach(({ file, index }) => {
        const fileItem = createFileListItem(file, index, false);
        fileItemsDiv.appendChild(fileItem);
    });
}

function createFileListItem(file, index, isInFolder = false) {
    const fileItem = document.createElement('div');
    fileItem.className = `list-group-item file-item d-flex align-items-center ${isInFolder ? 'ms-3' : ''}`;
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    const relativePath = file.webkitRelativePath || file.relativePath;
    const displayName = relativePath ? relativePath.split('/').pop() : file.name;
    const fullPath = relativePath || file.name;
    
    fileItem.innerHTML = `
        <div class="file-icon ${fileIcon.class}">
            <i class="${fileIcon.icon}"></i>
        </div>
        <div class="flex-grow-1">
            <div class="fw-bold">${displayName}</div>
            <small class="text-muted">
                ${fileSize} • ${fileIcon.type}
                ${relativePath ? `<br><span class="text-info">Path: ${fullPath}</span>` : ''}
            </small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFile(${index})" title="Remove file">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return fileItem;
}

function getFileIcon(filename) {
    // Enhanced error handling for undefined filename
    if (!filename || typeof filename !== 'string') {
        // Return appropriate error icon without logging sensitive data
        return { icon: 'fas fa-exclamation-triangle', class: 'error', type: 'Invalid File' };
    }
    
    const extension = filename.split('.').pop().toLowerCase();
    
    if (filename.includes('.transform.manifest.json')) {
        return { icon: 'fas fa-exchange-alt', class: 'transform-manifest', type: 'Transform Manifest' };
    } else if (filename.includes('.manifest.json')) {
        return { icon: 'fas fa-file-code', class: 'manifest', type: 'Manifest' };
    } else if (extension === 'kql') {
        return { icon: 'fas fa-search', class: 'kql', type: 'KQL' };
    } else if (extension === 'json') {
        return { icon: 'fas fa-database', class: 'json', type: 'JSON' };
    } else {
        return { icon: 'fas fa-file', class: 'other', type: 'Other' };
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayFileList();
    
    if (uploadedFiles.length === 0) {
        disableValidateButton();
    }
}

function enableValidateButton() {
    const validateBtn = document.getElementById('validateBtn');
    validateBtn.disabled = false;
}

function disableValidateButton() {
    const validateBtn = document.getElementById('validateBtn');
    validateBtn.disabled = true;
}

// ===== CORE VALIDATION ENGINE =====
// This section contains the main validation logic that implements Microsoft's Azure Log Analytics requirements

/**
 * Main validation orchestrator function
 * Coordinates the entire validation process from start to finish
 * 
 * VALIDATION PIPELINE:
 * 1. Input validation (ensure files are selected)
 * 2. UI preparation (progress bars, animations)
 * 3. File-by-file validation with real-time progress updates
 * 4. Folder structure analysis (if applicable)
 * 5. Results compilation and presentation
 * 6. Error handling and user feedback
 * 
 * MICROSOFT COMPLIANCE:
 * - Implements NGSchema v3 validation rules
 * - Validates against official Azure Log Analytics requirements
 * - Provides detailed error messages with fix suggestions
 * 
 * TEAM NOTE: This is the main entry point for validation.
 * All validation rules are defined in the individual validator functions below.
 */
async function validateFiles() {
    
    // Guard clause: Ensure files are selected before proceeding
    if (uploadedFiles.length === 0) {
        showAlert('Please select files to validate.', 'warning');
        return;
    }
    
    
    // Initialize UI feedback systems
    startValidationAnimation();  // Button animation for user feedback
    showValidationProgress();    // Progress bar and file counter
    
    try {
        // MAIN VALIDATION LOOP
        // Process each uploaded file individually to provide granular feedback
        const results = [];
        for (let i = 0; i < uploadedFiles.length; i++) {
            // Update UI to show current file being processed
            updateCurrentFile(i, uploadedFiles[i]);
            
            // Update progress bar (percentage based on files processed)
            updateProgress((i / uploadedFiles.length) * 100);
            
            // Validate the current file against Microsoft requirements
            const result = await validateFile(uploadedFiles[i]);
            results.push(result);
        }
        
        // Finalize progress indication
        updateProgress(100);
        const fileDisplayElement = document.getElementById('current-file-display');
        if (fileDisplayElement) {
            fileDisplayElement.innerHTML = `<strong>Validation completed!</strong>`;
        }
        
        // FOLDER STRUCTURE ANALYSIS
        // Only run folder analysis if:
        // 1. Files have relative paths (indicating folder upload)
        // 2. There are multiple files (single file doesn't need folder analysis)
        // 3. Files are from different directories or organized in a folder structure
        const hasfolderStructure = uploadedFiles.some(file => file.webkitRelativePath || file.relativePath);
        const hasMultipleFiles = uploadedFiles.length > 1;
        const shouldAnalyzeFolder = hasfolderStructure && hasMultipleFiles;
        
        if (shouldAnalyzeFolder) {
            if (fileDisplayElement) {
                fileDisplayElement.innerHTML = `<strong>Analyzing folder structure...</strong>`;
            }
            const folderAnalysis = analyzeFolderStructure(uploadedFiles);
            results.unshift(folderAnalysis); // Add folder analysis at the beginning for prominence
        }
        
        // Present comprehensive results to user
        displayValidationResults(results);
        
        // Complete validation with success feedback
        stopValidationAnimation(true);
        
    } catch (error) {
        // Handle any unexpected errors during validation
        hideValidationProgress();
        stopValidationAnimation(false);
        showAlert('An error occurred during validation: ' + error.message, 'danger');
    }
}

function analyzeFolderStructure(files) {
    const folderAnalysis = {
        filename: '📁 Folder Structure Analysis',
        type: 'folder',
        status: 'pass',
        issues: [],
        warnings: [],
        fileSize: 0,
        folderAnalysis: true
    };
    
    // Check for required directories
    const requiredDirs = ['KQL', 'SampleInputRecords', 'SampleOutputRecords'];
    const foundDirs = new Set();
    const filesByFolder = {};
    const allDirectories = new Set();
    
    // Analyze all files and their paths
    files.forEach(file => {
        const relativePath = file.webkitRelativePath || file.relativePath;
        if (relativePath) {
            const pathParts = relativePath.split('/');
            
            // Add all directory levels to our tracking
            for (let i = 0; i < pathParts.length - 1; i++) {
                const dirPath = pathParts.slice(0, i + 1).join('/');
                allDirectories.add(dirPath);
                
                // Track the directory name itself
                const dirName = pathParts[i];
                foundDirs.add(dirName);
            }
            
            if (pathParts.length > 1) {
                const topLevelDir = pathParts[0];
                if (!filesByFolder[topLevelDir]) {
                    filesByFolder[topLevelDir] = [];
                }
                filesByFolder[topLevelDir].push(file);
            }
        }
    });
    
    
    // Check for required directories
    requiredDirs.forEach(dir => {
        if (!foundDirs.has(dir)) {
            folderAnalysis.issues.push({
                message: `Missing required directory: ${dir}`,
                type: 'error',
                field: 'folder_structure',
                location: 'root',
                currentValue: 'missing',
                expectedValue: dir,
                suggestion: `Create the ${dir} directory and add appropriate files`
            });
        }
    });
    
    // Check for manifest file
    const manifestFiles = files.filter(file => file.name.includes('.manifest.json'));
    if (manifestFiles.length === 0) {
        folderAnalysis.issues.push({
            message: 'No manifest.json file found',
            type: 'error',
            field: 'manifest_file',
            location: 'root',
            currentValue: 'missing',
            expectedValue: 'manifest.json',
            suggestion: 'Add a manifest.json file to the root directory'
        });
    } else if (manifestFiles.length > 1) {
        folderAnalysis.warnings.push('Multiple manifest files found');
    }
    
    // Check for KQL files
    const kqlFiles = files.filter(file => file.name.endsWith('.kql'));
    if (kqlFiles.length === 0) {
        folderAnalysis.warnings.push('No KQL files found');
    }
    
    // Check for sample files
    const sampleFiles = files.filter(file => file.name.endsWith('.json') && !file.name.includes('manifest'));
    if (sampleFiles.length === 0) {
        folderAnalysis.warnings.push('No sample data files found');
    }
    
    // Set overall status
    if (folderAnalysis.issues.length > 0) {
        folderAnalysis.status = 'fail';
    }
    
    return folderAnalysis;
}

async function validateFile(file) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filename = file.name;
    const relativePath = file.webkitRelativePath || file.relativePath;
    const fileType = getFileType(filename);
    
    let validationResult = {
        filename: filename,
        relativePath: relativePath,
        displayName: relativePath || filename,
        type: fileType,
        status: 'pass',
        issues: [],
        warnings: [],
        fileSize: file.size
    };
    
    try {
        if (fileType === 'manifest') {
            validationResult = await validateManifestFile(file, validationResult);
        } else if (fileType === 'transform-manifest') {
            validationResult = await validateTransformManifestFile(file, validationResult);
        } else if (fileType === 'kql') {
            validationResult = await validateKQLFile(file, validationResult);
        } else if (fileType === 'json') {
            validationResult = await validateJSONFile(file, validationResult);
        } else {
            validationResult.warnings.push('File type not recognized for validation');
        }
    } catch (error) {
        validationResult.status = 'fail';
        validationResult.issues.push('Error reading file: ' + error.message);
    }
    
    return validationResult;
}

function getFileType(filename) {
    if (filename.includes('.transform.manifest.json')) return 'transform-manifest';
    if (filename.includes('.manifest.json')) return 'manifest';
    if (filename.endsWith('.kql')) return 'kql';
    if (filename.endsWith('.json')) return 'json';
    return 'other';
}

async function validateManifestFile(file, result) {
    const content = await readFileContent(file);
    
    try {
        const manifest = JSON.parse(content);
        
        // Store original content for drill-down
        result.originalContent = content;
        result.parsedContent = manifest;
        
        // Check required top-level properties based on official documentation
        const requiredFields = ['type', 'displayName', 'description', 'simplifiedSchemaVersion', 'tables'];
        requiredFields.forEach(field => {
            if (!manifest[field]) {
                // Find a good location to suggest adding the field
                const lines = content.split('\n');
                let suggestedLineNumber = 1;
                let insertAfterField = null;
                
                // Look for existing fields to determine where to add the missing one
                const fieldOrder = ['type', 'displayName', 'description', 'simplifiedSchemaVersion', 'tables'];
                const currentFieldIndex = fieldOrder.indexOf(field);
                
                // Find the last existing field that comes before this one in the recommended order
                for (let i = currentFieldIndex - 1; i >= 0; i--) {
                    const previousField = fieldOrder[i];
                    if (manifest[previousField]) {
                        insertAfterField = previousField;
                        break;
                    }
                }
                
                // Find the line number where we should suggest adding the field
                if (insertAfterField) {
                    // Find the line containing the previous field
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes(`"${insertAfterField}"`)) {
                            suggestedLineNumber = i + 2; // Add after the field line
                            break;
                        }
                    }
                } else {
                    // If no previous field found, suggest adding after the opening brace
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].trim() === '{') {
                            suggestedLineNumber = i + 2;
                            break;
                        }
                    }
                }
                
                // Create example value based on field type
                let exampleValue;
                switch (field) {
                    case 'type':
                        exampleValue = 'NGSchema';
                        break;
                    case 'displayName':
                        exampleValue = 'Your Log Table Name';
                        break;
                    case 'description':
                        exampleValue = 'Description of your log table data.';
                        break;
                    case 'simplifiedSchemaVersion':
                        exampleValue = '3';
                        break;
                    case 'tables':
                        exampleValue = '[]';
                        break;
                    default:
                        exampleValue = '""';
                }
                
                const fixCode = `"${field}": ${typeof exampleValue === 'string' && field !== 'tables' ? `"${exampleValue}"` : exampleValue}`;
                
                result.issues.push({
                    message: `Missing required field: ${field}`,
                    type: 'missing_field',
                    field: field,
                    location: `root.${field}`,
                    lineNumber: suggestedLineNumber,
                    severity: 'error',
                    currentValue: 'missing',
                    expectedValue: exampleValue,
                    suggestion: `Add the required field "${field}" to the root level of your manifest file.`,
                    fixInstructions: `Add this line ${insertAfterField ? `after the "${insertAfterField}" field` : 'near the beginning of the file'}: ${fixCode}`,
                    fixCode: fixCode,
                    microsoftRequirement: `The "${field}" field is required by Azure Log Analytics NGSchema v3 specification.`
                });
                result.status = 'fail';
            }
        });
        
        // Check schema version
        if (manifest.simplifiedSchemaVersion !== "3") {
            result.issues.push({
                message: 'simplifiedSchemaVersion must be "3"',
                type: 'invalid_value',
                field: 'simplifiedSchemaVersion',
                location: 'root',
                currentValue: manifest.simplifiedSchemaVersion,
                expectedValue: '3',
                severity: 'error',
                suggestion: 'Change the simplifiedSchemaVersion value to "3" to match the current schema requirements.'
            });
            result.status = 'fail';
        }
        
        // Validate descriptions
        if (manifest.description) {
            validateDescription(manifest.description, 'Top-level description', result, 'root.description');
        }
        
        // Validate tables (required and must have at least one)
        if (!manifest.tables || !Array.isArray(manifest.tables)) {
            result.issues.push({
                message: 'tables field must be an array',
                type: 'invalid_type',
                field: 'tables',
                location: 'root',
                severity: 'error',
                suggestion: 'The tables field must be an array containing at least one table object.'
            });
            result.status = 'fail';
        } else if (manifest.tables.length === 0) {
            result.issues.push({
                message: 'tables array must contain at least one table object',
                type: 'empty_array',
                field: 'tables',
                location: 'root',
                severity: 'error',
                suggestion: 'Add at least one table object to the tables array.'
            });
            result.status = 'fail';
        } else {
            manifest.tables.forEach((table, index) => {
                validateTable(table, index, result);
            });
        }
        
        // Validate functions (optional - can be empty array)
        if (manifest.functions !== undefined) {
            if (!Array.isArray(manifest.functions)) {
                result.issues.push({
                    message: 'functions field must be an array (can be empty)',
                    type: 'invalid_type',
                    field: 'functions',
                    location: 'root',
                    severity: 'error',
                    suggestion: 'Change the functions field to an array. It can be empty if no functions are defined.'
                });
                result.status = 'fail';
            } else if (manifest.functions.length > 0) {
                manifest.functions.forEach((func, index) => {
                    validateFunction(func, index, result);
                });
            }
        }
        
        // Validate queries (optional - can be empty array)
        if (manifest.queries !== undefined) {
            if (!Array.isArray(manifest.queries)) {
                result.issues.push({
                    message: 'queries field must be an array (can be empty)',
                    type: 'invalid_type',
                    field: 'queries',
                    location: 'root',
                    severity: 'error',
                    suggestion: 'Change the queries field to an array. It can be empty if no queries are defined.'
                });
                result.status = 'fail';
            } else if (manifest.queries.length > 0) {
                manifest.queries.forEach((query, index) => {
                    validateQuery(query, index, result);
                });
            }
        }
        
        // Validate optional fields when present
        if (manifest.icmTeam && typeof manifest.icmTeam !== 'string') {
            result.issues.push({
                message: 'icmTeam must be a string',
                type: 'invalid_type',
                field: 'icmTeam',
                location: 'root',
                currentValue: typeof manifest.icmTeam,
                expectedValue: 'string',
                severity: 'error',
                suggestion: 'Change the icmTeam value to a string representing the team name.'
            });
            result.status = 'fail';
        }
        
        if (manifest.contactDL && typeof manifest.contactDL !== 'string') {
            result.issues.push({
                message: 'contactDL must be a string',
                type: 'invalid_type',
                field: 'contactDL',
                location: 'root',
                currentValue: typeof manifest.contactDL,
                expectedValue: 'string',
                severity: 'error',
                suggestion: 'Change the contactDL value to a string representing the contact distribution list.'
            });
            result.status = 'fail';
        }
        
        if (manifest.relatedTables && !Array.isArray(manifest.relatedTables)) {
            result.issues.push({
                message: 'relatedTables must be an array',
                type: 'invalid_type',
                field: 'relatedTables',
                location: 'root',
                severity: 'error',
                suggestion: 'Change the relatedTables field to an array of table references.'
            });
            result.status = 'fail';
        }
        
        if (manifest.relatedFunctions && !Array.isArray(manifest.relatedFunctions)) {
            result.issues.push({
                message: 'relatedFunctions must be an array',
                type: 'invalid_type',
                field: 'relatedFunctions',
                location: 'root',
                severity: 'error',
                suggestion: 'Change the relatedFunctions field to an array of function references.'
            });
            result.status = 'fail';
        }
        
        if (result.issues.length === 0 && result.status !== 'fail') {
            result.status = 'pass';
        }
        
    } catch (error) {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid JSON format: ' + error.message,
            type: 'json_syntax_error',
            field: 'file',
            location: 'entire_file',
            severity: 'error',
            suggestion: 'Fix the JSON syntax errors in the file. Common issues include missing commas, unmatched brackets, or invalid characters.'
        });
    }
    
    return result;
}

async function validateTransformManifestFile(file, result) {
    const content = await readFileContent(file);
    
    try {
        const manifest = JSON.parse(content);
        
        // Store original content for drill-down
        result.originalContent = content;
        result.parsedContent = manifest;
        
        // Add identifier that this is a transform manifest
        result.isTransformManifest = true;
        
        // Check required fields for transform manifests based on documentation
        const requiredFields = ['name', 'description', 'transformVersion', 'dataTypeId', 'transformState', 'icmTeam', 'contactDL', 'relatedTable', 'kqlFilePath', 'sampleInputRecordsFilePath', 'sampleOutputRecordsFilePath'];
        requiredFields.forEach(field => {
            if (!manifest[field]) {
                result.issues.push({
                    message: `Missing required field: ${field}`,
                    type: 'missing_field',
                    field: field,
                    location: 'root',
                    severity: 'error',
                    suggestion: `Add the required field "${field}" to the root level of your transform manifest file.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate transform manifest should NOT have these fields (they belong to NGSchema)
        const forbiddenFields = ['type', 'displayName', 'simplifiedSchemaVersion', 'tables', 'functions', 'queries'];
        forbiddenFields.forEach(field => {
            if (manifest[field]) {
                result.issues.push({
                    message: `Transform manifest should not contain field: ${field}`,
                    type: 'forbidden_field',
                    field: field,
                    location: 'root',
                    currentValue: manifest[field],
                    severity: 'error',
                    suggestion: `Remove the "${field}" field from the transform manifest. This field belongs to the main NGSchema manifest, not transform manifests.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate descriptions
        if (manifest.description) {
            validateDescription(manifest.description, 'Transform description', result, 'root.description');
        }
        
        // Validate transformVersion is a number >= 1
        if (manifest.transformVersion !== undefined) {
            if (typeof manifest.transformVersion !== 'number' || manifest.transformVersion < 1 || !Number.isInteger(manifest.transformVersion)) {
                result.issues.push({
                    message: 'transformVersion must be an integer >= 1',
                    type: 'invalid_value',
                    field: 'transformVersion',
                    location: 'root',
                    currentValue: manifest.transformVersion,
                    expectedValue: 'integer >= 1',
                    severity: 'error',
                    suggestion: 'Change the transformVersion to a positive integer starting from 1.'
                });
                result.status = 'fail';
            }
        }
        
        // Validate dataTypeId follows naming convention
        if (manifest.dataTypeId && typeof manifest.dataTypeId === 'string') {
            if (!manifest.dataTypeId.includes('_')) {
                result.warnings.push({
                    message: 'dataTypeId should follow SERVICEIDENTITYNAME_LOGCATEGORYNAME convention',
                    type: 'naming_convention_warning',
                    field: 'dataTypeId',
                    location: 'root.dataTypeId',
                    currentValue: manifest.dataTypeId,
                    severity: 'warning',
                    suggestion: 'Consider using the naming convention SERVICEIDENTITYNAME_LOGCATEGORYNAME for better consistency (e.g., "CISCO_SECURITY").'
                });
            }
        }
        
        // Validate transformState
        if (manifest.transformState !== undefined) {
            const validStates = ['Validation', 'Production'];
            if (!validStates.includes(manifest.transformState)) {
                result.issues.push({
                    message: 'transformState must be either "Validation" or "Production"',
                    type: 'invalid_value',
                    field: 'transformState',
                    location: 'root',
                    currentValue: manifest.transformState,
                    expectedValue: 'Validation or Production',
                    severity: 'error',
                    suggestion: 'Set transformState to either "Validation" for testing or "Production" for live deployment.'
                });
                result.status = 'fail';
            }
        }
        
        // Validate string fields
        const stringFields = ['name', 'icmTeam', 'contactDL', 'relatedTable', 'kqlFilePath', 'sampleInputRecordsFilePath', 'sampleOutputRecordsFilePath'];
        stringFields.forEach(field => {
            if (manifest[field] && typeof manifest[field] !== 'string') {
                result.issues.push({
                    message: `${field} must be a string`,
                    type: 'invalid_type',
                    field: field,
                    location: 'root',
                    currentValue: typeof manifest[field],
                    expectedValue: 'string',
                    severity: 'error',
                    suggestion: `Change the ${field} value to a string.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate file paths have correct extensions
        if (manifest.kqlFilePath && !manifest.kqlFilePath.endsWith('.kql')) {
            result.issues.push({
                message: 'kqlFilePath must reference a .kql file',
                type: 'invalid_file_extension',
                field: 'kqlFilePath',
                location: 'root',
                currentValue: manifest.kqlFilePath,
                severity: 'error',
                suggestion: 'Change the kqlFilePath to reference a file with .kql extension.'
            });
            result.status = 'fail';
        }
        
        if (manifest.sampleInputRecordsFilePath && !manifest.sampleInputRecordsFilePath.endsWith('.json')) {
            result.issues.push({
                message: 'sampleInputRecordsFilePath must reference a .json file',
                type: 'invalid_file_extension',
                field: 'sampleInputRecordsFilePath',
                location: 'root',
                currentValue: manifest.sampleInputRecordsFilePath,
                severity: 'error',
                suggestion: 'Change the sampleInputRecordsFilePath to reference a file with .json extension.'
            });
            result.status = 'fail';
        }
        
        if (manifest.sampleOutputRecordsFilePath && !manifest.sampleOutputRecordsFilePath.endsWith('.json')) {
            result.issues.push({
                message: 'sampleOutputRecordsFilePath must reference a .json file',
                type: 'invalid_file_extension',
                field: 'sampleOutputRecordsFilePath',
                location: 'root',
                currentValue: manifest.sampleOutputRecordsFilePath,
                severity: 'error',
                suggestion: 'Change the sampleOutputRecordsFilePath to reference a file with .json extension.'
            });
            result.status = 'fail';
        }
        
        // Validate optional inputFilePath if present (for new dataTypeIds)
        if (manifest.inputFilePath !== undefined) {
            if (typeof manifest.inputFilePath !== 'string') {
                result.issues.push({
                    message: 'inputFilePath must be a string',
                    type: 'invalid_type',
                    field: 'inputFilePath',
                    location: 'root',
                    severity: 'error',
                    suggestion: 'Change the inputFilePath value to a string.'
                });
                result.status = 'fail';
            } else if (!manifest.inputFilePath.endsWith('.json')) {
                result.issues.push({
                    message: 'inputFilePath must reference a .json file',
                    type: 'invalid_file_extension',
                    field: 'inputFilePath',
                    location: 'root',
                    currentValue: manifest.inputFilePath,
                    severity: 'error',
                    suggestion: 'Change the inputFilePath to reference a file with .json extension.'
                });
                result.status = 'fail';
            }
        }
        
        // Add informational note about what this transform does
        if (manifest.relatedTable) {
            result.warnings.push({
                message: `This transform sends data to the "${manifest.relatedTable}" table`,
                type: 'info',
                field: 'relatedTable',
                location: 'root.relatedTable',
                currentValue: manifest.relatedTable,
                severity: 'info',
                suggestion: 'Ensure that the referenced table exists in the main NGSchema and that your transform KQL produces data compatible with that table structure.'
            });
        }
        
        if (result.issues.length === 0 && result.status !== 'fail') {
            result.status = 'pass';
        }
        
    } catch (error) {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid JSON format: ' + error.message,
            type: 'json_syntax_error',
            field: 'file',
            location: 'entire_file',
            severity: 'error',
            suggestion: 'Fix the JSON syntax errors in the file. Common issues include missing commas, unmatched brackets, or invalid characters.'
        });
    }
    
    return result;
}

// Helper function to find line number for missing function fields
function findFunctionLineNumber(func, index, missingField) {
    try {
        const content = window.currentFileContent;
        if (!content) return index + 1;
        
        const lines = content.split('\n');
        let inFunctionsArray = false;
        let functionIndex = -1;
        let braceCount = 0;
        let inCurrentFunction = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Find functions array
            if (line.includes('"functions"') && line.includes('[')) {
                inFunctionsArray = true;
                continue;
            }
            
            if (inFunctionsArray) {
                // Track function objects
                if (line.includes('{') && !line.includes('}')) {
                    if (braceCount === 0) {
                        functionIndex++;
                        if (functionIndex === index) {
                            inCurrentFunction = true;
                        }
                    }
                    braceCount++;
                } else if (line.includes('}') && !line.includes('{')) {
                    braceCount--;
                    if (braceCount === 0 && inCurrentFunction) {
                        // End of current function, return line before closing brace
                        return i;
                    }
                }
                
                // If we're in the current function and it's the closing brace
                if (inCurrentFunction && line.trim() === '}' && braceCount === 1) {
                    return i;
                }
            }
        }
        
        return index + 1;
    } catch (error) {
        console.error('Error finding function line number:', error);
        return index + 1;
    }
}

// Helper function to generate fix code for missing function fields
function generateFunctionFixCode(field, func) {
    const examples = {
        'name': func.name || '_ASim_ExampleFunction',
        'displayName': func.displayName || 'Example Function Display Name',
        'description': func.description || 'Example function description',
        'bodyFilePath': func.bodyFilePath || 'KQL/Example/ExampleFunction.kql'
    };
    
    return `"${field}": "${examples[field]}"`;
}

async function validateTransformManifestFile(file, result) {
    const content = await readFileContent(file);
    
    try {
        const manifest = JSON.parse(content);
        
        // Store original content for drill-down
        result.originalContent = content;
        result.parsedContent = manifest;
        
        // Add identifier that this is a transform manifest
        result.isTransformManifest = true;
        
        // Check required fields for transform manifests based on documentation
        const requiredFields = ['name', 'description', 'transformVersion', 'dataTypeId', 'transformState', 'icmTeam', 'contactDL', 'relatedTable', 'kqlFilePath', 'sampleInputRecordsFilePath', 'sampleOutputRecordsFilePath'];
        requiredFields.forEach(field => {
            if (!manifest[field]) {
                result.issues.push({
                    message: `Missing required field: ${field}`,
                    type: 'missing_field',
                    field: field,
                    location: 'root',
                    severity: 'error',
                    suggestion: `Add the required field "${field}" to the root level of your transform manifest file.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate transform manifest should NOT have these fields (they belong to NGSchema)
        const forbiddenFields = ['type', 'displayName', 'simplifiedSchemaVersion', 'tables', 'functions', 'queries'];
        forbiddenFields.forEach(field => {
            if (manifest[field]) {
                result.issues.push({
                    message: `Transform manifest should not contain field: ${field}`,
                    type: 'forbidden_field',
                    field: field,
                    location: 'root',
                    currentValue: manifest[field],
                    severity: 'error',
                    suggestion: `Remove the "${field}" field from the transform manifest. This field belongs to the main NGSchema manifest, not transform manifests.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate descriptions
        if (manifest.description) {
            validateDescription(manifest.description, 'Transform description', result, 'root.description');
        }
        
        // Validate transformVersion is a number >= 1
        if (manifest.transformVersion !== undefined) {
            if (typeof manifest.transformVersion !== 'number' || manifest.transformVersion < 1 || !Number.isInteger(manifest.transformVersion)) {
                result.issues.push({
                    message: 'transformVersion must be an integer >= 1',
                    type: 'invalid_value',
                    field: 'transformVersion',
                    location: 'root',
                    currentValue: manifest.transformVersion,
                    expectedValue: 'integer >= 1',
                    severity: 'error',
                    suggestion: 'Change the transformVersion to a positive integer starting from 1.'
                });
                result.status = 'fail';
            }
        }
        
        // Validate dataTypeId follows naming convention
        if (manifest.dataTypeId && typeof manifest.dataTypeId === 'string') {
            if (!manifest.dataTypeId.includes('_')) {
                result.warnings.push({
                    message: 'dataTypeId should follow SERVICEIDENTITYNAME_LOGCATEGORYNAME convention',
                    type: 'naming_convention_warning',
                    field: 'dataTypeId',
                    location: 'root.dataTypeId',
                    currentValue: manifest.dataTypeId,
                    severity: 'warning',
                    suggestion: 'Consider using the naming convention SERVICEIDENTITYNAME_LOGCATEGORYNAME for better consistency (e.g., "CISCO_SECURITY").'
                });
            }
        }
        
        // Validate transformState
        if (manifest.transformState !== undefined) {
            const validStates = ['Validation', 'Production'];
            if (!validStates.includes(manifest.transformState)) {
                result.issues.push({
                    message: 'transformState must be either "Validation" or "Production"',
                    type: 'invalid_value',
                    field: 'transformState',
                    location: 'root',
                    currentValue: manifest.transformState,
                    expectedValue: 'Validation or Production',
                    severity: 'error',
                    suggestion: 'Set transformState to either "Validation" for testing or "Production" for live deployment.'
                });
                result.status = 'fail';
            }
        }
        
        // Validate string fields
        const stringFields = ['name', 'icmTeam', 'contactDL', 'relatedTable', 'kqlFilePath', 'sampleInputRecordsFilePath', 'sampleOutputRecordsFilePath'];
        stringFields.forEach(field => {
            if (manifest[field] && typeof manifest[field] !== 'string') {
                result.issues.push({
                    message: `${field} must be a string`,
                    type: 'invalid_type',
                    field: field,
                    location: 'root',
                    currentValue: typeof manifest[field],
                    expectedValue: 'string',
                    severity: 'error',
                    suggestion: `Change the ${field} value to a string.`
                });
                result.status = 'fail';
            }
        });
        
        // Validate file paths have correct extensions
        if (manifest.kqlFilePath && !manifest.kqlFilePath.endsWith('.kql')) {
            result.issues.push({
                message: 'kqlFilePath must reference a .kql file',
                type: 'invalid_file_extension',
                field: 'kqlFilePath',
                location: 'root',
                currentValue: manifest.kqlFilePath,
                severity: 'error',
                suggestion: 'Change the kqlFilePath to reference a file with .kql extension.'
            });
            result.status = 'fail';
        }
        
        if (manifest.sampleInputRecordsFilePath && !manifest.sampleInputRecordsFilePath.endsWith('.json')) {
            result.issues.push({
                message: 'sampleInputRecordsFilePath must reference a .json file',
                type: 'invalid_file_extension',
                field: 'sampleInputRecordsFilePath',
                location: 'root',
                currentValue: manifest.sampleInputRecordsFilePath,
                severity: 'error',
                suggestion: 'Change the sampleInputRecordsFilePath to reference a file with .json extension.'
            });
            result.status = 'fail';
        }
        
        if (manifest.sampleOutputRecordsFilePath && !manifest.sampleOutputRecordsFilePath.endsWith('.json')) {
            result.issues.push({
                message: 'sampleOutputRecordsFilePath must reference a .json file',
                type: 'invalid_file_extension',
                field: 'sampleOutputRecordsFilePath',
                location: 'root',
                currentValue: manifest.sampleOutputRecordsFilePath,
                severity: 'error',
                suggestion: 'Change the sampleOutputRecordsFilePath to reference a file with .json extension.'
            });
            result.status = 'fail';
        }
        
        // Validate optional inputFilePath if present (for new dataTypeIds)
        if (manifest.inputFilePath !== undefined) {
            if (typeof manifest.inputFilePath !== 'string') {
                result.issues.push({
                    message: 'inputFilePath must be a string',
                    type: 'invalid_type',
                    field: 'inputFilePath',
                    location: 'root',
                    severity: 'error',
                    suggestion: 'Change the inputFilePath value to a string.'
                });
                result.status = 'fail';
            } else if (!manifest.inputFilePath.endsWith('.json')) {
                result.issues.push({
                    message: 'inputFilePath must reference a .json file',
                    type: 'invalid_file_extension',
                    field: 'inputFilePath',
                    location: 'root',
                    currentValue: manifest.inputFilePath,
                    severity: 'error',
                    suggestion: 'Change the inputFilePath to reference a file with .json extension.'
                });
                result.status = 'fail';
            }
        }
        
        // Add informational note about what this transform does
        if (manifest.relatedTable) {
            result.warnings.push({
                message: `This transform sends data to the "${manifest.relatedTable}" table`,
                type: 'info',
                field: 'relatedTable',
                location: 'root.relatedTable',
                currentValue: manifest.relatedTable,
                severity: 'info',
                suggestion: 'Ensure that the referenced table exists in the main NGSchema and that your transform KQL produces data compatible with that table structure.'
            });
        }
        
        if (result.issues.length === 0 && result.status !== 'fail') {
            result.status = 'pass';
        }
        
    } catch (error) {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid JSON format: ' + error.message,
            type: 'json_syntax_error',
            field: 'file',
            location: 'entire_file',
            severity: 'error',
            suggestion: 'Fix the JSON syntax errors in the file. Common issues include missing commas, unmatched brackets, or invalid characters.'
        });
    }
    
    return result;
}

// Helper function to find line number for missing function fields
function findFunctionLineNumber(func, index, missingField) {
    try {
        const content = window.currentFileContent;
        if (!content) return index + 1;
        
        const lines = content.split('\n');
        let inFunctionsArray = false;
        let functionIndex = -1;
        let braceCount = 0;
        let inCurrentFunction = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Find functions array
            if (line.includes('"functions"') && line.includes('[')) {
                inFunctionsArray = true;
                continue;
            }
            
            if (inFunctionsArray) {
                // Track function objects
                if (line.includes('{') && !line.includes('}')) {
                    if (braceCount === 0) {
                        functionIndex++;
                        if (functionIndex === index) {
                            inCurrentFunction = true;
                        }
                    }
                    braceCount++;
                } else if (line.includes('}') && !line.includes('{')) {
                    braceCount--;
                    if (braceCount === 0 && inCurrentFunction) {
                        // End of current function, return line before closing brace
                        return i;
                    }
                }
                
                // If we're in the current function and it's the closing brace
                if (inCurrentFunction && line.trim() === '}' && braceCount === 1) {
                    return i;
                }
            }
        }
        
        return index + 1;
    } catch (error) {
        console.error('Error finding function line number:', error);
        return index + 1;
    }
}

// Helper function to generate fix code for missing function fields
function generateFunctionFixCode(field, func) {
    const examples = {
        'name': func.name || '_ASim_ExampleFunction',
        'displayName': func.displayName || 'Example Function Display Name',
        'description': func.description || 'Example function description',
        'bodyFilePath': func.bodyFilePath || 'KQL/Example/ExampleFunction.kql'
    };
    
    return `"${field}": "${examples[field]}"`;
}

async function validateTransformManifestFile(file, result) {
    const content = await readFileContent(file);
    
    try {
        const manifest = JSON.parse(content);
        
        // Store original content for drill-down
        result.originalContent = content;
        result.parsedContent = manifest;
        
        // Add identifier that this is a transform manifest
        result.isTransformManifest = true;
        
        // Check required fields for transform manifests based on documentation
        const requiredFields = ['name', 'description', 'transformVersion', 'dataTypeId', 'transformState', 'icmTeam', 'contactDL', 'relatedTable', 'kqlFilePath', 'sampleInputRecordsFilePath', 'sampleOutputRecordsFilePath'];
        requiredFields.forEach(field => {
            if (!manifest[field]) {
                result.issues.push({
                    message: `Missing required field: ${field}`,
                    type: 'missing_field',
                    field: field,
                    location: 'root',
                    severity: 'error',
        } else {
            result.issues.push({
                message: `${inputContext}: Invalid input data type '${inputField.type}'`,
                type: 'invalid_value',
                field: 'type',
                location: `${inputLocation}.type`,
                currentValue: inputField.type,
                expectedValue: `One of: ${validInputTypes.join(', ')}`,
                severity: 'error',
                suggestion: `Change the input data type from "${inputField.type}" to one of the valid types.`
            });
        }
        result.status = 'fail';
    }
    
    // Add warning for Dynamic type usage in input fields
    if (inputField.type === 'Dynamic') {
        if (!result.warnings) result.warnings = [];
        result.warnings.push({
            message: `${inputContext}: Dynamic type usage detected`,
            type: 'performance_warning',
            field: 'type',
            location: `${inputLocation}.type`,
            currentValue: inputField.type,
            severity: 'warning',
            suggestion: `Consider using a specific data type instead of "Dynamic" for better performance and query authoring. Dynamic fields can impact query performance and make queries more complex. If possible, promote frequently used fields to top-level columns with specific types.`
        });
    }
}

function validateColumn(column, index, tableContext, result) {
    const columnContext = `${tableContext}, Column ${index + 1}`;
    const columnLocation = `${tableContext.replace(' ', '').toLowerCase()}.columns[${index}]`;
    
    // Check for column name - either standard 'name' OR transform pattern (transformName + physicalName + logicalName)
    const hasStandardName = column.name;
    const hasTransformPattern = column.transformName && column.physicalName && column.logicalName;
    
    if (!hasStandardName && !hasTransformPattern) {
        result.issues.push({
            message: `${columnContext}: Missing required field 'name' or transform pattern (transformName, physicalName, logicalName)`,
            type: 'missing_field',
            field: 'name',
            location: `${columnLocation}.name`,
            columnIndex: index,
            severity: 'error',
            suggestion: `Add either a 'name' field OR the complete transform pattern with 'transformName', 'physicalName', and 'logicalName' fields for column type changes.`,
            microsoftRequirement: 'Columns must have either a standard "name" field or use the transform pattern (transformName, physicalName, logicalName) when changing column types in Azure Log Analytics.'
        });
        result.status = 'fail';
    }
    
    // Validate other required fields
    const otherRequiredFields = ['type', 'description'];
    otherRequiredFields.forEach(field => {
        if (!column[field]) {
            result.issues.push({
                message: `${columnContext}: Missing required field '${field}'`,
                type: 'missing_field',
                field: field,
                location: `${columnLocation}.${field}`,
                severity: 'error',
                suggestion: `Add the required field "${field}" to the column definition.`
            });
            result.status = 'fail';
        }
    });
    
        // Add informational note for transform pattern usage (only if actually using transform pattern)
        if (hasTransformPattern && !hasStandardName && column.transformName && column.physicalName && column.logicalName) {
            if (!result.warnings) result.warnings = [];
            result.warnings.push({
                message: `${columnContext}: Using transform pattern for column type change`,
                type: 'info',
                field: 'transformName',
                location: `${columnLocation}.transformName`,
                columnIndex: index,
                severity: 'info',
                suggestion: `This column is using the Microsoft Azure transform pattern for changing column types. Ensure the table has "isChangeColumnInternalNameAllowed": true property.`,
                microsoftRequirement: 'When using transform pattern, users won\'t be able to query data ingested before this change and should be notified.',
                currentValue: `${column.transformName} -> ${column.physicalName}`
            });
        }
    
    // Validate description
    if (column.description) {
        validateDescription(column.description, `${columnContext} description`, result, `${columnLocation}.description`);
    }
    
    // Validate data type (column types for Log Analytics tables)
    const validTypes = ['String', 'Int', 'BigInt', 'SmallInt', 'TinyInt', 'Float', 'Double', 'Bool', 'DateTime', 'Guid', 'Binary', 'Dynamic'];
    if (column.type && !validTypes.includes(column.type)) {
        // Check if this is a lowercase version of a valid type
        const capitalizedType = column.type.charAt(0).toUpperCase() + column.type.slice(1);
        const isLowercaseValidType = validTypes.includes(capitalizedType);
        
        if (isLowercaseValidType) {
            // Special handling for datetime capitalization
            if (column.type.toLowerCase() === 'datetime') {
                result.issues.push({
                    message: `${columnContext}: Column data type 'datetime' should be 'DateTime' (capital D and T)`,
                    type: 'incorrect_capitalization',
                    field: 'type',
                    location: `${columnLocation}.type`,
                    currentValue: column.type,
                    expectedValue: 'DateTime',
                    severity: 'error',
                    suggestion: `Change "datetime" to "DateTime" - Azure Log Analytics requires the DateTime type to be capitalized properly.`,
                    microsoftRequirement: 'Azure Log Analytics DateTime type must be capitalized as "DateTime" (not "datetime", "dateTime", or "DATETIME").',
                    fixInstructions: `Change the type from "${column.type}" to "DateTime" with capital D and T`
                });
            } else {
                result.issues.push({
                    message: `${columnContext}: Column data type '${column.type}' should start with capital letter`,
                    type: 'incorrect_capitalization',
                    field: 'type',
                    location: `${columnLocation}.type`,
                    currentValue: column.type,
                    expectedValue: capitalizedType,
                    severity: 'error',
                    suggestion: `Change "${column.type}" to "${capitalizedType}" - Azure Log Analytics requires data types to start with a capital letter.`,
                    microsoftRequirement: 'Azure Log Analytics column data types must start with a capital letter (e.g., "String" not "string").',
                    fixInstructions: `Simply capitalize the first letter: "${column.type}" → "${capitalizedType}"`
                });
            }
        } else {
            result.issues.push({
                message: `${columnContext}: Invalid data type '${column.type}'`,
                type: 'invalid_value',
                field: 'type',
                location: `${columnLocation}.type`,
                currentValue: column.type,
                expectedValue: `One of: ${validTypes.join(', ')}`,
                severity: 'error',
                suggestion: `Change the column data type from "${column.type}" to one of the valid types.`
            });
        }
        result.status = 'fail';
    }
    
    // Add warning for Dynamic type usage in columns
    if (column.type === 'Dynamic') {
        if (!result.warnings) result.warnings = [];
        result.warnings.push({
            message: `${columnContext}: Dynamic type usage detected`,
            type: 'performance_warning',
            field: 'type',
            location: `${columnLocation}.type`,
            currentValue: column.type,
            severity: 'warning',
            suggestion: `Consider using a specific data type instead of "Dynamic" for better performance and query authoring. Dynamic fields can impact query performance and make queries more complex. If possible, promote frequently used fields to top-level columns with specific types.`
        });
    }
    
    // Validate boolean fields (optional)
    const booleanFields = ['isDefaultDisplay', 'isHidden', 'isPreferredFacet'];
    booleanFields.forEach(field => {
        if (column[field] !== undefined && typeof column[field] !== 'boolean') {
            result.issues.push(`${columnContext}: ${field} must be a boolean`);
            result.status = 'fail';
        }
    });
    
    // Validate dataTypeHint (optional)
    if (column.dataTypeHint !== undefined) {
        const validHints = ['IP', 'GUID', 'URI', 'ARMPath'];
        if (!validHints.includes(column.dataTypeHint)) {
            result.issues.push(`${columnContext}: dataTypeHint must be one of: ${validHints.join(', ')}`);
            result.status = 'fail';
        }
    }
}

function validateFunction(func, index, result) {
    const functionContext = `Function ${index + 1}`;
    
    // Required fields based on official documentation
    const requiredFields = ['name', 'displayName', 'description', 'bodyFilePath'];
    requiredFields.forEach(field => {
        if (!func[field]) {
            // Enhanced missing field validation with line numbers and fix codes
            const lineNumber = findFunctionLineNumber(func, index, field);
            const fixCode = generateFunctionFixCode(field, func);
            
            result.issues.push({
                type: 'error',
                category: 'missing_field',
                message: `${functionContext}: Missing required field '${field}'`,
                location: `functions[${index}]`,
                lineNumber: lineNumber,
                fieldName: field,
                fixCode: fixCode,
                context: functionContext
            });
            result.status = 'fail';
        }
    });
    
    // Validate description
    if (func.description) {
        validateDescription(func.description, `${functionContext} description`, result, `functions[${index}].description`);
    }
    
    // Validate parameters (optional string)
    if (func.parameters !== undefined && typeof func.parameters !== 'string') {
        result.issues.push(`${functionContext}: parameters must be a string (e.g., "Param1:string, Param2:datetime")`);
        result.status = 'fail';
    }
    
    // Validate categories (optional array)
    if (func.categories !== undefined) {
        if (!Array.isArray(func.categories)) {
            result.issues.push(`${functionContext}: categories must be an array`);
            result.status = 'fail';
        }
    }
}

function validateQuery(query, index, result) {
    const queryContext = `Query ${index + 1}`;
    const queryLocation = `queries[${index}]`;
    
    // Required fields based on official documentation
    const requiredFields = ['displayName', 'description', 'bodyFilePath'];
    requiredFields.forEach(field => {
        if (!query[field]) {
            result.issues.push({
                message: `${queryContext}: Missing required field '${field}'`,
                type: 'missing_field',
                field: field,
                location: `${queryLocation}.${field}`,
                severity: 'error',
                suggestion: `Add the required field "${field}" to ${queryContext}.`
            });
            result.status = 'fail';
        }
    });
    
    // Validate id (should be GUID)
    if (query.id !== undefined) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(query.id)) {
            result.issues.push({
                message: `${queryContext}: id should be a valid GUID`,
                type: 'invalid_format',
                field: 'id',
                location: `${queryLocation}.id`,
                currentValue: query.id,
                expectedValue: 'Valid GUID format',
                severity: 'error',
                suggestion: `Change the id to a valid GUID format (e.g., "12345678-1234-1234-1234-123456789012").`
            });
            result.status = 'fail';
        }
    }
    
    // Validate description
    if (query.description) {
        validateDescription(query.description, `${queryContext} description`, result, `${queryLocation}.description`);
    }
    
    // Validate categories (optional array)
    if (query.categories !== undefined) {
        if (!Array.isArray(query.categories)) {
            result.issues.push({
                message: `${queryContext}: categories must be an array`,
                type: 'invalid_type',
                field: 'categories',
                location: `${queryLocation}.categories`,
                currentValue: typeof query.categories,
                expectedValue: 'array',
                severity: 'error',
                suggestion: `Change the categories field to an array format.`
            });
            result.status = 'fail';
        }
    }
}

async function validateKQLFile(file, result) {
    const content = await readFileContent(file);
    
    // Enhanced error handling for undefined content
    if (content === undefined || content === null) {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid KQL file: Cannot read file content (content is undefined)',
            type: 'undefined_content_error',
            field: 'file_content',
            location: 'entire_file',
            severity: 'error',
            currentValue: 'undefined',
            expectedValue: 'valid KQL content',
            suggestion: 'Ensure the KQL file contains valid text content. The file may be corrupted or empty.',
            microsoftRequirement: 'KQL files must contain valid Kusto Query Language syntax for data transformation.',
            fixInstructions: 'Check that the file is not corrupted and contains valid KQL syntax. Re-upload the file if necessary.'
        });
        return result;
    }
    
    // Basic KQL syntax validation
    if (content.trim() === '') {
        result.issues.push({
            message: 'KQL file is empty',
            type: 'empty_file_error',
            field: 'file_content',
            location: 'entire_file',
            severity: 'error',
            currentValue: 'empty file',
            expectedValue: 'valid KQL content',
            suggestion: 'Add KQL syntax to the file. Include transformation logic, queries, or function definitions.',
            microsoftRequirement: 'KQL files must contain valid Kusto Query Language syntax for data transformation.',
            fixInstructions: 'Add proper KQL syntax such as: let, extend, project, where, summarize, join, or union statements.'
        });
        result.status = 'fail';
    }
    
    // Enhanced error handling for content.toLowerCase()
    try {
        // Check for common KQL keywords
        const kqlKeywords = ['let', 'datatable', 'extend', 'project', 'where', 'summarize', 'join', 'union'];
        const hasKQLKeywords = kqlKeywords.some(keyword => {
            if (typeof content !== 'string') {
                // Silent error handling - content is not a string
                return false;
            }
            return content.toLowerCase().includes(keyword);
        });
        
        if (!hasKQLKeywords) {
            result.warnings.push({
                message: 'File does not appear to contain standard KQL syntax',
                type: 'missing_kql_syntax_warning',
                field: 'file_content',
                location: 'entire_file',
                severity: 'warning',
                suggestion: 'Verify that the file contains valid KQL syntax. Common KQL keywords include: let, extend, project, where, summarize, join, union.',
                microsoftRequirement: 'KQL files should contain valid Kusto Query Language syntax for Azure Log Analytics data transformation.'
            });
        }
    } catch (error) {
        result.status = 'fail';
        result.issues.push({
            message: `Invalid KQL file: Error processing content - ${error.message}`,
            type: 'content_processing_error',
            field: 'file_content',
            location: 'entire_file',
            severity: 'error',
            currentValue: typeof content,
            expectedValue: 'string',
            suggestion: 'Ensure the KQL file contains valid text content. The file may be corrupted or contain invalid characters.',
            microsoftRequirement: 'KQL files must contain valid Kusto Query Language syntax as plain text.',
            fixInstructions: 'Check the file encoding and ensure it contains valid text. Re-create the file if necessary with proper KQL syntax.',
            errorDetails: `JavaScript error: ${error.message}`
        });
    }
    
    return result;
}

async function validateJSONFile(file, result) {
    const content = await readFileContent(file);
    
    // Store original content for drill-down
    result.originalContent = content;
    
    // Enhanced error handling for undefined file name
    if (!file || !file.name || typeof file.name !== 'string') {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid JSON file: File name is undefined or invalid',
            type: 'undefined_filename_error',
            field: 'file_name',
            location: 'file_metadata',
            severity: 'error',
            currentValue: file ? (file.name ? typeof file.name : 'undefined') : 'null',
            expectedValue: 'valid filename string',
            suggestion: 'Ensure the file has a valid name. The file object may be corrupted.',
            microsoftRequirement: 'All files must have valid names for Azure Log Analytics validation.',
            fixInstructions: 'Re-upload the file or check that the file is not corrupted.'
        });
        return result;
    }
    
    try {
        const json = JSON.parse(content);
        result.parsedContent = json;
        
        // Enhanced error handling for file.name.toLowerCase()
        let fileName;
        try {
            fileName = file.name.toLowerCase();
        } catch (error) {
            result.status = 'fail';
            result.issues.push({
                message: `Invalid JSON file: Error processing filename - ${error.message}`,
                type: 'filename_processing_error',
                field: 'file_name',
                location: 'file_metadata',
                severity: 'error',
                currentValue: file.name,
                expectedValue: 'valid filename string',
                suggestion: 'Ensure the file has a valid name that can be processed. The filename may contain invalid characters.',
                microsoftRequirement: 'File names must be valid strings for Azure Log Analytics processing.',
                fixInstructions: 'Rename the file with a valid filename and re-upload.',
                errorDetails: `JavaScript error: ${error.message}`
            });
            return result;
        }
        
        // Determine file type based on filename patterns
        const isSampleFile = fileName.includes('sample') || fileName.includes('input') || fileName.includes('output');
        const isInputSample = fileName.includes('input') || fileName.includes('sampleinput');
        const isOutputSample = fileName.includes('output') || fileName.includes('sampleoutput');
        
        // Check if it's an array (required for sample data)
        if (!Array.isArray(json)) {
            const fileTypeContext = isSampleFile ? 
                (isInputSample ? 'sample input records file' : 
                 isOutputSample ? 'sample output records file' : 'sample data file') : 
                'JSON data file';
            
            result.issues.push({
                message: `JSON file must contain an array of sample records`,
                type: 'invalid_json_structure',
                field: 'file_content',
                location: 'entire_file',
                currentValue: Array.isArray(json) ? 'array' : (typeof json === 'object' ? 'object' : typeof json),
                expectedValue: 'array',
                severity: 'error',
                fileType: fileTypeContext,
                suggestion: `According to Microsoft Azure Log Analytics documentation, ${fileTypeContext} must contain a JSON array of log records. Wrap your JSON object in square brackets to create an array, or add multiple sample records for better validation coverage.`,
                microsoftRequirement: 'Your sample file should contain JSON list of message objects. If the file contains a single log entry, it should be framed as a list with a single item.',
                fixInstructions: isSampleFile ? 
                    'Convert your JSON object to an array by wrapping it in square brackets []. This ensures proper validation and compatibility with Azure Log Analytics ingestion pipeline.' :
                    'Ensure your JSON file contains an array structure for proper data processing.',
                examples: {
                    incorrect: typeof json === 'object' ? JSON.stringify(json, null, 2) : String(json),
                    correct: typeof json === 'object' ? JSON.stringify([json], null, 2) : `[${String(json)}]`
                }
            });
            result.status = 'fail';
        } else if (json.length === 0) {
            result.warnings.push({
                message: 'JSON array is empty - no sample records provided',
                type: 'empty_sample_data',
                field: 'file_content',
                location: 'entire_file',
                currentValue: '0 records',
                severity: 'warning',
                fileType: isSampleFile ? 'sample data file' : 'JSON data file',
                suggestion: 'Add at least one sample record to the array. Multiple entries are recommended if your log entries vary by data they provide, to cover possible variations.',
                microsoftRequirement: 'At least one log message is required per file, but multiple entries could be present.'
            });
        } else {
            // Additional validation for sample files
            if (isSampleFile) {
                // Check if records look like proper log entries
                const hasValidRecords = json.every(record => 
                    typeof record === 'object' && record !== null && !Array.isArray(record)
                );
                
                if (!hasValidRecords) {
                    result.warnings.push({
                        message: 'Some array elements are not valid log record objects',
                        type: 'invalid_record_structure',
                        field: 'array_elements',
                        location: 'array_content',
                        severity: 'warning',
                        fileType: fileTypeContext,
                        suggestion: 'Each element in the array should be a JSON object representing a log record. Ensure all elements are properly formatted log entries.',
                        microsoftRequirement: 'Each array element should represent a complete log entry payload.'
                    });
                }
                
                // Check for TimeGenerated field in output samples (recommended)
                if (isOutputSample) {
                    const hasTimeGenerated = json.some(record => 
                        record && typeof record === 'object' && 'TimeGenerated' in record
                    );
                    
                    if (!hasTimeGenerated) {
                        result.warnings.push({
                            message: 'Output sample records should include TimeGenerated field',
                            type: 'missing_timegenerated',
                            field: 'TimeGenerated',
                            location: 'sample_records',
                            severity: 'warning',
                            fileType: 'sample output records file',
                            suggestion: 'Output sample records should include the TimeGenerated field as it is required for all Log Analytics tables. This helps validate the complete transformation output.',
                            microsoftRequirement: 'TimeGenerated column is required for all Log Analytics tables and must map to the $.time JSON path in Shoebox.'
                        });
                    }
                }
            }
        }
        
    } catch (error) {
        result.status = 'fail';
        result.issues.push({
            message: 'Invalid JSON format: ' + error.message,
            type: 'json_syntax_error',
            field: 'file',
            location: 'entire_file',
            severity: 'error',
            suggestion: 'Fix the JSON syntax errors in the file. Common issues include missing commas, unmatched brackets, or invalid characters. Use a JSON validator to identify and fix syntax problems.',
            fixInstructions: 'Check for missing commas, unmatched brackets, invalid escape sequences, or trailing commas which are not allowed in JSON.'
        });
    }
    
    return result;
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// UI Update functions
function showValidationProgress() {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    const resultsDiv = document.getElementById('validationResults');
    resultsDiv.innerHTML = `
        <div class="text-center">
            <div class="loading-spinner"></div>
            <h4 class="mt-3">Validating Files...</h4>
            <div class="validation-progress mb-3">
                <div class="progress-bar bg-primary" style="width: 0%"></div>
            </div>
            <div class="current-file-info">
                <div class="badge bg-secondary mb-2">
                    <span id="current-file-counter">0</span> of <span id="total-files">${uploadedFiles.length}</span> files
                </div>
                <div class="current-file-name text-muted">
                    <i class="fas fa-file me-2"></i>
                    <span id="current-file-display">Preparing validation...</span>
                </div>
            </div>
        </div>
    `;
}

function updateProgress(percentage) {
    const progressBar = document.querySelector('.validation-progress .progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
}

function updateCurrentFile(fileIndex, file) {
    // Update file counter
    const counterElement = document.getElementById('current-file-counter');
    if (counterElement) {
        counterElement.textContent = fileIndex + 1;
    }
    
    // Update current file name
    const fileDisplayElement = document.getElementById('current-file-display');
    if (fileDisplayElement && file) {
        const displayName = file.webkitRelativePath || file.relativePath || file.name;
        const truncatedName = displayName.length > 50 ? '...' + displayName.slice(-47) : displayName;
        fileDisplayElement.innerHTML = `Scanning: <strong>${truncatedName}</strong>`;
    }
}

function hideValidationProgress() {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'none';
}

function displayValidationResults(results) {
    const resultsDiv = document.getElementById('validationResults');
    
    // Store results globally for drill-down functionality
    validationResults = results;
    
    // Calculate summary stats
    const totalFiles = results.length;
    const passedFiles = results.filter(r => r.status === 'pass').length;
    const failedFiles = results.filter(r => r.status === 'fail').length;
    const warningFiles = results.filter(r => r.warnings && r.warnings.length > 0).length;
    
    // Calculate total issues
    const totalIssues = results.reduce((sum, r) => sum + (r.issues ? r.issues.length : 0), 0);
    const totalWarnings = results.reduce((sum, r) => sum + (r.warnings ? r.warnings.length : 0), 0);
    
    const overallStatus = failedFiles > 0 ? 'fail' : 'pass';
    
    // Group issues and warnings by type
    const groupedIssues = groupValidationIssuesByType(results);
    const groupedWarnings = groupValidationWarningsByType(results);
    
    let html = `
        <div class="validation-results-container">
            <!-- Overall Status Card -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card ${overallStatus === 'pass' ? 'border-success bg-light' : 'border-danger bg-light'}">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <i class="fas ${overallStatus === 'pass' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'} fa-4x"></i>
                                </div>
                                <div class="col-md-4">
                                    <h3 class="mb-1 ${overallStatus === 'pass' ? 'text-success' : 'text-danger'}">
                                        ${overallStatus === 'pass' ? 'VALIDATION PASSED' : 'VALIDATION FAILED'}
                                    </h3>
                                    <p class="text-muted mb-0">
                                        ${overallStatus === 'pass' ? 'All files passed validation successfully!' : 'Some files have validation issues that need attention.'}
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row text-center">
                                        <div class="col-3">
                                            <div class="summary-stat-box">
                                                <div class="stat-number text-primary">${totalFiles}</div>
                                                <div class="stat-label">Total Files</div>
                                            </div>
                                        </div>
                                        <div class="col-3">
                                            <div class="summary-stat-box">
                                                <div class="stat-number text-success">${passedFiles}</div>
                                                <div class="stat-label">Passed</div>
                                            </div>
                                        </div>
                                        <div class="col-3">
                                            <div class="summary-stat-box">
                                                <div class="stat-number text-danger">${failedFiles}</div>
                                                <div class="stat-label">Failed</div>
                                            </div>
                                        </div>
                                        <div class="col-3">
                                            <div class="summary-stat-box">
                                                <div class="stat-number text-warning">${warningFiles}</div>
                                                <div class="stat-label">Warnings</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Issues and Warnings Grouped by Type -->
            ${(totalIssues > 0 || totalWarnings > 0) ? `
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-exclamation-triangle me-2"></i>Issues & Warnings by Category
                                    <span class="badge bg-danger ms-2">${totalIssues} errors</span>
                                    <span class="badge bg-warning ms-2">${totalWarnings} warnings</span>
                                </h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="accordion" id="issuesWarningsAccordion">
                                    ${createGroupedIssuesHTML(groupedIssues, 'issues')}
                                    ${createGroupedWarningsHTML(groupedWarnings, 'warnings')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- Detailed Results by File -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                <i class="fas fa-list-alt me-2"></i>Detailed Validation Results by File
                                <span class="badge bg-secondary ms-2">${totalFiles} files analyzed</span>
                            </h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="accordion" id="resultsAccordion">
    `;
    
    results.forEach((result, index) => {
        html += createResultAccordionItem(result, index);
    });
    
    html += `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

function groupValidationIssuesByType(results) {
    const grouped = {};
    
    results.forEach((result, resultIndex) => {
        if (result.issues && result.issues.length > 0) {
            result.issues.forEach((issue, issueIndex) => {
                const issueType = typeof issue === 'object' ? (issue.type || 'unknown') : 'general';
                const issueCategory = getIssueCategoryName(issueType);
                
                if (!grouped[issueCategory]) {
                    grouped[issueCategory] = {
                        type: issueCategory,
                        count: 0,
                        items: [],
                        icon: getIssueCategoryIcon(issueType),
                        description: getIssueCategoryDescription(issueType)
                    };
                }
                
                grouped[issueCategory].count++;
                grouped[issueCategory].items.push({
                    issue: issue,
                    fileName: result.filename,
                    resultIndex: resultIndex,
                    issueIndex: issueIndex
                });
            });
        }
    });
    
    return grouped;
}

function groupValidationWarningsByType(results) {
    const grouped = {};
    
    results.forEach((result, resultIndex) => {
        if (result.warnings && result.warnings.length > 0) {
            result.warnings.forEach((warning, warningIndex) => {
                const warningType = typeof warning === 'object' ? (warning.type || 'unknown') : 'general';
                const warningCategory = getWarningCategoryName(warningType);
                
                if (!grouped[warningCategory]) {
                    grouped[warningCategory] = {
                        type: warningCategory,
                        count: 0,
                        items: [],
                        icon: getWarningCategoryIcon(warningType),
                        description: getWarningCategoryDescription(warningType)
                    };
                }
                
                grouped[warningCategory].count++;
                grouped[warningCategory].items.push({
                    warning: warning,
                    fileName: result.filename,
                    resultIndex: resultIndex,
                    warningIndex: warningIndex
                });
            });
        }
    });
    
    return grouped;
}

function createResultAccordionItem(result, index) {
    const statusClass = result.status === 'pass' ? 'success' : 'danger';
    const statusIcon = result.status === 'pass' ? 'fa-check-circle' : 'fa-times-circle';
    
    // Only show badges for failed items or items with warnings
    const shouldShowBadge = result.status === 'fail' || (result.warnings && result.warnings.length > 0);
    const badgeText = result.status === 'fail' ? 'FAIL' : (result.warnings && result.warnings.length > 0 ? 'WARN' : '');
    const badgeClass = result.status === 'fail' ? 'danger' : 'warning';
    
    // Special handling for folder analysis
    if (result.folderAnalysis) {
        return `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                        <i class="fas ${statusIcon} text-${statusClass} me-3"></i>
                        <strong>${result.filename}</strong>
                        ${shouldShowBadge ? `<span class="badge bg-${badgeClass} status-badge ms-auto me-3">${badgeText}</span>` : ''}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#resultsAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Folder Structure Analysis</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Type:</strong> Folder Structure</li>
                                    <li><strong>Files Analyzed:</strong> ${uploadedFiles.length}</li>
                                    ${result.status === 'fail' ? `<li><strong>Status:</strong> <span class="badge bg-${statusClass} validation-status">FAILED</span></li>` : ''}
                                </ul>
                            </div>
                            <div class="col-md-6">
                                ${result.issues.length > 0 ? `
                                    <h6 class="text-danger">Structure Issues (${result.issues.length})</h6>
                                    <div class="validation-issues">
                                        ${result.issues.map((issue, issueIndex) => createIssueCard(issue, index, issueIndex, result)).join('')}
                                    </div>
                                ` : ''}
                                ${result.warnings.length > 0 ? `
                                    <h6 class="text-warning">Structure Warnings (${result.warnings.length})</h6>
                                    <div class="validation-warnings">
                                        ${result.warnings.map((warning, warningIndex) => createWarningCard(warning, index, warningIndex, result)).join('')}
                                    </div>
                                ` : ''}
                                ${result.issues.length === 0 && result.warnings.length === 0 ? `
                                    <div class="text-success">
                                        <i class="fas fa-check-circle me-2"></i>Folder structure is valid
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Regular file result
    const displayName = result.displayName || result.filename;
    const relativePath = result.relativePath;
    
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    <i class="fas ${statusIcon} text-${statusClass} me-3"></i>
                    <strong>${displayName}</strong>
                    ${relativePath ? `<small class="text-muted ms-2">${relativePath}</small>` : ''}
                    ${shouldShowBadge ? `<span class="badge bg-${badgeClass} status-badge ms-auto me-3">${badgeText}</span>` : ''}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#resultsAccordion">
                <div class="accordion-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>File Details</h6>
                            <ul class="list-unstyled">
                                <li><strong>Name:</strong> ${result.filename}</li>
                                ${relativePath ? `<li><strong>Path:</strong> <code>${relativePath}</code></li>` : ''}
                                <li><strong>Type:</strong> ${result.type}</li>
                                <li><strong>Size:</strong> ${formatFileSize(result.fileSize)}</li>
                                ${result.status === 'fail' ? `<li><strong>Status:</strong> <span class="badge bg-${statusClass} validation-status">FAILED</span></li>` : ''}
                            </ul>
                        </div>
                        <div class="col-md-6">
                            ${result.issues.length > 0 ? `
                                <h6 class="text-danger">Issues Found (${result.issues.length})</h6>
                                <div class="validation-issues">
                                    ${result.issues.map((issue, issueIndex) => createIssueCard(issue, index, issueIndex, result)).join('')}
                                </div>
                            ` : ''}
                            ${result.warnings.length > 0 ? `
                                <h6 class="text-warning">Warnings (${result.warnings.length})</h6>
                                <div class="validation-warnings">
                                    ${result.warnings.map((warning, warningIndex) => createWarningCard(warning, index, warningIndex, result)).join('')}
                                </div>
                            ` : ''}
                            ${result.issues.length === 0 && result.warnings.length === 0 ? `
                                <div class="text-success">
                                    <i class="fas fa-check-circle me-2"></i>No issues found
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createIssueCard(issue, resultIndex, issueIndex, result) {
    const issueId = `issue-${resultIndex}-${issueIndex}`;
    const detailsId = `details-${resultIndex}-${issueIndex}`;
    
    // Handle both old string format and new object format
    const issueMessage = typeof issue === 'string' ? issue : issue.message;
    const issueType = typeof issue === 'object' ? issue.type : 'unknown';
    const issueLocation = typeof issue === 'object' ? issue.location : 'unknown';
    const issueSuggestion = typeof issue === 'object' ? issue.suggestion : '';
    
    // Generate the fixed value based on the issue
    const fixedValue = generateFixedValue(issue);
    
    return `
        <div class="card mb-2 border-danger">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-times-circle text-danger me-2"></i>
                            <span class="fw-bold">${issueMessage}</span>
                        </div>
                        ${typeof issue === 'object' ? `
                            <div class="small text-muted mb-2">
                                <i class="fas fa-map-marker-alt me-1"></i>
                                Location: <code>${issueLocation}</code>
                            </div>
                        ` : ''}
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="toggleIssueDetails('${detailsId}', this)">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
                
                <div id="${detailsId}" class="issue-details mt-3" style="display: none;">
                    <div class="border-top pt-3">
                        ${typeof issue === 'object' && issueSuggestion ? `
                            <div class="alert alert-info py-2 mb-3">
                                <i class="fas fa-lightbulb me-2"></i>
                                <strong>Suggestion:</strong> ${issueSuggestion}
                            </div>
                        ` : ''}
                        
                        ${typeof issue === 'object' && issue.microsoftRequirement ? `
                            <div class="microsoft-requirement mb-3">
                                <h6><i class="fas fa-microsoft me-1"></i>Microsoft Azure Requirement:</h6>
                                <blockquote class="blockquote-sm">
                                    ${issue.microsoftRequirement}
                                </blockquote>
                            </div>
                        ` : ''}
                        
                        ${typeof issue === 'object' && issue.fixInstructions ? `
                            <div class="fix-instructions mb-3">
                                <h6><i class="fas fa-tools me-1"></i>Fix Instructions:</h6>
                                <div class="alert alert-success py-2">
                                    <strong>${issue.fixInstructions}</strong>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${typeof issue === 'object' && issue.examples ? `
                            <div class="json-structure-comparison mb-3">
                                <h6><i class="fas fa-code me-1"></i>JSON Structure Comparison:</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="incorrect-structure">
                                            <h6><i class="fas fa-times me-1"></i>Incorrect Structure</h6>
                                            <pre><code>${escapeHtml(issue.examples.incorrect)}</code></pre>
                                            <div class="explanation">
                                                This is a JSON object, but Azure Log Analytics requires an array of records.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="correct-structure">
                                            <h6><i class="fas fa-check me-1"></i>Correct Structure</h6>
                                            <pre><code>${escapeHtml(issue.examples.correct)}</code></pre>
                                            <div class="explanation">
                                                This is a JSON array containing the same data, which is the required format.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${typeof issue === 'object' && issue.currentValue ? `
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <h6 class="text-danger"><i class="fas fa-times me-1"></i>Current Value:</h6>
                                    <div class="p-2 bg-light border border-danger rounded">
                                        <code class="text-danger">${escapeHtml(issue.currentValue)}</code>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-success"><i class="fas fa-check me-1"></i>Fixed Value:</h6>
                                    <div class="p-2 bg-light border border-success rounded">
                                        <code class="text-success">${escapeHtml(fixedValue || 'See suggestion above')}</code>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${typeof issue === 'object' && issue.expectedValue && !issue.currentValue ? `
                            <div class="mb-3">
                                <h6 class="text-success"><i class="fas fa-check me-1"></i>Expected Value:</h6>
                                <div class="p-2 bg-light border border-success rounded">
                                    <code class="text-success">${escapeHtml(issue.expectedValue)}</code>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${result.originalContent ? `
                            <div class="mb-3">
                                <h6>File Content Preview:</h6>
                                <button class="btn btn-sm btn-secondary" onclick="showFileContent('${resultIndex}', '${issueLocation}')">
                                    <i class="fas fa-file-code me-1"></i> View File Content & Fix
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createWarningCard(warning, resultIndex, warningIndex, result) {
    const warningId = `warning-${resultIndex}-${warningIndex}`;
    const detailsId = `warning-details-${resultIndex}-${warningIndex}`;
    const warningMessage = typeof warning === 'string' ? warning : warning.message;
    const warningType = typeof warning === 'object' ? warning.type : 'unknown';
    const warningLocation = typeof warning === 'object' ? warning.location : 'unknown';
    const warningSuggestion = typeof warning === 'object' ? warning.suggestion : '';
    
    // Check if this is a detailed warning (object with suggestion)
    const hasDetails = typeof warning === 'object' && (warning.suggestion || warning.currentValue || warning.location);
    
    return `
        <div class="card mb-2 border-warning">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            <span class="fw-bold">${warningMessage}</span>
                        </div>
                        ${hasDetails && warningLocation !== 'unknown' ? `
                            <div class="small text-muted mb-2">
                                <i class="fas fa-map-marker-alt me-1"></i>
                                Location: <code>${warningLocation}</code>
                            </div>
                        ` : ''}
                    </div>
                    ${hasDetails ? `
                        <button class="btn btn-sm btn-outline-warning" onclick="toggleWarningDetails('${detailsId}', this)">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    ` : ''}
                </div>
                
                ${hasDetails ? `
                    <div id="${detailsId}" class="warning-details mt-3" style="display: none;">
                        <div class="border-top pt-3">
                            ${warningSuggestion ? `
                                <div class="alert alert-warning py-2 mb-3">
                                    <i class="fas fa-lightbulb me-2"></i>
                                    <strong>Best Practice:</strong> ${warningSuggestion}
                                </div>
                            ` : ''}
                            
                            ${typeof warning === 'object' && warning.microsoftRequirement ? `
                                <div class="microsoft-requirement mb-3">
                                    <h6><i class="fas fa-microsoft me-1"></i>Microsoft Azure Requirement:</h6>
                                    <blockquote class="blockquote-sm">
                                        ${warning.microsoftRequirement}
                                    </blockquote>
                                </div>
                            ` : ''}
                            
                            ${typeof warning === 'object' && warning.currentValue ? `
                                <div class="mb-3">
                                    <h6 class="text-warning"><i class="fas fa-info-circle me-1"></i>Current Value:</h6>
                                    <div class="p-2 bg-light border border-warning rounded">
                                        <code class="text-warning">${escapeHtml(warning.currentValue)}</code>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${warningType === 'performance_warning' ? `
                                <div class="alert alert-info py-2 mb-3">
                                    <i class="fas fa-performance me-2"></i>
                                    <strong>Performance Impact:</strong> Dynamic fields can slow down query performance and make queries more complex. Consider using specific data types for better performance.
                                </div>
                                
                                <div class="mb-3">
                                    <h6 class="text-success"><i class="fas fa-lightbulb me-1"></i>Recommended Types:</h6>
                                    <div class="p-3 bg-light border border-success rounded">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <strong>Common alternatives:</strong>
                                                <ul class="mb-2">
                                                    <li><code>String</code> - For text data</li>
                                                    <li><code>DateTime</code> - For timestamps</li>
                                                    <li><code>Int</code> - For integers</li>
                                                    <li><code>Double</code> - For decimal numbers</li>
                                                </ul>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Specialized types:</strong>
                                                <ul class="mb-2">
                                                    <li><code>Bool</code> - For true/false values</li>
                                                    <li><code>BigInt</code> - For large integers</li>
                                                    <li><code>Binary</code> - For binary data</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="alert alert-success py-2 mb-0">
                                            <i class="fas fa-tip me-2"></i>
                                            <strong>Pro Tip:</strong> Use Dynamic only when the field structure is truly unknown or varies significantly between records.
                                        </div>
                                    </div>
                                </div>
                                
                                ${result.originalContent ? `
                                    <div class="mb-3">
                                        <h6>File Content Preview:</h6>
                                        <button class="btn btn-sm btn-secondary" onclick="showFileContent('${resultIndex}', '${warningLocation}')">
                                            <i class="fas fa-file-code me-1"></i> View File Content & Fix
                                        </button>
                                    </div>
                                ` : ''}
                            ` : ''}
                            
                            ${result.originalContent ? `
                                <div class="mb-3">
                                    <h6>File Content Preview:</h6>
                                    <button class="btn btn-sm btn-secondary" onclick="showFileContent('${resultIndex}', '${warningLocation}')">
                                        <i class="fas fa-file-code me-1"></i> View File Content & Fix
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function toggleIssueDetails(detailsId, button) {
    const detailsElement = document.getElementById(detailsId);
    const icon = button.querySelector('i');
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Details';
    } else {
        detailsElement.style.display = 'none';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.innerHTML = '<i class="fas fa-eye"></i> View Details';
    }
}

function toggleWarningDetails(detailsId, button) {
    const detailsElement = document.getElementById(detailsId);
    const icon = button.querySelector('i');
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Details';
    } else {
        detailsElement.style.display = 'none';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.innerHTML = '<i class="fas fa-eye"></i> View Details';
    }
}

function showFileContent(resultIndex, location) {
    console.log('showFileContent called with:', { resultIndex, location });
    
    // Enhanced error handling and logging
    try {
        const results = validationResults; // Assuming this is stored globally
        
        if (!results) {
            console.error('validationResults is not available');
            showAlert('Validation results not available. Please run validation first.', 'warning');
            return;
        }
        
        const result = results[resultIndex];
        
        if (!result) {
            console.error('Result not found at index:', resultIndex);
            showAlert('File result not found. Please try again.', 'warning');
            return;
        }
        
        if (!result.originalContent) {
            console.error('No original content available for result:', result);
            showAlert('File content not available for viewing.', 'warning');
            return;
        }
        
        // Find the specific issue or warning for this location
        const issue = result.issues ? result.issues.find(issue => issue.location === location) : null;
        const warning = result.warnings ? result.warnings.find(warning => warning.location === location) : null;
        const problemItem = issue || warning;
        
        if (!problemItem) {
            console.warn('Problem item not found for location:', location);
            // Still show content even if specific problem item isn't found
        }
        
        console.log('Creating modal for file content...');
        
        // Create a modal to show the file content
        const modalId = 'fileContentModal';
        let modal = document.getElementById(modalId);
        
        // Remove existing modal if it exists to avoid conflicts
        if (modal) {
            modal.remove();
        }
        
        // Create new modal
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.style.zIndex = '9999'; // Ensure it appears on top
        
        const closeButtonHandler = `closeFileContentModal('${modalId}')`;
        
        // Store cleanup function globally for the close button
        window.closeFileContentModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            // Remove the modal using Bootstrap's method if available
            const bootstrapModal = bootstrap?.Modal?.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
            
            // Remove modal and cleanup
            modal.remove();
            
            // Ensure backdrop is removed
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
        
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-file-code me-2"></i>File Content - ${escapeHtml(result.filename)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" onclick="${closeButtonHandler}" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    ${issue ? 'Issue' : 'Warning'} location: <code>${escapeHtml(location)}</code>
                                </small>
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-secondary" onclick="copyFileContentToClipboard('${resultIndex}')">
                                        <i class="fas fa-copy me-1"></i>Copy Content
                                    </button>
                                    <button type="button" class="btn btn-outline-info" onclick="downloadFileContent('${resultIndex}', '${escapeHtml(result.filename)}')">
                                        <i class="fas fa-download me-1"></i>Download
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="fileContentContainer" class="border rounded" style="max-height: 600px; overflow-y: auto;">
                            <!-- Content will be inserted here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="${closeButtonHandler}">
                            <i class="fas fa-times me-1"></i>Close
                        </button>
                        ${problemItem && problemItem.suggestion ? `
                            <button type="button" class="btn btn-success" onclick="showFixSuggestion('${resultIndex}', '${escapeHtml(location)}')">
                                <i class="fas fa-lightbulb me-1"></i>View Fix Suggestion
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('Modal created and added to DOM');
        
        // Update the modal content
        const container = document.getElementById('fileContentContainer');
        if (container) {
            try {
                container.innerHTML = highlightFileContent(result.originalContent, location, problemItem);
                console.log('File content highlighted and inserted');
            } catch (error) {
                console.error('Error highlighting file content:', error);
                container.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Unable to highlight content. Showing raw content.
                    </div>
                    <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;"><code>${escapeHtml(result.originalContent)}</code></pre>
                `;
            }
        }
        
        // Show the modal with multiple fallback methods
        console.log('Attempting to show modal...');
        
        // Method 1: Try Bootstrap Modal
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            try {
                console.log('Using Bootstrap modal');
                const bootstrapModal = new bootstrap.Modal(modal, {
                    backdrop: true,
                    keyboard: true,
                    focus: true
                });
                bootstrapModal.show();
                
                // Scroll to problematic line after modal is fully shown
                modal.addEventListener('shown.bs.modal', function() {
                    console.log('Modal shown, scrolling to problematic line');
                    setTimeout(() => scrollToProblematicLine(location, problemItem), 100);
                }, { once: true });
                
                console.log('Bootstrap modal shown successfully');
                return;
            } catch (error) {
                console.error('Bootstrap modal failed:', error);
                // Fall through to fallback method
            }
        }
        
        // Method 2: Fallback - Manual modal display
        console.log('Using fallback modal display');
        modal.style.display = 'block';
        modal.classList.add('show');
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        // Add backdrop click to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Add escape key to close
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeFileContentModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        // Proper modal cleanup function
        const closeModal = function() {
            closeFileContentModal(modalId);
            document.removeEventListener('keydown', escapeHandler);
        };
        
        document.addEventListener('keydown', escapeHandler);
        
        // Scroll to problematic line after a short delay
        setTimeout(() => {
            console.log('Scrolling to problematic line (fallback)');
            scrollToProblematicLine(location, problemItem);
        }, 300);
        
        console.log('Fallback modal displayed successfully');
        
    } catch (error) {
        console.error('Critical error in showFileContent:', error);
        showAlert('An error occurred while trying to display file content: ' + error.message, 'danger');
    }
}

function highlightFileContent(content, location, problemItem) {
    try {
        // Parse the JSON to understand the structure
        const parsed = JSON.parse(content);
        const lines = content.split('\n');
        
        // Determine if this is an issue or warning
        const isWarning = problemItem && problemItem.severity === 'warning';
        const problemType = isWarning ? 'warning' : 'error';
        const problemClass = isWarning ? 'warning' : 'danger';
        
        // Find the line that contains the problematic field
        const problemLine = findProblemLine(lines, location, problemItem);
        
        // Debug output to help troubleshoot
        console.log('Highlighting file content:', {
            location,
            problemItem,
            problemLine,
            hasCurrentValue: problemItem && problemItem.currentValue
        });
        
        let highlightedContent = '';
        
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const isProblematicLine = problemLine && problemLine.lineNumber === lineNumber;
            
            if (isProblematicLine) {
                // Special handling for missing fields
                if (problemLine.isMissingField) {
                    // Show the line where the field should be inserted
                    if (problemLine.insertAfter) {
                        highlightedContent += `<div class="code-line" data-line="${lineNumber - 1}">`;
                        highlightedContent += `<span class="line-number">${lineNumber - 1}</span>`;
                        highlightedContent += `<span class="line-content">${escapeHtml(problemLine.insertAfter)}</span>`;
                        highlightedContent += '</div>';
                    }
                    
                    // Show the missing field insertion point
                    highlightedContent += `<div class="code-line missing-field-line error-line" id="problematic-line-${lineNumber}" data-line="${lineNumber}">`;
                    highlightedContent += `<span class="line-number missing-number">+</span>`;
                    highlightedContent += `<span class="line-content missing-content">`;
                    highlightedContent += `<span class="missing-field-placeholder">  ${escapeHtml(problemLine.fixCode)},</span>`;
                    highlightedContent += `</span>`;
                    highlightedContent += `<span class="problem-indicator error-indicator">`;
                    highlightedContent += `<i class="fas fa-plus-circle"></i> `;
                    highlightedContent += `<span class="problem-text">ADD MISSING FIELD</span>`;
                    highlightedContent += `</span>`;
                    highlightedContent += '</div>';
                    
                    // Add explanation
                    highlightedContent += `<div class="code-line fix-line">`;
                    highlightedContent += `<span class="line-number fix-number">!</span>`;
                    highlightedContent += `<span class="line-content">`;
                    highlightedContent += `<em class="fix-explanation">Add the missing "${problemLine.fieldName}" field above</em>`;
                    highlightedContent += `</span>`;
                    highlightedContent += `<span class="fix-indicator">`;
                    highlightedContent += `<i class="fas fa-lightbulb"></i> `;
                    highlightedContent += `<span class="fix-text">REQUIRED</span>`;
                    highlightedContent += `</span>`;
                    highlightedContent += '</div>';
                } else {
                    // Highlight the problematic line in red (existing behavior)
                    highlightedContent += `<div class="code-line problem-line ${problemType}-line" id="problematic-line-${lineNumber}" data-line="${lineNumber}" data-column-index="${problemItem.columnIndex || ''}">`;
                    highlightedContent += `<span class="line-number ${problemType}-number">${lineNumber}</span>`;
                    highlightedContent += `<span class="line-content">${escapeHtml(line)}</span>`;
                    highlightedContent += `<span class="problem-indicator ${problemType}-indicator">`;
                    highlightedContent += `<i class="fas fa-${isWarning ? 'exclamation-triangle' : 'times-circle'}"></i> `;
                    highlightedContent += `<span class="problem-text">${isWarning ? 'WARNING' : 'ERROR'}`;
                    if (problemItem.columnIndex !== undefined) {
                        highlightedContent += ` - Column ${problemItem.columnIndex + 1}`;
                    }
                    highlightedContent += `</span>`;
                    highlightedContent += `</span>`;
                    highlightedContent += '</div>';
                }
                
                // Add suggested fix or type recommendations in green
                if (!problemLine.isMissingField && problemItem && (problemItem.suggestion || problemItem.currentValue)) {
                    const fixedLine = generateFixedLine(line, problemItem, location);
                    console.log('Generated fixed line:', { originalLine: line, fixedLine, problemItem });
                    
                    if (fixedLine && fixedLine !== line) {
                        highlightedContent += `<div class="code-line fix-line">`;
                        highlightedContent += `<span class="line-number fix-number">+${lineNumber}</span>`;
                        highlightedContent += `<span class="line-content">${escapeHtml(fixedLine)}</span>`;
                        highlightedContent += `<span class="fix-indicator">`;
                        highlightedContent += `<i class="fas fa-check"></i> `;
                        highlightedContent += `<span class="fix-text">${isWarning ? 'SUGGESTED' : 'FIXED'}</span>`;
                        highlightedContent += `</span>`;
                        highlightedContent += '</div>';
                    } else {
                        // If no fixed line generated, show a generic fix suggestion
                        console.log('No fixed line generated, showing suggestion');
                        if (problemItem.suggestion) {
                            highlightedContent += `<div class="code-line fix-line">`;
                            highlightedContent += `<span class="line-number fix-number">!</span>`;
                            highlightedContent += `<span class="line-content"><em>Fix: ${problemItem.suggestion}</em></span>`;
                            highlightedContent += `<span class="fix-indicator">`;
                            highlightedContent += `<i class="fas fa-lightbulb"></i> `;
                            highlightedContent += `<span class="fix-text">SUGGESTION</span>`;
                            highlightedContent += `</span>`;
                            highlightedContent += '</div>';
                        }
                    }
                }
                
                // Add a separator line
                highlightedContent += `<div class="code-line separator-line">`;
                highlightedContent += `<span class="line-number separator-number">~</span>`;
                highlightedContent += `<span class="line-content separator-content"><!-- ${isWarning ? 'Improvement suggested above' : 'Fix applied above'} --></span>`;
                highlightedContent += `<span class="separator-indicator"></span>`;
                highlightedContent += '</div>';
            } else {
                // Normal line
                highlightedContent += `<div class="code-line" data-line="${lineNumber}">`;
                highlightedContent += `<span class="line-number">${lineNumber}</span>`;
                highlightedContent += `<span class="line-content">${escapeHtml(line)}</span>`;
                highlightedContent += '</div>';
            }
        });
        
        const fixedValue = generateFixedValue(problemItem);
        
        return `
            <div class="file-content-viewer">
                <div class="code-header">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="badge bg-${problemClass} me-2">
                                <i class="fas fa-${isWarning ? 'exclamation-triangle' : 'bug'}"></i> 
                                ${isWarning ? 'Performance Warning' : 'Issue Found'}
                            </span>
                            <span class="text-muted">${problemItem ? problemItem.message : 'Validation Problem'}</span>
                        </div>
                        <div class="code-legend">
                            <span class="legend-item">
                                <span class="legend-color ${problemType}-color"></span>
                                <small>${isWarning ? 'Warning' : 'Problem'}</small>
                            </span>
                            <span class="legend-item">
                                <span class="legend-color fix-color"></span>
                                <small>Suggestion</small>
                            </span>
                        </div>
                    </div>
                </div>
                <pre class="code-content">${highlightedContent}</pre>
                ${problemItem && (problemItem.suggestion || fixedValue) ? `
                    <div class="fix-summary">
                        <div class="row">
                            ${problemItem.currentValue ? `
                                <div class="col-md-6">
                                    <div class="value-box ${problemType}-box">
                                        <h6><i class="fas fa-${isWarning ? 'exclamation-triangle' : 'times'} me-1"></i>Current Value</h6>
                                        <code>${escapeHtml(problemItem.currentValue)}</code>
                                    </div>
                                </div>
                            ` : ''}
                            ${fixedValue || (isWarning && problemItem.type === 'performance_warning') ? `
                                <div class="col-md-6">
                                    <div class="value-box fix-box">
                                        <h6><i class="fas fa-lightbulb me-1"></i>Recommendations</h6>
                                        ${isWarning && problemItem.type === 'performance_warning' ? `
                                            <div class="mb-2">
                                                <strong>Common alternatives:</strong>
                                                <div class="d-flex flex-wrap gap-1 mt-1">
                                                    <span class="badge bg-success">String</span>
                                                    <span class="badge bg-success">DateTime</span>
                                                    <span class="badge bg-success">Int</span>
                                                    <span class="badge bg-success">Double</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${fixedValue ? `<code>${escapeHtml(fixedValue)}</code>` : ''}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        ${problemItem.suggestion ? `
                            <div class="alert alert-${isWarning ? 'warning' : 'success'} mt-3 mb-0">
                                <i class="fas fa-lightbulb me-2"></i>
                                <strong>${isWarning ? 'Best Practice:' : 'How to Fix:'}</strong> ${problemItem.suggestion}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
    } catch (error) {
        // If JSON parsing fails, show raw content with basic highlighting
        return `
            <div class="file-content-viewer">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Unable to parse JSON for detailed highlighting. Showing raw content.
                </div>
                <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;"><code>${escapeHtml(content)}</code></pre>
            </div>
        `;
    }
}

function findProblemLine(lines, location, problemItem) {
    if (!problemItem) return null;
    
    console.log('Finding problem line for:', { location, problemItem });
    
    // Handle missing field cases
    if (problemItem.type === 'missing_field') {
        console.log('Handling missing field case for:', problemItem.field);
        
        // Use the line number we calculated during validation if available
        if (problemItem.lineNumber) {
            const lineNumber = problemItem.lineNumber;
            const insertLine = lineNumber <= lines.length ? lines[lineNumber - 1] || '' : '';
            
            return { 
                lineNumber: lineNumber, 
                line: insertLine,
                isMissingField: true,
                fixCode: problemItem.fixCode,
                fieldName: problemItem.field,
                insertAfter: lineNumber > 1 ? lines[lineNumber - 2] : null
            };
        }
        
        // Fallback: find a good insertion point
        const fieldOrder = ['type', 'displayName', 'description', 'simplifiedSchemaVersion', 'tables'];
        const currentFieldIndex = fieldOrder.indexOf(problemItem.field);
        
        // Look for existing fields to determine where to add the missing one
        for (let i = currentFieldIndex - 1; i >= 0; i--) {
            const previousField = fieldOrder[i];
            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                if (lines[lineIndex].includes(`"${previousField}"`)) {
                    return { 
                        lineNumber: lineIndex + 2, 
                        line: lineIndex + 1 < lines.length ? lines[lineIndex + 1] : '',
                        isMissingField: true,
                        fixCode: problemItem.fixCode,
                        fieldName: problemItem.field,
                        insertAfter: lines[lineIndex]
                    };
                }
            }
        }
        
        // If no previous field found, suggest adding after the opening brace
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '{') {
                return { 
                    lineNumber: i + 2, 
                    line: i + 1 < lines.length ? lines[i + 1] : '',
                    isMissingField: true,
                    fixCode: problemItem.fixCode,
                    fieldName: problemItem.field,
                    insertAfter: lines[i]
                };
            }
        }
    }
    
    // Parse the location to understand what we're looking for
    const locationParts = location.split('.');
    let searchTerm = '';
    
    if (location.includes('description')) {
        // For description errors, we want to find the line with the actual description content
        console.log('Looking for description field with value:', problemItem.currentValue);
        
        // Try to find the exact line containing the problematic description
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('"description"') && line.includes(':')) {
                // Check if this line contains the problematic description value
                if (problemItem && problemItem.currentValue && line.includes(problemItem.currentValue)) {
                    console.log(`Found exact description line ${i + 1}: ${line}`);
                    return { lineNumber: i + 1, line: line };
                }
                // If this is a description line but not the right one, keep looking
                console.log(`Found description line ${i + 1} but value doesn't match: ${line}`);
            }
        }
        
        // Fallback: Find any description line (sometimes the value might be on the next line)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('"description"')) {
                console.log(`Fallback: Using description field line ${i + 1}: ${line}`);
                return { lineNumber: i + 1, line: line };
            }
        }
        
        // Last resort: search for the actual problem value anywhere in the file
        if (problemItem.currentValue) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes(problemItem.currentValue)) {
                    console.log(`Found problematic value line ${i + 1}: ${line}`);
                    return { lineNumber: i + 1, line: line };
                }
            }
        }
        
        searchTerm = '"description"';
    } else if (location.includes('simplifiedSchemaVersion')) {
        searchTerm = '"simplifiedSchemaVersion"';
    } else if (location.includes('input[]')) {
        const inputIndex = location.match(/input\[(\d+)\]/)?.[1];
        if (inputIndex) {
            searchTerm = '"input"';
        }
    } else if (location.includes('columns[')) {
        // Enhanced column finding logic
        const colIndex = location.match(/columns\[(\d+)\]/)?.[1];
        if (colIndex !== undefined) {
            return findColumnInLines(lines, parseInt(colIndex), problemItem);
        }
    } else if (location.includes('type')) {
        searchTerm = '"type"';
    } else if (location.includes('name')) {
        searchTerm = '"name"';
    } else {
        // Generic field search
        const fieldName = locationParts[locationParts.length - 1];
        searchTerm = `"${fieldName}"`;
    }
    
    // Find the line containing the search term
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(searchTerm)) {
            // For more specific matching, check if it's the right context
            if (problemItem.currentValue && !line.includes(problemItem.currentValue)) {
                continue; // Keep looking for the exact match
            }
            return {
                lineNumber: i + 1,
                line: line,
                searchTerm: searchTerm
            };
        }
    }
    
    // If not found, try searching for the current value directly
    if (problemItem.currentValue) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(problemItem.currentValue)) {
                return {
                    lineNumber: i + 1,
                    line: lines[i],
                    searchTerm: problemItem.currentValue
                };
            }
        }
    }
    
    return null;
}

function findColumnInLines(lines, columnIndex, problemItem) {
    try {
        // Special handling for transform pattern columns
        if (problemItem && problemItem.type === 'info' && problemItem.field === 'transformName') {
            console.log('Looking for transform pattern column specifically');
            
            // Look for transformName field first
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('"transformName"') && line.includes(':')) {
                    console.log(`Found transform pattern column at line ${i + 1}: ${line}`);
                    return {
                        lineNumber: i + 1,
                        line: line,
                        searchTerm: 'Transform pattern column',
                        columnIndex: columnIndex
                    };
                }
            }
        }
        
        // Special handling for TenantId column issue - search for the actual TenantId field first
        if (problemItem && problemItem.type === 'forbidden_system_column' && problemItem.currentValue === 'TenantId') {
            console.log('Looking for TenantId column specifically');
            
            // First, try to find the exact line with "TenantId" and "name" field
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('"name"') && line.includes('"TenantId"')) {
                    console.log(`Found TenantId column name field at line ${i + 1}: ${line}`);
                    return {
                        lineNumber: i + 1,
                        line: line,
                        searchTerm: 'TenantId column name field',
                        columnIndex: columnIndex
                    };
                }
            }
            
            // Fallback: look for any line containing TenantId
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('TenantId')) {
                    console.log(`Found TenantId reference at line ${i + 1}: ${line}`);
                    return {
                        lineNumber: i + 1,
                        line: line,
                        searchTerm: 'TenantId reference',
                        columnIndex: columnIndex
                    };
                }
            }
        }
        
        // Enhanced general column finding logic that correctly tracks column positions
        let inColumnsArray = false;
        let currentColumnIndex = -1;
        let braceDepth = 0;
        let inColumnObject = false;
        let columnStartLine = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if we're entering the columns array
            if (line.includes('"columns"') && line.includes('[')) {
                inColumnsArray = true;
                console.log(`Found columns array start at line ${i + 1}`);
                continue;
            }
            
            if (!inColumnsArray) continue;
            
            // Track brace depth to understand object structure
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            // If we find an opening brace that starts a new object (not nested), we're starting a new column
            if (openBraces > 0 && braceDepth === 0) {
                currentColumnIndex++;
                inColumnObject = true;
                columnStartLine = i + 1;
                braceDepth = openBraces - closeBraces;
                
                console.log(`Found column ${currentColumnIndex} starting at line ${columnStartLine}, target column: ${columnIndex}`);
                
                // Check if this is the column we're looking for
                if (currentColumnIndex === columnIndex) {
                    console.log(`Found target column ${columnIndex} at line ${columnStartLine}`);
                    
                    // For transform pattern columns, look for transformName field
                    if (problemItem && problemItem.field === 'transformName') {
                        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
                            const searchLine = lines[j];
                            if (searchLine.includes('"transformName"') && searchLine.includes(':')) {
                                console.log(`Found transformName field for column ${columnIndex} at line ${j + 1}: ${searchLine}`);
                                return {
                                    lineNumber: j + 1,
                                    line: lines[j],
                                    searchTerm: `Column ${columnIndex + 1} transformName field`,
                                    columnIndex: columnIndex
                                };
                            }
                        }
                    }
                    
                    // Look for the name field within this column object
                    let searchStart = i;
                    let searchEnd = i + 20; // Look ahead up to 20 lines for the name field
                    
                    for (let j = searchStart; j < Math.min(searchEnd, lines.length); j++) {
                        const searchLine = lines[j];
                        if (searchLine.includes('"name"') && searchLine.includes(':')) {
                            console.log(`Found name field for column ${columnIndex} at line ${j + 1}: ${searchLine}`);
                            return {
                                lineNumber: j + 1,
                                line: lines[j],
                                searchTerm: `Column ${columnIndex + 1} name field`,
                                columnIndex: columnIndex
                            };
                        }
                    }
                    
                    // If no name field found, return the column start
                    return {
                        lineNumber: columnStartLine,
                        line: lines[i],
                        searchTerm: `Column ${columnIndex + 1} start`,
                        columnIndex: columnIndex
                    };
                }
            } else if (inColumnObject) {
                // Update brace depth while inside a column object
                braceDepth += openBraces - closeBraces;
                
                // If we've closed all braces for this column, we're done with it
                if (braceDepth <= 0) {
                    inColumnObject = false;
                    console.log(`Finished processing column ${currentColumnIndex}`);
                }
            }
            
            // Check if we're leaving the columns array
            if (line.includes(']') && inColumnsArray && braceDepth === 0) {
                console.log(`Reached end of columns array at line ${i + 1}`);
                break;
            }
        }
        
        // Fallback: if we can't find the exact column, return the columns array start
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('"columns"')) {
                console.log(`Fallback: returning columns array start at line ${i + 1}`);
                return {
                    lineNumber: i + 1,
                    line: lines[i],
                    searchTerm: `Column ${columnIndex + 1} (columns array)`,
                    columnIndex: columnIndex
                };
            }
        }
        
    } catch (error) {
        console.error('Error in findColumnInLines:', error);
    }
    
    return null;
}

function generateFixedLine(originalLine, problemItem, location) {
    if (!problemItem) return null;
    
    try {
        let fixedLine = originalLine;
        
        // Handle different types of fixes
        if (problemItem.type === 'formatting_error' && location.includes('description')) {
            // Fix description capitalization and punctuation
            const currentValue = problemItem.currentValue;
            let fixedValue = currentValue;
            
            // Capitalize first letter if needed
            if (!currentValue.charAt(0).match(/[A-Z]/)) {
                fixedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
            }
            
            // Add period at the end if needed
            if (!fixedValue.endsWith('.')) {
                fixedValue = fixedValue + '.';
            }
            
            // Replace the description value in the line
            fixedLine = originalLine.replace(`"${currentValue}"`, `"${fixedValue}"`);
            
            // Also try without quotes in case the format is different
            if (fixedLine === originalLine) {
                fixedLine = originalLine.replace(currentValue, fixedValue);
            }
        } else if (problemItem.type === 'incorrect_capitalization') {
            // Fix capitalization issues for data types like "dynamic" -> "Dynamic"
            const currentValue = problemItem.currentValue;
            const expectedValue = problemItem.expectedValue || (currentValue.charAt(0).toUpperCase() + currentValue.slice(1));
            fixedLine = originalLine.replace(`"${currentValue}"`, `"${expectedValue}"`);
        } else if (problemItem.type === 'invalid_value') {
            // Fix invalid values
            const currentValue = problemItem.currentValue;
            let fixedValue = '';
            
            if (currentValue === 'Guid' && location.includes('columns')) {
                fixedValue = 'String';
            } else if (currentValue === 'InvalidType' && location.includes('columns')) {
                fixedValue = 'String';
            } else if (location.includes('simplifiedSchemaVersion')) {
                fixedValue = '3';
            } else if (currentValue === '2' && location.includes('simplifiedSchemaVersion')) {
                fixedValue = '3';
            } else if (currentValue === 'Dynamic' && problemItem.type === 'performance_warning') {
                // For Dynamic type warnings, suggest String as a common alternative
                fixedValue = 'String';
            }
            
            if (fixedValue) {
                fixedLine = originalLine.replace(`"${currentValue}"`, `"${fixedValue}"`);
            }
        } else if (problemItem.type === 'performance_warning' && problemItem.currentValue === 'Dynamic') {
            // For Dynamic type performance warnings, suggest String as default
            fixedLine = originalLine.replace(`"Dynamic"`, `"String"`);
        } else if (problemItem.type === 'invalid_length' && location.includes('name')) {
            // Fix length issues by truncating
            const currentValue = problemItem.currentValue;
            if (typeof currentValue === 'string' && currentValue.length > 45) {
                const fixedValue = currentValue.substring(0, 42) + '...';
                fixedLine = originalLine.replace(`"${currentValue}"`, `"${fixedValue}"`);
            }
        } else if (problemItem.type === 'missing_field') {
            // For missing fields, suggest adding the field
            const fieldName = problemItem.field;
            const suggestedValue = generateFixedValue(problemItem);
            if (suggestedValue) {
                // Add the field to the line (simplified approach)
                const indent = originalLine.match(/^(\s*)/)[0];
                fixedLine = originalLine + `\n${indent}  "${fieldName}": "${suggestedValue}",`;
            }
        }
        
        return fixedLine !== originalLine ? fixedLine : null;
    } catch (error) {
        return null;
    }
}

function generateFixedValue(problemItem) {
    if (!problemItem || typeof problemItem === 'string') return '';
    
    if (problemItem.type === 'formatting_error' && problemItem.currentValue) {
        let fixedValue = problemItem.currentValue;
        
        // Capitalize first letter
        if (!fixedValue.charAt(0).match(/[A-Z]/)) {
            fixedValue = fixedValue.charAt(0).toUpperCase() + fixedValue.slice(1);
        }
        
        // Add period at the end
        if (!fixedValue.endsWith('.')) {
            fixedValue = fixedValue + '.';
        }
        
        return fixedValue;
    } else if (problemItem.type === 'incorrect_capitalization' && problemItem.currentValue) {
        // Handle capitalization fixes for data types like "dynamic" -> "Dynamic"
        return problemItem.expectedValue || (problemItem.currentValue.charAt(0).toUpperCase() + problemItem.currentValue.slice(1));
    } else if (problemItem.type === 'invalid_value') {
        const currentValue = problemItem.currentValue;
        
        if (currentValue === 'Guid' && problemItem.location && problemItem.location.includes('columns')) {
            return 'String';
        } else if (currentValue === 'InvalidType' && problemItem.location && problemItem.location.includes('columns')) {
            return 'String';
        } else if (problemItem.location && problemItem.location.includes('simplifiedSchemaVersion')) {
            return '3';
        } else if (currentValue === '2' && problemItem.location && problemItem.location.includes('simplifiedSchemaVersion')) {
            return '3';
        }
    } else if (problemItem.type === 'performance_warning' && problemItem.currentValue === 'Dynamic') {
        return 'String';  // Default suggestion for Dynamic type
    } else if (problemItem.type === 'invalid_length' && problemItem.currentValue) {
        if (typeof problemItem.currentValue === 'string' && problemItem.currentValue.length > 45) {
            return problemItem.currentValue.substring(0, 42) + '...';
        }
    } else if (problemItem.type === 'missing_field') {
        const fieldName = problemItem.field;
        if (fieldName === 'type') return 'DefaultType';
        if (fieldName === 'displayName') return 'Default Display Name';
        if (fieldName === 'description') return 'Default description.';
        if (fieldName === 'simplifiedSchemaVersion') return '3';
        if (fieldName === 'name') return 'DefaultName';
        return 'DefaultValue';
    }
    
    return problemItem.expectedValue || '';
}

function scrollToProblematicLine(location, issue) {
    
    // Find the problematic line element
    const problemLineElements = document.querySelectorAll('.problem-line');
    
    if (problemLineElements.length === 0) {
        return;
    }
    
    // Get the first problematic line (main issue)
    const targetElement = problemLineElements[0];
    const lineNumber = targetElement.getAttribute('data-line');
    
    
    // Get the code content container for scrolling
    const codeContent = document.querySelector('.code-content');
    if (!codeContent) {
        return;
    }
    
    // Calculate the scroll position
    const containerTop = codeContent.offsetTop;
    const elementTop = targetElement.offsetTop;
    const containerHeight = codeContent.clientHeight;
    const elementHeight = targetElement.offsetHeight;
    
    // Calculate scroll position to center the problematic line
    const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
    
    
    // Smooth scroll to the problematic line
    codeContent.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
    });
    
    // Add a temporary highlight animation to draw attention
    targetElement.style.animation = 'none';
    setTimeout(() => {
        targetElement.style.animation = 'highlightProblem 2s ease-in-out';
    }, 100);
    
    // Also scroll the modal body if the code content is inside a modal
    const modalBody = targetElement.closest('.modal-body');
    if (modalBody) {
        const modalScrollTop = targetElement.offsetTop - modalBody.offsetTop - (modalBody.clientHeight / 2);
        modalBody.scrollTo({
            top: Math.max(0, modalScrollTop),
            behavior: 'smooth'
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function applyFix(resultIndex, location) {
    showAlert('Auto-fix functionality would modify your file. For now, please manually apply the suggested changes.', 'info');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Interactive validation cards functionality
function toggleValidationDetails(validationType) {
    const detailsElement = document.getElementById(validationType + '-details');
    
    if (!detailsElement) {
        return;
    }
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
    } else {
        detailsElement.style.display = 'none';
    }
}

function closeOtherValidationCards(currentType) {
    const allValidationTypes = ['folder', 'manifest', 'kql', 'references', 'descriptions', 'samples'];
    
    allValidationTypes.forEach(type => {
        if (type !== currentType) {
            const detailsElement = document.getElementById(type + '-details');
            const cardElement = document.querySelector(`[data-validation="${type}"]`);
            
            if (!detailsElement || !cardElement) {
                return;
            }
            
            const buttonElement = cardElement.querySelector('button');
            const chevronIcon = buttonElement.querySelector('i.fa-chevron-down, i.fa-chevron-up');
            
            if (detailsElement.style.display !== 'none') {
                detailsElement.classList.add('hide');
                detailsElement.classList.remove('show');
                cardElement.classList.remove('active');
                buttonElement.classList.remove('expanded');
                
                if (chevronIcon) {
                    chevronIcon.classList.remove('fa-chevron-up');
                    chevronIcon.classList.add('fa-chevron-down');
                    buttonElement.innerHTML = chevronIcon.outerHTML + ' Learn More';
                }
                
                setTimeout(() => {
                    detailsElement.style.display = 'none';
                }, 400);
            }
        }
    });
}

// New function to show validation section and scroll to it
function showValidationAndScroll() {
    const uploadSection = document.getElementById('upload-section');
    
    if (!uploadSection) {
        return;
    }
    
    // Show the upload section
    uploadSection.style.display = 'block';
    uploadSection.classList.remove('hide');
    uploadSection.classList.add('show');
    
    // Scroll to the upload section smoothly after a short delay to ensure it's visible
    setTimeout(() => {
        uploadSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 100);
}

// Make drag and drop functions globally accessible
window.dragOverHandler = dragOverHandler;
window.dragEnterHandler = dragEnterHandler;
window.dragLeaveHandler = dragLeaveHandler;
window.dropHandler = dropHandler;
window.handleFiles = handleFiles;
window.toggleGuide = toggleGuide;
window.toggleValidation = toggleValidation;
window.startValidationWithScroll = startValidationWithScroll;
window.viewGuideWithScroll = viewGuideWithScroll;
window.showValidationAndScroll = showValidationAndScroll;

// Make function globally accessible
window.toggleValidationDetails = toggleValidationDetails;

/**
 * 🎯 DRAG & DROP HANDLER SETUP
 * Ensures drag and drop functionality is properly attached to upload areas
 * 
 * WHAT IT DOES FOR YOUR FRIENDS:
 * This function makes sure the drag-and-drop zones are properly set up and working,
 * even when the upload section is initially hidden. It ensures users can always
 * drag files into the upload area once it's visible.
 * 
 * BUSINESS VALUE:
 * Provides a reliable drag-and-drop experience that works consistently,
 * making file uploads intuitive and user-friendly.
 * 
 * TECHNICAL DETAILS:
 * - Explicitly attaches event handlers to upload areas
 * - Ensures handlers work even after DOM manipulation
 * - Provides fallback for cases where inline handlers might fail
 */
function setupDragDropHandlers() {
    console.log('🎯 Setting up drag and drop handlers...');
    
    // Find the upload area element
    const uploadArea = document.querySelector('.upload-area');
    
    if (!uploadArea) {
        console.warn('Upload area not found during drag drop setup');
        return;
    }
    
    console.log('✅ Upload area found, attaching handlers');
    
    // Attach event listeners programmatically as backup to inline handlers
    uploadArea.addEventListener('dragenter', dragEnterHandler);
    uploadArea.addEventListener('dragover', dragOverHandler);
    uploadArea.addEventListener('dragleave', dragLeaveHandler);
    uploadArea.addEventListener('drop', dropHandler);
    
    // Also make the upload area clickable to trigger file input
    uploadArea.addEventListener('click', function(e) {
        // Don't trigger if clicking on buttons inside the upload area
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        
        // Trigger file input click
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    });
    
    console.log('✅ Drag and drop handlers setup complete');
}

function setupKeyboardShortcuts() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Only if not typing in an input field
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            
            // Toggle validation with 'V' key
            if (event.key === 'v' || event.key === 'V') {
                if (!event.ctrlKey && !event.metaKey && !event.altKey) {
                    event.preventDefault();
                    toggleValidation();
                }
            }
            
            // Toggle guide with 'G' key
            if (event.key === 'g' || event.key === 'G') {
                if (!event.ctrlKey && !event.metaKey && !event.altKey) {
                    event.preventDefault();
                    toggleGuide();
                }
            }
            
            // Close sections with Escape key
            if (event.key === 'Escape') {
                const guideSection = document.getElementById('guide-section');
                const uploadSection = document.getElementById('upload-section');
                
                if (guideSection.style.display !== 'none') {
                    toggleGuide();
                } else if (uploadSection.style.display !== 'none') {
                    toggleValidation();
                }
            }
        }
    });
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'info' ? 'primary' : type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-info-circle me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container (create if doesn't exist)
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Show toast
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
        } else {
            // Fallback: just show the toast without Bootstrap animation
            toast.classList.add('show');
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    } catch (error) {
        // Fallback: just show the toast without Bootstrap animation
        toast.classList.add('show');
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

// Button animation functions
function startValidationAnimation() {
    const validateBtn = document.getElementById('validateBtn');
    if (!validateBtn) return;
    
    // Store original content
    validateBtn.dataset.originalText = validateBtn.innerHTML;
    
    // Add loading classes
    validateBtn.classList.add('btn-loading', 'btn-validating');
    validateBtn.disabled = true;
    
    // Update button content with spinning icon and text
    validateBtn.innerHTML = `
        <span class="btn-text">
            <i class="fas fa-cog me-2"></i>Validating Files...
        </span>
    `;
    
    // Add pulsing animation to the button
    validateBtn.style.animation = 'pulse 1.5s infinite';
}

function stopValidationAnimation(success = true) {
    const validateBtn = document.getElementById('validateBtn');
    if (!validateBtn) return;
    
    // Remove loading classes
    validateBtn.classList.remove('btn-loading', 'btn-validating');
    validateBtn.style.animation = '';
    
    if (success) {
        // Show success state briefly
        validateBtn.classList.add('btn-success');
        validateBtn.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>Validation Complete!
        `;
        
        // After 2 seconds, restore original state
        setTimeout(() => {
            validateBtn.classList.remove('btn-success');
            validateBtn.innerHTML = validateBtn.dataset.originalText || `
                <i class="fas fa-check-circle me-2"></i>Validate Files
            `;
            validateBtn.disabled = false;
        }, 2000);
    } else {
        // Show error state briefly
        validateBtn.classList.add('btn-danger');
        validateBtn.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>Validation Failed
        `;
        
        // After 2 seconds, restore original state
        setTimeout(() => {
            validateBtn.classList.remove('btn-danger');
            validateBtn.innerHTML = validateBtn.dataset.originalText || `
                <i class="fas fa-check-circle me-2"></i>Validate Files
            `;
            validateBtn.disabled = false;
        }, 2000);
    }
}

// New function to clear uploaded files and reset the UI
function clearFiles() {
    uploadedFiles = [];
    
    // Hide file list
    const fileList = document.getElementById('fileList');
    if (fileList) {
        fileList.style.display = 'none';
    }
    
    // Clear file list content
    const fileListContent = document.getElementById('fileListContent');
    if (fileListContent) {
        fileListContent.innerHTML = '';
    }
    
    // Disable validate button
    disableValidateButton();
    
    // Clear file inputs
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    if (fileInput) fileInput.value = '';
    if (folderInput) folderInput.value = '';
    
    // Clear validation results
    clearValidationResults();
}

// Enhanced helper functions for the improved file content viewer

function copyFileContentToClipboard(resultIndex) {
    console.log('copyFileContentToClipboard called with:', resultIndex);
    
    try {
        const results = validationResults;
        if (!results || !results[resultIndex]) {
            showAlert('File content not available for copying.', 'warning');
            return;
        }
        
        const result = results[resultIndex];
        if (!result.originalContent) {
            showAlert('File content not available for copying.', 'warning');
            return;
        }
        
        // Use the Clipboard API if available, fallback to older methods
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(result.originalContent).then(() => {
                showAlert('File content copied to clipboard successfully!', 'success');
            }).catch((error) => {
                console.error('Clipboard API failed:', error);
                fallbackCopyToClipboard(result.originalContent);
            });
        } else {
            fallbackCopyToClipboard(result.originalContent);
        }
        
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showAlert('Failed to copy file content to clipboard.', 'danger');
    }
}

function fallbackCopyToClipboard(text) {
    try {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        
        // Select and copy the text
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showAlert('File content copied to clipboard successfully!', 'success');
        } else {
            throw new Error('execCommand failed');
        }
    } catch (error) {
        console.error('Fallback copy failed:', error);
        showAlert('Unable to copy to clipboard. Please manually select and copy the content.', 'warning');
    }
}

function downloadFileContent(resultIndex, filename) {
    console.log('downloadFileContent called with:', { resultIndex, filename });
    
    try {
        const results = validationResults;
        if (!results || !results[resultIndex]) {
            showAlert('File content not available for download.', 'warning');
            return;
        }
        
        const result = results[resultIndex];
        if (!result.originalContent) {
            showAlert('File content not available for download.', 'warning');
            return;
        }
        
        // Create a Blob with the file content
        const blob = new Blob([result.originalContent], { type: 'text/plain' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename || 'file-content.txt';
        downloadLink.style.display = 'none';
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        showAlert('File download started successfully!', 'success');
        
    } catch (error) {
        console.error('Error downloading file:', error);
        showAlert('Failed to download file content.', 'danger');
    }
}

function showFixSuggestion(resultIndex, location) {
    console.log('showFixSuggestion called with:', { resultIndex, location });
    
    try {
        const results = validationResults;
        if (!results || !results[resultIndex]) {
            showAlert('Fix suggestion not available.', 'warning');
            return;
        }
        
        const result = results[resultIndex];
        
        // Find the specific issue or warning for this location
        const issue = result.issues ? result.issues.find(issue => issue.location === location) : null;
        const warning = result.warnings ? result.warnings.find(warning => warning.location === location) : null;
        const problemItem = issue || warning;
        
        if (!problemItem || !problemItem.suggestion) {
            showAlert('No fix suggestion available for this issue.', 'warning');
            return;
        }
        
        // Create fix suggestion modal
        const modalId = 'fixSuggestionModal';
        let modal = document.getElementById(modalId);
        
        // Remove existing modal if it exists
        if (modal) {
            modal.remove();
        }
        
        // Create new modal
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.style.zIndex = '10000'; // Ensure it appears above file content modal
        
        const closeButtonHandler = `closeFixSuggestionModal('${modalId}')`;
        
        // Store cleanup function globally for the close button
        window.closeFixSuggestionModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            // Remove the modal using Bootstrap's method if available
            const bootstrapModal = bootstrap?.Modal?.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
            
            // Remove modal and cleanup
            modal.remove();
            
            // Ensure backdrop is removed
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
        const isWarning = problemItem.severity === 'warning';
        const fixedValue = generateFixedValue(problemItem);
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-${isWarning ? 'warning' : 'success'} text-${isWarning ? 'dark' : 'white'}">
                        <h5 class="modal-title">
                            <i class="fas fa-lightbulb me-2"></i>${isWarning ? 'Performance Improvement Suggestion' : 'Fix Suggestion'}
                        </h5>
                        <button type="button" class="btn-close ${isWarning ? '' : 'btn-close-white'}" onclick="${closeButtonHandler}" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-${isWarning ? 'warning' : 'info'} mb-4">
                            <h6 class="alert-heading">
                                <i class="fas fa-${isWarning ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                                ${isWarning ? 'Performance Issue Detected' : 'Issue Found'}
                            </h6>
                            <p class="mb-0">${problemItem.message}</p>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-${isWarning ? 'warning' : 'danger'}">
                                    <i class="fas fa-${isWarning ? 'exclamation-triangle' : 'times'} me-1"></i>Current Implementation
                                </h6>
                                <div class="p-3 bg-light border border-${isWarning ? 'warning' : 'danger'} rounded mb-3">
                                    <small class="text-muted d-block mb-1">Location: <code>${location}</code></small>
                                    ${problemItem.currentValue ? `<code class="text-${isWarning ? 'warning' : 'danger'}">${escapeHtml(problemItem.currentValue)}</code>` : '<em>See issue description above</em>'}
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <h6 class="text-success">
                                    <i class="fas fa-check me-1"></i>${isWarning ? 'Recommended Approach' : 'Suggested Fix'}
                                </h6>
                                <div class="p-3 bg-light border border-success rounded mb-3">
                                    ${fixedValue ? `<code class="text-success">${escapeHtml(fixedValue)}</code>` : '<em>See suggestion below</em>'}
                                    ${isWarning && problemItem.type === 'performance_warning' ? `
                                        <div class="mt-2">
                                            <small class="text-success d-block"><strong>Alternative types:</strong></small>
                                            <div class="d-flex flex-wrap gap-1 mt-1">
                                                <span class="badge bg-success">String</span>
                                                <span class="badge bg-success">DateTime</span>
                                                <span class="badge bg-success">Int</span>
                                                <span class="badge bg-success">Double</span>
                                                <span class="badge bg-success">Bool</span>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h6><i class="fas fa-lightbulb me-2"></i>How to Fix This:</h6>
                            <div class="alert alert-${isWarning ? 'warning' : 'success'} py-2">
                                ${problemItem.suggestion}
                            </div>
                        </div>
                        
                        ${problemItem.microsoftRequirement ? `
                            <div class="mb-4">
                                <h6><i class="fas fa-microsoft me-2"></i>Microsoft Azure Requirement:</h6>
                                <blockquote class="blockquote-sm bg-light p-3 border-start border-4 border-primary">
                                    ${problemItem.microsoftRequirement}
                                </blockquote>
                            </div>
                        ` : ''}
                        
                        ${problemItem.fixInstructions ? `
                            <div class="mb-4">
                                <h6><i class="fas fa-tools me-2"></i>Step-by-Step Instructions:</h6>
                                <div class="alert alert-success py-2">
                                    <strong>${problemItem.fixInstructions}</strong>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${isWarning && problemItem.type === 'performance_warning' ? `
                            <div class="alert alert-info">
                                <h6 class="alert-heading"><i class="fas fa-info-circle me-2"></i>Performance Impact</h6>
                                <p class="mb-2">Dynamic fields can impact query performance and make queries more complex. Consider these benefits of using specific data types:</p>
                                <ul class="mb-0">
                                    <li><strong>Better Query Performance:</strong> Specific types allow for optimized storage and faster queries</li>
                                    <li><strong>Improved User Experience:</strong> Users get better IntelliSense and query suggestions</li>
                                    <li><strong>Type Safety:</strong> Prevents runtime errors from type mismatches</li>
                                    <li><strong>Storage Efficiency:</strong> More efficient data compression and storage</li>
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="${closeButtonHandler}">
                            <i class="fas fa-times me-1"></i>Close
                        </button>
                        <button type="button" class="btn btn-primary" onclick="copyFixSuggestion('${escapeHtml(problemItem.suggestion)}', '${fixedValue}')">
                            <i class="fas fa-copy me-1"></i>Copy Fix Instructions
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('Fix suggestion modal created');
        
        // Show the modal
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            try {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
                console.log('Bootstrap fix suggestion modal shown');
            } catch (error) {
                console.error('Bootstrap modal failed:', error);
                showFallbackModal(modal);
            }
        } else {
            showFallbackModal(modal);
        }
        
    } catch (error) {
        console.error('Error showing fix suggestion:', error);
        showAlert('Failed to display fix suggestion.', 'danger');
    }
}

function showFallbackModal(modal) {
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    // Add backdrop click to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add escape key to close
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    console.log('Fallback fix suggestion modal shown');
}

function copyFixSuggestion(suggestion, fixedValue) {
    const textToCopy = `Fix Suggestion:\n${suggestion}\n\n${fixedValue ? `Suggested Value: ${fixedValue}` : ''}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showAlert('Fix instructions copied to clipboard!', 'success');
        }).catch((error) => {
            console.error('Clipboard API failed:', error);
            fallbackCopyToClipboard(textToCopy);
        });
    } else {
        fallbackCopyToClipboard(textToCopy);
    }
}

function getIssueCategoryName(type) {
    const categoryMap = {
        'missing_field': 'Missing Required Fields',
        'invalid_value': 'Invalid Values',
        'formatting_error': 'Formatting Errors',
        'incorrect_capitalization': 'Capitalization Issues',
        'invalid_type': 'Invalid Data Types',
        'forbidden_system_column': 'Forbidden System Columns',
        'reserved_column_name': 'Reserved Column Names',
        'json_syntax_error': 'JSON Syntax Errors',
        'invalid_json_structure': 'Invalid JSON Structure',
        'missing_required_column': 'Missing Required Columns',
        'invalid_column_type': 'Invalid Column Types',
        'folder_structure': 'Folder Structure Issues',
        'unknown': 'Other Issues'
    };
    
    return categoryMap[type] || 'Other Issues';
}

function getWarningCategoryName(type) {
    const categoryMap = {
        'performance_warning': 'Performance Warnings',
        'naming_convention_warning': 'Naming Convention Issues',
        'info': 'Informational Notes',
        'missing_timegenerated': 'TimeGenerated Field Issues',
        'empty_sample_data': 'Sample Data Issues',
        'invalid_record_structure': 'Record Structure Issues',
        'missing_kql_syntax_warning': 'KQL Syntax Issues',
        'unknown': 'Other Warnings'
    };
    
    return categoryMap[type] || 'Other Warnings';
}

function getIssueCategoryIcon(type) {
    const iconMap = {
        'missing_field': 'fas fa-exclamation-circle',
        'invalid_value': 'fas fa-times-circle',
        'formatting_error': 'fas fa-spell-check',
        'incorrect_capitalization': 'fas fa-font',
        'invalid_type': 'fas fa-code',
        'forbidden_system_column': 'fas fa-ban',
        'reserved_column_name': 'fas fa-lock',
        'json_syntax_error': 'fas fa-bug',
        'invalid_json_structure': 'fas fa-sitemap',
        'missing_required_column': 'fas fa-table',
        'invalid_column_type': 'fas fa-columns',
        'folder_structure': 'fas fa-folder-open',
        'unknown': 'fas fa-question-circle'
    };
    
    return iconMap[type] || 'fas fa-question-circle';
}

function getWarningCategoryIcon(type) {
    const iconMap = {
        'performance_warning': 'fas fa-tachometer-alt',
        'naming_convention_warning': 'fas fa-tag',
        'info': 'fas fa-info-circle',
        'missing_timegenerated': 'fas fa-clock',
        'empty_sample_data': 'fas fa-database',
        'invalid_record_structure': 'fas fa-list-alt',
        'missing_kql_syntax_warning': 'fas fa-search',
        'unknown': 'fas fa-exclamation-triangle'
    };
    
    return iconMap[type] || 'fas fa-exclamation-triangle';
}

function getIssueCategoryDescription(type) {
    const descriptionMap = {
        'missing_field': 'Required fields that are missing from your schema files',
        'invalid_value': 'Field values that do not meet Azure Log Analytics requirements',
        'formatting_error': 'Text formatting issues like capitalization and punctuation',
        'incorrect_capitalization': 'Data type and field names with incorrect capitalization',
        'invalid_type': 'Invalid or unsupported data types for Azure Log Analytics',
        'forbidden_system_column': 'Columns that are automatically added by Azure and should not be defined',
        'reserved_column_name': 'Column names that are reserved by Azure Log Analytics',
        'json_syntax_error': 'JSON files with syntax errors that prevent parsing',
        'invalid_json_structure': 'JSON files with incorrect structure for Azure Log Analytics',
        'missing_required_column': 'Required columns like TimeGenerated that are missing',
        'invalid_column_type': 'Column data types that are invalid for the specified usage',
        'folder_structure': 'Issues with the organization and structure of your schema package',
        'unknown': 'Other validation issues that need attention'
    };
    
    return descriptionMap[type] || 'Other validation issues that need attention';
}

function getWarningCategoryDescription(type) {
    const descriptionMap = {
        'performance_warning': 'Potential performance issues that could affect query speed',
        'naming_convention_warning': 'Naming patterns that don\'t follow Azure best practices',
        'info': 'Informational notes about your schema configuration',
        'missing_timegenerated': 'TimeGenerated field configuration suggestions',
        'empty_sample_data': 'Sample data files that are empty or have no records',
        'invalid_record_structure': 'Sample records that don\'t follow proper structure',
        'missing_kql_syntax_warning': 'KQL files that may not contain valid query syntax',
        'unknown': 'Other warnings and suggestions for improvement'
    };
    
    return descriptionMap[type] || 'Other warnings and suggestions for improvement';
}

function createGroupedIssuesHTML(groupedIssues, type) {
    if (!groupedIssues || Object.keys(groupedIssues).length === 0) {
        return '';
    }
    
    let html = '';
    const sortedCategories = Object.keys(groupedIssues).sort();
    
    sortedCategories.forEach((category, index) => {
        const group = groupedIssues[category];
        const accordionId = `${type}-${index}`;
        
        html += `
            <div class="accordion-item border-danger">
                <h2 class="accordion-header" id="heading-${accordionId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${accordionId}">
                        <i class="${group.icon} text-danger me-3"></i>
                        <div class="flex-grow-1">
                            <strong>${group.type}</strong>
                            <span class="badge bg-danger ms-2">${group.count}</span>
                            <div class="small text-muted">${group.description}</div>
                        </div>
                    </button>
                </h2>
                <div id="collapse-${accordionId}" class="accordion-collapse collapse" data-bs-parent="#issuesWarningsAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            ${group.items.map((item, itemIndex) => `
                                <div class="col-md-6 mb-3">
                                    <div id="category-card-${item.resultIndex}-issue-${item.issueIndex}" class="card border-danger h-100">
                                        <div class="card-body">
                                            <h6 class="card-title text-danger">
                                                <i class="fas fa-file me-1"></i>${item.fileName}
                                            </h6>
                                            <p class="card-text">${typeof item.issue === 'string' ? item.issue : item.issue.message}</p>
                                            <button class="btn btn-sm btn-outline-danger" onclick="showCategoryItemDetails(${item.resultIndex}, 'issue', ${item.issueIndex})">
                                                <i class="fas fa-eye me-1"></i>View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

function createGroupedWarningsHTML(groupedWarnings, type) {
    if (!groupedWarnings || Object.keys(groupedWarnings).length === 0) {
        return '';
    }
    
    let html = '';
    const sortedCategories = Object.keys(groupedWarnings).sort();
    
    sortedCategories.forEach((category, index) => {
        const group = groupedWarnings[category];
        const accordionId = `${type}-${index}`;
        
        html += `
            <div class="accordion-item border-warning">
                <h2 class="accordion-header" id="heading-${accordionId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${accordionId}">
                        <i class="${group.icon} text-warning me-3"></i>
                        <div class="flex-grow-1">
                            <strong>${group.type}</strong>
                            <span class="badge bg-warning ms-2">${group.count}</span>
                            <div class="small text-muted">${group.description}</div>
                        </div>
                    </button>
                </h2>
                <div id="collapse-${accordionId}" class="accordion-collapse collapse" data-bs-parent="#issuesWarningsAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            ${group.items.map((item, itemIndex) => `
                                <div class="col-md-6 mb-3">
                                    <div id="category-card-${item.resultIndex}-warning-${item.warningIndex}" class="card border-warning h-100">
                                        <div class="card-body">
                                            <h6 class="card-title text-warning">
                                                <i class="fas fa-file me-1"></i>${item.fileName}
                                            </h6>
                                            <p class="card-text">${typeof item.warning === 'string' ? item.warning : item.warning.message}</p>
                                            <button class="btn btn-sm btn-outline-warning" onclick="showCategoryItemDetails(${item.resultIndex}, 'warning', ${item.warningIndex})">
                                                <i class="fas fa-eye me-1"></i>View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

function expandFileResult(resultIndex, issueType = null, itemIndex = null) {
    // If called from category view, show details in place
    if (issueType && itemIndex !== null) {
        showCategoryItemDetails(resultIndex, issueType, itemIndex);
        return;
    }
    
    // Original behavior for direct file result expansion
    const accordionItem = document.querySelector(`#collapse${resultIndex}`);
    if (accordionItem) {
        // Use Bootstrap's collapse API if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const collapse = new bootstrap.Collapse(accordionItem, { show: true });
        } else {
            // Fallback: manually show the accordion
            accordionItem.classList.add('show');
        }
        
        // Scroll to the expanded item
        setTimeout(() => {
            accordionItem.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }
}

function showCategoryItemDetails(resultIndex, issueType, itemIndex) {
    const results = validationResults;
    if (!results || !results[resultIndex]) {
        showAlert('File result not available.', 'warning');
        return;
    }
    
    const result = results[resultIndex];
    const isIssue = issueType === 'issue';
    const items = isIssue ? result.issues : result.warnings;
    
    if (!items || itemIndex >= items.length) {
        showAlert('Item details not available.', 'warning');
        return;
    }
    
    const item = items[itemIndex];
    const cardId = `category-card-${resultIndex}-${issueType}-${itemIndex}`;
    const detailsId = `category-details-${resultIndex}-${issueType}-${itemIndex}`;
    
    // Find the specific card for this item
    const card = document.getElementById(cardId);
    if (!card) {
        console.warn('Card not found, falling back to original behavior');
        expandFileResult(resultIndex);
        return;
    }
    
    // Check if details are already showing
    let detailsElement = document.getElementById(detailsId);
    if (detailsElement) {
        // Toggle existing details
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            // Update button text
            const button = card.querySelector('button');
            if (button) {
                button.innerHTML = '<i class="fas fa-eye-slash me-1"></i>Hide Details';
                button.classList.remove('btn-outline-' + (isIssue ? 'danger' : 'warning'));
                button.classList.add('btn-' + (isIssue ? 'danger' : 'warning'));
            }
        } else {
            detailsElement.style.display = 'none';
            // Update button text
            const button = card.querySelector('button');
            if (button) {
                button.innerHTML = '<i class="fas fa-eye me-1"></i>View Details';
                button.classList.remove('btn-' + (isIssue ? 'danger' : 'warning'));
                button.classList.add('btn-outline-' + (isIssue ? 'danger' : 'warning'));
            }
        }
        return;
    }
    
    // Create new details element
    detailsElement = document.createElement('div');
    detailsElement.id = detailsId;
    detailsElement.className = 'card-footer border-top mt-3';
    
    const problemClass = isIssue ? 'danger' : 'warning';
    const problemIcon = isIssue ? 'times-circle' : 'exclamation-triangle';
    const problemText = isIssue ? 'ERROR' : 'WARNING';
    
    // Generate the fixed value based on the issue/warning
    const fixedValue = generateFixedValue(item);
    
    detailsElement.innerHTML = `
        <div class="item-details">
            <div class="d-flex align-items-center mb-3">
                <i class="fas fa-${problemIcon} text-${problemClass} me-2"></i>
                <h6 class="mb-0 text-${problemClass}">${typeof item === 'string' ? item : item.message}</h6>
            </div>
            
            ${typeof item === 'object' && item.location ? `
                <div class="small text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    Location: <code>${item.location}</code>
                </div>
            ` : ''}
            
            ${typeof item === 'object' && item.suggestion ? `
                <div class="alert alert-${problemClass} py-2 mb-3">
                    <i class="fas fa-lightbulb me-2"></i>
                    <strong>Suggestion:</strong> ${item.suggestion}
                </div>
            ` : ''}
            
            ${typeof item === 'object' && item.microsoftRequirement ? `
                <div class="microsoft-requirement mb-3">
                    <h6><i class="fas fa-microsoft me-1"></i>Microsoft Azure Requirement:</h6>
                    <blockquote class="blockquote-sm bg-light p-2 border-start border-3 border-primary">
                        ${item.microsoftRequirement}
                    </blockquote>
                </div>
            ` : ''}
            
            ${typeof item === 'object' && item.currentValue ? `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-${problemClass}"><i class="fas fa-${problemIcon} me-1"></i>Current Value:</h6>
                        <div class="p-2 bg-light border border-${problemClass} rounded">
                            <code class="text-${problemClass}">${escapeHtml(item.currentValue)}</code>
                        </div>
                    </div>
                    ${fixedValue ? `
                        <div class="col-md-6">
                            <h6 class="text-success"><i class="fas fa-check me-1"></i>Suggested Fix:</h6>
                            <div class="p-2 bg-light border border-success rounded">
                                <code class="text-success">${escapeHtml(fixedValue)}</code>
                            </div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            
            ${!isIssue && item.type === 'performance_warning' ? `
                <div class="alert alert-info py-2 mb-3">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    <strong>Performance Impact:</strong> Dynamic fields can slow down query performance and make queries more complex. Consider using specific data types for better performance.
                </div>
                
                <div class="mb-3">
                    <h6 class="text-success"><i class="fas fa-lightbulb me-1"></i>Recommended Types:</h6>
                    <div class="p-3 bg-light border border-success rounded">
                        <div class="d-flex flex-wrap gap-1">
                            <span class="badge bg-success">String</span>
                            <span class="badge bg-success">DateTime</span>
                            <span class="badge bg-success">Int</span>
                            <span class="badge bg-success">Double</span>
                            <span class="badge bg-success">Bool</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="d-flex gap-2 flex-wrap">
                ${result.originalContent ? `
                    <button class="btn btn-sm btn-outline-secondary" onclick="showFileContent('${resultIndex}', '${item.location || 'unknown'}')">
                        <i class="fas fa-file-code me-1"></i>View File Content
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-outline-primary" onclick="expandFileResult(${resultIndex})">
                    <i class="fas fa-list me-1"></i>View Full File Results
                </button>
            </div>
        </div>
    `;
    
    // Add the details element after the card body
    const cardBody = card.querySelector('.card-body');
    if (cardBody && cardBody.parentNode) {
        cardBody.parentNode.appendChild(detailsElement);
    }
    
    // Update button text and style
    const button = card.querySelector('button');
    if (button) {
        button.innerHTML = '<i class="fas fa-eye-slash me-1"></i>Hide Details';
        button.classList.remove('btn-outline-' + problemClass);
        button.classList.add('btn-' + problemClass);
        
        // Update the onclick to toggle
        button.setAttribute('onclick', `showCategoryItemDetails(${resultIndex}, '${issueType}', ${itemIndex})`);
    }
    
    // Smooth scroll to the expanded details
    setTimeout(() => {
        detailsElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 100);
}
