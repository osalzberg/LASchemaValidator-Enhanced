// Azure Log Analytics Schema Validator - JavaScript

// Global variables
let uploadedFiles = [];
let validationResults = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    
    // Check if required elements exist
    const uploadSection = document.getElementById('upload-section');
    const guideSection = document.getElementById('guide-section');
    const validationBtn = document.querySelector('button[onclick="toggleValidation()"]');
    const guideBtn = document.querySelector('button[onclick="toggleGuide()"]');
    
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Set up file input handler
    setupFileInput();
    
    // Set up document-level drag and drop prevention
    setupDragDropPrevention();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Test if validateFiles function is accessible
    
    // Test button click
    const validateBtn = document.getElementById('validateBtn');
    
}

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

// Navigation functions
function scrollToUpload() {
    document.getElementById('upload-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scrollToGuide() {
    document.getElementById('guide-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

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
    const extension = filename.split('.').pop().toLowerCase();
    
    if (filename.includes('.manifest.json')) {
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

// Main validation function
async function validateFiles() {
    
    if (uploadedFiles.length === 0) {
        showAlert('Please select files to validate.', 'warning');
        return;
    }
    
    
    // Start button animation
    startValidationAnimation();
    
    showValidationProgress();
    
    try {
        // Process each file
        const results = [];
        for (let i = 0; i < uploadedFiles.length; i++) {
            // Update current file display
            updateCurrentFile(i, uploadedFiles[i]);
            
            // Update progress bar
            updateProgress((i / uploadedFiles.length) * 100);
            
            // Validate the current file
            const result = await validateFile(uploadedFiles[i]);
            results.push(result);
        }
        
        // Update final progress and current file display
        updateProgress(100);
        const fileDisplayElement = document.getElementById('current-file-display');
        if (fileDisplayElement) {
            fileDisplayElement.innerHTML = `<strong>Validation completed!</strong>`;
        }
        
        // Add folder structure analysis if we have files with relative paths
        const hasfolderStructure = uploadedFiles.some(file => file.webkitRelativePath || file.relativePath);
        if (hasfolderStructure) {
            if (fileDisplayElement) {
                fileDisplayElement.innerHTML = `<strong>Analyzing folder structure...</strong>`;
            }
            const folderAnalysis = analyzeFolderStructure(uploadedFiles);
            results.unshift(folderAnalysis); // Add folder analysis at the beginning
        }
        
        displayValidationResults(results);
        
        // Stop button animation
        stopValidationAnimation(true);
        
    } catch (error) {
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
                result.issues.push({
                    message: `Missing required field: ${field}`,
                    type: 'missing_field',
                    field: field,
                    location: 'root',
                    severity: 'error',
                    suggestion: `Add the required field "${field}" to the root level of your manifest file.`
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

function validateDescription(description, context, result, location) {
    if (!description || typeof description !== 'string') {
        result.issues.push({
            message: `${context}: Description must be a non-empty string`,
            type: 'invalid_type',
            field: 'description',
            location: location,
            severity: 'error',
            suggestion: `Provide a valid non-empty string for the ${context.toLowerCase()}.`
        });
        result.status = 'fail';
        return;
    }
    
    if (!description.charAt(0).match(/[A-Z]/)) {
        result.issues.push({
            message: `${context}: Description must start with a capital letter`,
            type: 'formatting_error',
            field: 'description',
            location: location,
            currentValue: description,
            severity: 'error',
            suggestion: `Change the first character of "${description}" to a capital letter.`
        });
        result.status = 'fail';
    }
    
    if (!description.endsWith('.')) {
        result.issues.push({
            message: `${context}: Description must end with a period`,
            type: 'formatting_error',
            field: 'description',
            location: location,
            currentValue: description,
            severity: 'error',
            suggestion: `Add a period at the end of "${description}".`
        });
        result.status = 'fail';
    }
}

function validateTable(table, index, result) {
    const tableContext = `Table ${index + 1}`;
    const tableLocation = `tables[${index}]`;
    
    // Required fields based on official documentation
    const requiredFields = ['name', 'description', 'dataTypeId', 'artifactVersion', 'input', 'transformFilePath', 'columns'];
    requiredFields.forEach(field => {
        if (!table[field]) {
            result.issues.push({
                message: `${tableContext}: Missing required field '${field}'`,
                type: 'missing_field',
                field: field,
                location: `${tableLocation}.${field}`,
                severity: 'error',
                suggestion: `Add the required field "${field}" to ${tableContext}.`
            });
            result.status = 'fail';
        }
    });
    
    // Validate table name length
    if (table.name && table.name.length > 45) {
        result.issues.push({
            message: `${tableContext}: Table name must be 45 characters or less`,
            type: 'invalid_length',
            field: 'name',
            location: `${tableLocation}.name`,
            currentValue: `${table.name.length} characters`,
            expectedValue: '45 characters or less',
            severity: 'error',
            suggestion: `Shorten the table name "${table.name}" to 45 characters or less.`
        });
        result.status = 'fail';
    }
    
    // Validate description
    if (table.description) {
        validateDescription(table.description, `${tableContext} description`, result, `${tableLocation}.description`);
    }
    
    // Validate artifactVersion is a number >= 1
    if (table.artifactVersion !== undefined) {
        if (typeof table.artifactVersion !== 'number' || table.artifactVersion < 1 || !Number.isInteger(table.artifactVersion)) {
            result.issues.push(`${tableContext}: artifactVersion must be an integer >= 1`);
            result.status = 'fail';
        }
    }
    
    // Validate dataTypeId follows naming convention
    if (table.dataTypeId && typeof table.dataTypeId === 'string') {
        if (!table.dataTypeId.includes('_')) {
            result.warnings.push(`${tableContext}: dataTypeId should follow SERVICEIDENTITYNAME_LOGCATEGORYNAME convention`);
        }
    }
    
    // Validate categories array (optional)
    if (table.categories !== undefined) {
        if (!Array.isArray(table.categories)) {
            result.issues.push(`${tableContext}: categories must be an array`);
            result.status = 'fail';
        }
    }
    
    // Validate boolean fields (optional)
    const booleanFields = ['isResourceCentric', 'isHidden', 'isTroubleshootingAllowed', 'isLakeAllowed', 'isChangeColumnInternalNameAllowed'];
    booleanFields.forEach(field => {
        if (table[field] !== undefined && typeof table[field] !== 'boolean') {
            result.issues.push(`${tableContext}: ${field} must be a boolean`);
            result.status = 'fail';
        }
    });
    
    // Validate tableState
    if (table.tableState !== undefined) {
        const validStates = ['Validation', 'Production'];
        if (!validStates.includes(table.tableState)) {
            result.issues.push(`${tableContext}: tableState must be either "Validation" or "Production"`);
            result.status = 'fail';
        }
    }
    
    // Validate input array
    if (table.input && Array.isArray(table.input)) {
        table.input.forEach((inputField, inputIndex) => {
            validateInputField(inputField, inputIndex, tableContext, result);
        });
    } else if (table.input !== undefined) {
        result.issues.push(`${tableContext}: input must be an array`);
        result.status = 'fail';
    }
    
    // Validate columns array
    if (table.columns && Array.isArray(table.columns)) {
        if (table.columns.length === 0) {
            result.issues.push(`${tableContext}: columns array cannot be empty`);
            result.status = 'fail';
        } else {
            table.columns.forEach((column, colIndex) => {
                validateColumn(column, colIndex, tableContext, result);
            });
            
            // Check for required TimeGenerated column
            const timeGeneratedColumn = table.columns.find(col => col.name === 'TimeGenerated');
            if (!timeGeneratedColumn) {
                result.issues.push({
                    message: `${tableContext}: Missing required TimeGenerated column`,
                    type: 'missing_required_column',
                    field: 'TimeGenerated',
                    location: `${tableLocation}.columns`,
                    severity: 'error',
                    suggestion: 'Add a TimeGenerated column with type "DateTime" to your table. This column is required for all Log Analytics tables and must map to the $.time JSON path in Shoebox.'
                });
                result.status = 'fail';
            } else {
                // Validate TimeGenerated column properties
                if (timeGeneratedColumn.type !== 'DateTime') {
                    result.issues.push({
                        message: `${tableContext}: TimeGenerated column must be of type "DateTime"`,
                        type: 'invalid_column_type',
                        field: 'TimeGenerated.type',
                        location: `${tableLocation}.columns.TimeGenerated.type`,
                        currentValue: timeGeneratedColumn.type,
                        expectedValue: 'DateTime',
                        severity: 'error',
                        suggestion: 'Change the TimeGenerated column type to "DateTime".'
                    });
                    result.status = 'fail';
                }
                
                // Note: The JSON path mapping ($.time) is typically handled at the ingestion pipeline level
                // and may not be explicitly defined in the manifest, so we don't validate it here
            }
            
            // Check for forbidden system-added columns (these will be added by the ingestion pipeline)
            const systemAddedColumns = ['Type', 'TenantId', '_ResourceId', '_SubscriptionId'];
            table.columns.forEach((column, colIndex) => {
                if (systemAddedColumns.includes(column.name)) {
                    result.issues.push({
                        message: `${tableContext}: Column "${column.name}" is automatically added by the ingestion pipeline and should not be included in your schema`,
                        type: 'forbidden_system_column',
                        field: `columns[${colIndex}].name`,
                        location: `${tableLocation}.columns[${colIndex}].name`,
                        currentValue: column.name,
                        severity: 'error',
                        suggestion: `Remove the "${column.name}" column from your schema. This column will be automatically added by the Azure Log Analytics ingestion pipeline.`
                    });
                    result.status = 'fail';
                }
            });
            
            // Check for reserved column names that are blocked
            const reservedColumns = ['resource', 'resourceid', 'resourcename', 'resourcetype', 'subscriptionid'];
            table.columns.forEach((column, colIndex) => {
                if (reservedColumns.includes(column.name.toLowerCase())) {
                    result.issues.push({
                        message: `${tableContext}: Column name "${column.name}" is reserved and will be blocked at validation`,
                        type: 'reserved_column_name',
                        field: `columns[${colIndex}].name`,
                        location: `${tableLocation}.columns[${colIndex}].name`,
                        currentValue: column.name,
                        severity: 'error',
                        suggestion: `Choose a different name for the "${column.name}" column. Reserved names: resource, resourceid, resourcename, resourcetype, subscriptionid.`
                    });
                    result.status = 'fail';
                }
            });
            
            // Check for tenantid column (special case - will be overridden by system)
            const tenantIdColumn = table.columns.find(col => col.name.toLowerCase() === 'tenantid');
            if (tenantIdColumn) {
                result.issues.push({
                    message: `${tableContext}: Column "tenantid" is reserved and its value will be overridden by the system (contains workspaceId, not tenantId)`,
                    type: 'reserved_overridden_column',
                    field: 'tenantid',
                    location: `${tableLocation}.columns.tenantid`,
                    currentValue: tenantIdColumn.name,
                    severity: 'error',
                    suggestion: 'Remove the "tenantid" column from your schema. If you need tenant information, use a different column name. Note that the system-provided tenantid actually contains the workspaceId.'
                });
                result.status = 'fail';
            }
        }
    } else if (table.columns !== undefined) {
        result.issues.push(`${tableContext}: columns must be an array`);
        result.status = 'fail';
    }
}

function validateInputField(inputField, index, tableContext, result) {
    const inputContext = `${tableContext}, Input field ${index + 1}`;
    const inputLocation = `${tableContext.replace(' ', '').toLowerCase()}.input[${index}]`;
    
    // Required fields for input
    const requiredFields = ['name', 'type'];
    requiredFields.forEach(field => {
        if (!inputField[field]) {
            result.issues.push({
                message: `${inputContext}: Missing required field '${field}'`,
                type: 'missing_field',
                field: field,
                location: `${inputLocation}.${field}`,
                severity: 'error',
                suggestion: `Add the required field "${field}" to the input field definition.`
            });
            result.status = 'fail';
        }
    });
    
    // Validate input data type
    const validInputTypes = ['Bool', 'SByte', 'Byte', 'Short', 'UShort', 'Int', 'UInt', 'Long', 'ULong', 'Float', 'Double', 'String', 'DateTime', 'Guid', 'Dynamic'];
    if (inputField.type && !validInputTypes.includes(inputField.type)) {
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
    
    // Required fields
    const requiredFields = ['name', 'type', 'description'];
    requiredFields.forEach(field => {
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
    
    // Validate description
    if (column.description) {
        validateDescription(column.description, `${columnContext} description`, result, `${columnLocation}.description`);
    }
    
    // Validate data type (column types for Log Analytics tables)
    const validTypes = ['String', 'Int', 'BigInt', 'SmallInt', 'TinyInt', 'Float', 'Double', 'Bool', 'DateTime', 'Guid', 'Binary', 'Dynamic'];
    if (column.type && !validTypes.includes(column.type)) {
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
            result.issues.push(`${functionContext}: Missing required field '${field}'`);
            result.status = 'fail';
        }
    });
    
    // Validate description
    if (func.description) {
        validateDescription(func.description, `${functionContext} description`, result);
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
    
    // Required fields based on official documentation
    const requiredFields = ['displayName', 'description', 'bodyFilePath'];
    requiredFields.forEach(field => {
        if (!query[field]) {
            result.issues.push(`${queryContext}: Missing required field '${field}'`);
            result.status = 'fail';
        }
    });
    
    // Validate id (should be GUID)
    if (query.id !== undefined) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(query.id)) {
            result.issues.push(`${queryContext}: id should be a valid GUID`);
            result.status = 'fail';
        }
    }
    
    // Validate description
    if (query.description) {
        validateDescription(query.description, `${queryContext} description`, result);
    }
    
    // Validate categories (optional array)
    if (query.categories !== undefined) {
        if (!Array.isArray(query.categories)) {
            result.issues.push(`${queryContext}: categories must be an array`);
            result.status = 'fail';
        }
    }
}

async function validateKQLFile(file, result) {
    const content = await readFileContent(file);
    
    // Basic KQL syntax validation
    if (content.trim() === '') {
        result.issues.push('KQL file is empty');
        result.status = 'fail';
    }
    
    // Check for common KQL keywords
    const kqlKeywords = ['let', 'datatable', 'extend', 'project', 'where', 'summarize', 'join', 'union'];
    const hasKQLKeywords = kqlKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (!hasKQLKeywords) {
        result.warnings.push('File does not appear to contain standard KQL syntax');
    }
    
    return result;
}

async function validateJSONFile(file, result) {
    const content = await readFileContent(file);
    
    try {
        const json = JSON.parse(content);
        
        // Check if it's an array (required for sample data)
        if (!Array.isArray(json)) {
            result.issues.push('JSON file must contain an array of sample records');
            result.status = 'fail';
        } else if (json.length === 0) {
            result.warnings.push('JSON array is empty');
        }
        
    } catch (error) {
        result.status = 'fail';
        result.issues.push('Invalid JSON format: ' + error.message);
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
                                        </div>                        <div class="col-3">
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
            
            <!-- Detailed Results -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                <i class="fas fa-list-alt me-2"></i>Detailed Validation Results
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
    const results = validationResults; // Assuming this is stored globally
    const result = results[resultIndex];
    
    if (!result || !result.originalContent) {
        alert('File content not available');
        return;
    }
    
    // Find the specific issue or warning for this location
    const issue = result.issues.find(issue => issue.location === location);
    const warning = result.warnings ? result.warnings.find(warning => warning.location === location) : null;
    const problemItem = issue || warning;
    
    if (!problemItem) {
        alert('Could not find the specific issue or warning for this location');
        return;
    }
    
    // Create a modal to show the file content
    const modalId = 'fileContentModal';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">File Content - ${result.filename}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <small class="text-muted">Issue location: <code>${location}</code></small>
                        </div>
                        <div id="fileContentContainer"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${problemItem && problemItem.suggestion ? `
                            <button type="button" class="btn btn-success" onclick="applyFix('${resultIndex}', '${location}')">
                                <i class="fas fa-magic"></i> Apply Suggested Fix
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update the modal content
    const container = document.getElementById('fileContentContainer');
    container.innerHTML = highlightFileContent(result.originalContent, location, problemItem);
    
    document.querySelector('#fileContentModal .modal-title').textContent = `File Content - ${result.filename}`;
    document.querySelector('#fileContentModal .text-muted').innerHTML = `${issue ? 'Issue' : 'Warning'} location: <code>${location}</code>`;
    
    // Show the modal
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            
            // Scroll to problematic line after modal is fully shown
            modal.addEventListener('shown.bs.modal', function() {
                scrollToProblematicLine(location, problemItem);
            }, { once: true }); // Use once to avoid multiple event listeners
        } else {
            modal.style.display = 'block';
            modal.classList.add('show');
            
           
            setTimeout(() => {
                scrollToProblematicLine(location, problemItem);
            }, 300);
        }
    } catch (error) {
        modal.style.display = 'block';
        modal.classList.add('show');
        
        // Scroll to problematic line after a short delay for fallback modals
        setTimeout(() => {
            scrollToProblematicLine(location, problemItem);
        }, 300);
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
        
        let highlightedContent = '';
        
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const isProblematicLine = problemLine && problemLine.lineNumber === lineNumber;
            
            if (isProblematicLine) {
                // Highlight the problematic line
                highlightedContent += `<div class="code-line problem-line ${problemType}-line" id="problematic-line-${lineNumber}" data-line="${lineNumber}">`;
                highlightedContent += `<span class="line-number ${problemType}-number">${lineNumber}</span>`;
                highlightedContent += `<span class="line-content">${escapeHtml(line)}</span>`;
                highlightedContent += `<span class="problem-indicator ${problemType}-indicator">`;
                highlightedContent += `<i class="fas fa-${isWarning ? 'exclamation-triangle' : 'times-circle'}"></i> `;
                highlightedContent += `<span class="problem-text">${isWarning ? 'WARNING' : 'ERROR'}</span>`;
                highlightedContent += `</span>`;
                highlightedContent += '</div>';
                
                // Add suggested fix or type recommendations
                if (problemItem && (problemItem.suggestion || problemItem.currentValue)) {
                    const fixedLine = generateFixedLine(line, problemItem, location);
                    if (fixedLine && fixedLine !== line) {
                        highlightedContent += `<div class="code-line fix-line">`;
                        highlightedContent += `<span class="line-number fix-number">+${lineNumber}</span>`;
                        highlightedContent += `<span class="line-content">${escapeHtml(fixedLine)}</span>`;
                        highlightedContent += `<span class="fix-indicator">`;
                        highlightedContent += `<i class="fas fa-check"></i> `;
                        highlightedContent += `<span class="fix-text">${isWarning ? 'SUGGESTED' : 'FIXED'}</span>`;
                        highlightedContent += `</span>`;
                        highlightedContent += '</div>';
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
    
    // Parse the location to understand what we're looking for
    const locationParts = location.split('.');
    let searchTerm = '';
    
    if (location.includes('description')) {
        searchTerm = '"description"';
    } else if (location.includes('simplifiedSchemaVersion')) {
        searchTerm = '"simplifiedSchemaVersion"';
    } else if (location.includes('input[]')) {
        const inputIndex = location.match(/input\[(\d+)\]/)?.[1];
        if (inputIndex) {
            searchTerm = '"input"';
        }
    } else if (location.includes('columns[]')) {
        const colIndex = location.match(/columns\[(\d+)\]/)?.[1];
        if (colIndex) {
            searchTerm = '"columns"';
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
                    searchTerm: issue.currentValue
                };
            }
        }
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
            
            // Capitalize first letter
            if (!currentValue.charAt(0).match(/[A-Z]/)) {
                fixedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
            }
            
            // Add period at the end
            if (!fixedValue.endsWith('.')) {
                fixedValue = fixedValue + '.';
            }
            
            fixedLine = originalLine.replace(`"${currentValue}"`, `"${fixedValue}"`);
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
            const suggestedValue = generateFixedValue(issue);
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
    alert('Auto-fix functionality would modify your file. For now, please manually apply the suggested changes.');
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
    alert('Function called for: ' + validationType);
    
    const detailsElement = document.getElementById(validationType + '-details');
    
    if (!detailsElement) {
        alert('Element not found: ' + validationType + '-details');
        return;
    }
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        alert('Showing details for: ' + validationType);
    } else {
        detailsElement.style.display = 'none';
        alert('Hiding details for: ' + validationType);
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

// Test function immediately
document.addEventListener('DOMContentLoaded', function() {
});

// Test function accessibility
window.testToggle = function() {
    toggleValidationDetails('folder');
};


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
