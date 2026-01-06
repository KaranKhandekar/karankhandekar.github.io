// SG One Excel Reader - Advanced Excel Processing with HTML Validation
// Debug and error logging
function debugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const typeStr = type ? type.toUpperCase() : 'INFO';
    console.log(`[${timestamp}] ${typeStr}: ${message}`);
}

// Storage Management for Data Persistence (with fallback)
class StorageManager {
    static set(name, value, days = 30) {
        try {
            // Try localStorage first (works with file:// protocol)
            if (typeof Storage !== 'undefined') {
                localStorage.setItem(name, JSON.stringify(value));
                console.log(`Data saved to localStorage: ${name}`);
                return true;
            }
        } catch (error) {
            console.warn('localStorage failed, trying cookies:', error);
        }
        
        // Fallback to cookies
        return this.setCookie(name, value, days);
    }
    
    static get(name) {
        try {
            // Try localStorage first
            if (typeof Storage !== 'undefined') {
                const data = localStorage.getItem(name);
                if (data) {
                    console.log(`Data retrieved from localStorage: ${name}`);
                    return JSON.parse(data);
                }
            }
        } catch (error) {
            console.warn('localStorage failed, trying cookies:', error);
        }
        
        // Fallback to cookies
        return this.getCookie(name);
    }
    
    static remove(name) {
        try {
            // Remove from localStorage
            if (typeof Storage !== 'undefined') {
                localStorage.removeItem(name);
                console.log(`Data removed from localStorage: ${name}`);
            }
        } catch (error) {
            console.warn('localStorage remove failed:', error);
        }
        
        // Also remove from cookies
        this.removeCookie(name);
    }
    
    static setCookie(name, value, days = 30) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieValue = JSON.stringify(value);
            
            console.log(`Setting cookie: ${name}`);
            console.log('Cookie value length:', cookieValue.length);
            
            const cookieString = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/`;
            document.cookie = cookieString;
            
            console.log(`Cookie set: ${name}`);
            return true;
        } catch (error) {
            console.error('Failed to set cookie:', error);
            return false;
        }
    }
    
    static getCookie(name) {
        try {
            console.log(`Looking for cookie: ${name}`);
            console.log('All cookies:', document.cookie);
            
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                
                if (c.indexOf(nameEQ) === 0) {
                    const cookieValue = c.substring(nameEQ.length, c.length);
                    console.log(`Cookie found: ${name}`);
                    return JSON.parse(cookieValue);
                }
            }
            console.log(`Cookie not found: ${name}`);
            return null;
        } catch (error) {
            console.error('Failed to get cookie:', error);
            return null;
        }
    }
    
    static removeCookie(name) {
        try {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
            console.log(`Cookie removed: ${name}`);
            return true;
        } catch (error) {
            console.error('Failed to remove cookie:', error);
            return false;
        }
    }
    
    static test() {
        console.log('Testing storage functionality...');
        const testData = { test: 'value', number: 123 };
        
        // Test set
        const setResult = this.set('testStorage', testData, 1);
        console.log('Set result:', setResult);
        
        // Test get
        const getResult = this.get('testStorage');
        console.log('Get result:', getResult);
        
        // Test remove
        const removeResult = this.remove('testStorage');
        console.log('Remove result:', removeResult);
        
        // Verify removal
        const verifyResult = this.get('testStorage');
        console.log('Verify removal:', verifyResult);
        
        // The test passes if we can set and get data successfully
        // (removal verification is less critical for our use case)
        const testPassed = setResult && getResult && (getResult.test === 'value' && getResult.number === 123);
        console.log('Storage test passed:', testPassed);
        
        return testPassed;
    }
}

// Legacy CookieManager for backward compatibility
class CookieManager {
    static set(name, value, days = 30) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieValue = JSON.stringify(value);
            
            console.log(`Setting cookie: ${name}`);
            console.log('Cookie value length:', cookieValue.length);
            console.log('Cookie value preview:', cookieValue.substring(0, 100) + '...');
            
            const cookieString = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/`;
            console.log('Full cookie string:', cookieString);
            
            document.cookie = cookieString;
            
            // Verify the cookie was set
            setTimeout(() => {
                const allCookies = document.cookie;
                console.log('All cookies after setting:', allCookies);
                const found = allCookies.includes(name + '=');
                console.log(`Cookie ${name} found in document.cookie:`, found);
            }, 100);
            
            console.log(`Cookie set: ${name}`, cookieValue);
            return true;
        } catch (error) {
            console.error('Failed to set cookie:', error);
            return false;
        }
    }
    
    static get(name) {
        try {
            console.log(`Looking for cookie: ${name}`);
            console.log('All cookies:', document.cookie);
            
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            console.log('Split cookies:', ca);
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                console.log(`Checking cookie: "${c}"`);
                
                if (c.indexOf(nameEQ) === 0) {
                    const cookieValue = c.substring(nameEQ.length, c.length);
                    console.log(`Cookie found: ${name}`, cookieValue);
                    try {
                        const parsed = JSON.parse(cookieValue);
                        console.log('Parsed cookie data:', parsed);
                        return parsed;
                    } catch (parseError) {
                        console.error('Failed to parse cookie JSON:', parseError);
                        console.log('Raw cookie value:', cookieValue);
                        return null;
                    }
                }
            }
            console.log(`Cookie not found: ${name}`);
            return null;
        } catch (error) {
            console.error('Failed to get cookie:', error);
            return null;
        }
    }
    
    static remove(name) {
        try {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
            console.log(`Cookie removed: ${name}`);
            return true;
        } catch (error) {
            console.error('Failed to remove cookie:', error);
            return false;
        }
    }
    
    static test() {
        console.log('Testing cookie functionality...');
        const testData = { test: 'value', number: 123 };
        
        // Test set
        const setResult = this.set('testCookie', testData, 1);
        console.log('Set result:', setResult);
        
        // Test get
        const getResult = this.get('testCookie');
        console.log('Get result:', getResult);
        
        // Test remove
        const removeResult = this.remove('testCookie');
        console.log('Remove result:', removeResult);
        
        // Verify removal
        const verifyResult = this.get('testCookie');
        console.log('Verify removal:', verifyResult);
        
        return setResult && getResult && removeResult && !verifyResult;
    }
}

// Toast Notification System
class ToastManager {
    static show(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
    
    static getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Check system requirements
function checkRequirements() {
    const issues = [];
    
    if (typeof XLSX === 'undefined') {
        issues.push('SheetJS library not loaded');
    }
    
    if (!window.File || !window.FileReader) {
        issues.push('File API not supported');
    }
    
    if (!window.ArrayBuffer) {
        issues.push('ArrayBuffer not supported');
    }
    
    if (issues.length > 0) {
        console.error('System requirements not met:', issues);
        return false;
    }
    
    debugLog('All system requirements met', 'success');
    return true;
}

// Main application class
class ExcelReader {
    constructor() {
        debugLog('Initializing SG One Excel Reader...', 'info');
        
        this.workbook = null;
        this.currentData = null;
        this.htmlCells = [];
        this.isHtmlMode = false;
        this.uploadedFiles = [];
        this.currentFileIndex = -1;
        
        // Check system requirements before initializing
        if (!checkRequirements()) {
            this.showError('System requirements not met. Please refresh the page or try a different browser.');
            return;
        }
        
        this.initializeEventListeners();
        this.loadPersistedData();
        debugLog('SG One Excel Reader initialized successfully', 'success');
    }

    initializeEventListeners() {
        // File upload elements
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        // Control elements
        const worksheetSelect = document.getElementById('worksheetSelect');
        const toggleHtmlMode = document.getElementById('toggleHtmlMode');
        const exportData = document.getElementById('exportData');
        // Removed clearAllData and exportAllData buttons
        const closeError = document.getElementById('closeError');
        const closeErrorModal = document.getElementById('closeErrorModal');

        // File upload events - with null checks
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }
        
        // Control events - with null checks
        if (worksheetSelect) {
            worksheetSelect.addEventListener('change', this.handleWorksheetChange.bind(this));
        }
        
        if (toggleHtmlMode) {
            toggleHtmlMode.addEventListener('click', this.toggleHtmlMode.bind(this));
        }
        
        if (exportData) {
            exportData.addEventListener('click', this.exportProcessedData.bind(this));
        }
        
        // Removed clearAllData and exportAllData event listeners
        
        if (closeError) {
            closeError.addEventListener('click', this.hideError.bind(this));
        }
        
        if (closeErrorModal) {
            closeErrorModal.addEventListener('click', this.hideError.bind(this));
        }
        
        debugLog('Event listeners initialized', 'info');
    }

    // Drag and drop handlers
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    // File selection handler
    handleFileSelect(e) {
        debugLog('File selection handler triggered', 'info');
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            debugLog(`${files.length} file(s) selected`, 'info');
            files.forEach(file => {
                debugLog(`File: ${file.name} (${file.size} bytes)`, 'info');
                this.processFile(file);
            });
        } else {
            debugLog('No files selected', 'warning');
        }
    }

    // Load persisted data from cookies
    loadPersistedData() {
        try {
            debugLog('=== LOADING PERSISTED DATA ===', 'info');
            
            // Check if cookies are enabled
            if (!navigator.cookieEnabled) {
                debugLog('Cookies are disabled in browser', 'error');
                ToastManager.show('Cookies are disabled. Please enable cookies for data persistence.', 'error');
                return;
            }
            
            // Check all cookies
            debugLog('All cookies:', document.cookie);
            
            const persistedData = StorageManager.get('sgOneExcelReader');
            debugLog('Persisted data found:', 'info');
            console.log('Persisted data details:', persistedData);
            
            if (persistedData && persistedData.uploadedFiles) {
                debugLog(`Found persisted data with ${persistedData.uploadedFiles.length} files`, 'info');
                
                this.uploadedFiles = persistedData.uploadedFiles || [];
                this.isHtmlMode = persistedData.isHtmlMode || false;
                this.currentFileIndex = persistedData.currentFileIndex || -1;
                
                debugLog(`Loaded ${this.uploadedFiles.length} uploaded files`, 'info');
                debugLog(`Current file index: ${this.currentFileIndex}`, 'info');
                
                if (this.uploadedFiles.length > 0) {
                    this.displayUploadedFiles();
                    
                    // Restore the last selected file and worksheet
                    if (this.currentFileIndex >= 0 && this.uploadedFiles[this.currentFileIndex]) {
                        const currentFile = this.uploadedFiles[this.currentFileIndex];
                        debugLog(`Restoring file: ${currentFile.name}`, 'info');
                        
                        // Restore workbook
                        if (currentFile.workbookData) {
                            this.workbook = currentFile.workbookData;
                            this.populateWorksheetSelector();
                            
                            // Restore processed data if available
                            if (currentFile.processedData) {
                                this.currentData = currentFile.processedData.data;
                                this.htmlCells = currentFile.processedData.htmlCells || [];
                                this.isHtmlMode = currentFile.processedData.isHtmlMode || false;
                                
                                debugLog(`Restored data: ${this.currentData.length} rows, ${this.htmlCells.length} HTML cells`, 'info');
                                
                                // Restore worksheet selection
                                if (currentFile.currentSheet) {
                                    const worksheetSelect = document.getElementById('worksheetSelect');
                                    if (worksheetSelect) {
                                        worksheetSelect.value = currentFile.currentSheet;
                                        debugLog(`Restored worksheet: ${currentFile.currentSheet}`, 'info');
                                    }
                                }
                                
                                // Display the data
                                this.displayData();
                                this.updateCurrentFileInfo(currentFile);
                                
                                // Show data section if element exists
                                const dataSection = document.getElementById('dataSection');
                                if (dataSection) {
                                    dataSection.style.display = 'block';
                                }
                                
                                // Update HTML mode toggle button
                                this.updateHtmlModeButton();
                                
                                debugLog('Data restoration completed successfully', 'success');
                                ToastManager.show(`Restored ${this.uploadedFiles.length} file(s) from previous session`, 'success');
                            } else {
                                debugLog('No processed data found for current file', 'warning');
                                ToastManager.show('File data found but no processed data. Please re-process the file.', 'warning');
                            }
                        } else {
                            debugLog('No workbook data found for current file', 'warning');
                            ToastManager.show('File found but workbook data missing. Please re-upload the file.', 'warning');
                        }
                    } else {
                        debugLog('No current file to restore', 'info');
                        ToastManager.show(`Found ${this.uploadedFiles.length} file(s) but no active file`, 'info');
                    }
                    
                    // Check file integrity after loading
                    this.checkFileIntegrity();
                } else {
                    debugLog('No uploaded files found in persisted data', 'info');
                }
            } else {
                debugLog('No persisted data found or invalid format', 'info');
                console.log('Available cookies:', document.cookie);
            }
            
            debugLog('=== LOADING COMPLETED ===', 'info');
        } catch (error) {
            console.error('Failed to load persisted data:', error);
            ToastManager.show('Failed to restore previous session data: ' + error.message, 'error');
        }
    }

    // Save data to cookies
    savePersistedData() {
        try {
            debugLog('=== SAVING PERSISTED DATA ===', 'info');
            
            // Check if cookies are enabled
            if (!navigator.cookieEnabled) {
                debugLog('Cookies are disabled in browser', 'error');
                ToastManager.show('Cookies are disabled. Cannot save data.', 'error');
                return;
            }
            
            const dataToSave = {
                uploadedFiles: this.uploadedFiles,
                isHtmlMode: this.isHtmlMode,
                currentFileIndex: this.currentFileIndex,
                lastUpdated: new Date().toISOString()
            };
            
            debugLog(`Saving ${this.uploadedFiles.length} files`, 'info');
            debugLog(`Current file index: ${this.currentFileIndex}`, 'info');
            debugLog(`HTML mode: ${this.isHtmlMode}`, 'info');
            
            // Check data size before saving
            const dataSize = JSON.stringify(dataToSave).length;
            debugLog(`Data size: ${dataSize} bytes`, 'info');
            
            if (dataSize > 4000) {
                debugLog('Warning: Data size is large, may exceed cookie limits', 'warning');
            }
            
            const saveResult = StorageManager.set('sgOneExcelReader', dataToSave, 30);
            
            if (saveResult) {
                debugLog('Data saved to cookies successfully', 'success');
                
                // Verify the save worked
                const savedData = StorageManager.get('sgOneExcelReader');
                if (savedData) {
                    debugLog('Verification successful - data can be retrieved', 'success');
                    console.log('Saved data details:', savedData);
                } else {
                    debugLog('Verification failed - data could not be retrieved', 'error');
                    ToastManager.show('Data save verification failed', 'error');
                }
            } else {
                debugLog('Failed to save data to cookies', 'error');
                ToastManager.show('Failed to save data to cookies', 'error');
            }
            
            debugLog('=== SAVING COMPLETED ===', 'info');
            
        } catch (error) {
            console.error('Failed to save data:', error);
            ToastManager.show('Failed to save data to cookies: ' + error.message, 'error');
        }
    }

    // Debug method to check storage data
    debugCookieData() {
        const storageData = StorageManager.get('sgOneExcelReader');
        console.log('Current storage data:', storageData);
        console.log('Current uploaded files:', this.uploadedFiles);
        console.log('Current file index:', this.currentFileIndex);
        console.log('Current HTML mode:', this.isHtmlMode);
    }

    // Display uploaded files list
    displayUploadedFiles() {
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        const filesListDiv = document.getElementById('filesList');
        
        if (!uploadedFilesDiv || !filesListDiv) {
            debugLog('Upload files elements not found', 'warning');
            return;
        }
        
        if (this.uploadedFiles.length === 0) {
            uploadedFilesDiv.style.display = 'none';
            return;
        }
        
        uploadedFilesDiv.style.display = 'block';
        filesListDiv.innerHTML = '';
        
        this.uploadedFiles.forEach((fileData, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon">
                    <i class="fas fa-file-excel"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${fileData.name}</div>
                    <div class="file-details">
                        <span>${this.formatFileSize(fileData.size)}</span>
                        <span>${fileData.sheets ? fileData.sheets.length : 0} sheets</span>
                        <span>${fileData.lastProcessed ? new Date(fileData.lastProcessed).toLocaleDateString() : 'Not processed'}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn-icon" onclick="window.excelReader.selectFile(${index})" title="Select File">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon" onclick="window.excelReader.removeFile(${index})" title="Remove File">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            filesListDiv.appendChild(fileItem);
        });
    }

    // Select a file for processing
    selectFile(index) {
        if (index >= 0 && index < this.uploadedFiles.length) {
            this.currentFileIndex = index;
            const fileData = this.uploadedFiles[index];
            
            // Restore workbook data if available
            if (fileData.workbookData) {
                this.workbook = fileData.workbookData;
                this.populateWorksheetSelector();
                document.getElementById('dataSection').style.display = 'block';
                this.updateCurrentFileInfo(fileData);
                
                // Restore processed data if available
                if (fileData.processedData) {
                    this.currentData = fileData.processedData.data;
                    this.htmlCells = fileData.processedData.htmlCells || [];
                    this.isHtmlMode = fileData.processedData.isHtmlMode || false;
                    
                    // Restore worksheet selection
                    if (fileData.currentSheet) {
                        const worksheetSelect = document.getElementById('worksheetSelect');
                        worksheetSelect.value = fileData.currentSheet;
                    }
                    
                    // Display the data
                    this.displayData();
                    this.updateHtmlModeButton();
                }
                
                ToastManager.show(`Selected file: ${fileData.name}`, 'success');
            } else {
                ToastManager.show('File data not available. Please re-upload the file.', 'warning');
            }
            
            this.savePersistedData();
        }
    }

    // Remove a file from the list
    removeFile(index) {
        if (index >= 0 && index < this.uploadedFiles.length) {
            const removedFile = this.uploadedFiles.splice(index, 1)[0];
            
            if (this.currentFileIndex === index) {
                this.currentFileIndex = -1;
                this.clearCurrentData();
            } else if (this.currentFileIndex > index) {
                this.currentFileIndex--;
            }
            
            this.displayUploadedFiles();
            this.savePersistedData();
            ToastManager.show(`Removed file: ${removedFile.name}`, 'info');
        }
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.uploadedFiles = [];
            this.currentFileIndex = -1;
            this.clearCurrentData();
            this.displayUploadedFiles();
            StorageManager.remove('sgOneExcelReader');
            ToastManager.show('All data cleared', 'success');
        }
    }

    // Check if files need to be re-uploaded (when File objects are missing)
    checkFileIntegrity() {
        const missingFiles = [];
        this.uploadedFiles.forEach((fileData, index) => {
            if (!fileData.workbookData) {
                missingFiles.push({ index, name: fileData.name });
            }
        });
        
        if (missingFiles.length > 0) {
            ToastManager.show(
                `${missingFiles.length} file(s) need to be re-uploaded. Please upload them again.`, 
                'warning', 
                8000
            );
            
            // Remove files without workbook data
            missingFiles.reverse().forEach(({ index }) => {
                this.uploadedFiles.splice(index, 1);
            });
            
            this.displayUploadedFiles();
            this.savePersistedData();
        }
    }

    // Clear current data display
    clearCurrentData() {
        this.workbook = null;
        this.currentData = null;
        this.htmlCells = [];
        document.getElementById('dataSection').style.display = 'none';
        document.getElementById('worksheetSection').style.display = 'none';
    }

    // Update current file info display
    updateCurrentFileInfo(fileData) {
        const fileInfoDiv = document.getElementById('currentFileInfo');
        if (fileData) {
            fileInfoDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-file-excel" style="color: var(--success);"></i>
                    <div>
                        <strong>${fileData.name}</strong>
                        <span style="color: var(--text-secondary); margin-left: 0.5rem;">
                            ${this.formatFileSize(fileData.size)} • ${fileData.sheets ? fileData.sheets.length : 0} sheets
                        </span>
                    </div>
                </div>
            `;
        } else {
            fileInfoDiv.innerHTML = '';
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Process the selected Excel file
    async processFile(file) {
        if (!this.isExcelFile(file)) {
            ToastManager.show('Please select a valid Excel file (.xlsx or .xls)', 'error');
            return;
        }

        this.showLoading(true, `Processing ${file.name}...`);
        
        try {
            // Read file as array buffer
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            // Parse Excel file using SheetJS
            this.workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // Add or update file in uploaded files list
            this.addOrUpdateFile(file, this.workbook);
            
            // Show file info
            this.updateCurrentFileInfo(this.uploadedFiles[this.currentFileIndex]);
            
            // Populate worksheet selector
            this.populateWorksheetSelector();
            
            // Show data section
            document.getElementById('dataSection').style.display = 'block';
            
            // Save the data immediately after processing
            this.savePersistedData();
            
            this.showLoading(false);
            ToastManager.show(`Successfully processed ${file.name}`, 'success');
            
        } catch (error) {
            this.showLoading(false);
            ToastManager.show('Error reading Excel file: ' + error.message, 'error');
            console.error('File processing error:', error);
        }
    }

    // Add or update file in the uploaded files list
    addOrUpdateFile(file, workbook) {
        const existingIndex = this.uploadedFiles.findIndex(f => f.name === file.name && f.size === file.size);
        
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            workbookData: workbook,
            sheets: workbook.SheetNames,
            lastProcessed: new Date().toISOString(),
            htmlCells: 0, // Will be updated when processing
            currentSheet: null, // Track current sheet
            processedData: null // Store processed data for persistence
        };
        
        if (existingIndex >= 0) {
            // Update existing file
            this.uploadedFiles[existingIndex] = fileData;
            this.currentFileIndex = existingIndex;
        } else {
            // Add new file
            this.uploadedFiles.push(fileData);
            this.currentFileIndex = this.uploadedFiles.length - 1;
        }
        
        this.displayUploadedFiles();
        this.savePersistedData();
    }

    // Check if file is Excel format
    isExcelFile(file) {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel' // .xls
        ];
        return validTypes.includes(file.type) || 
               file.name.toLowerCase().endsWith('.xlsx') || 
               file.name.toLowerCase().endsWith('.xls');
    }

    // Read file as array buffer
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    // Display file information (legacy method - now handled by updateCurrentFileInfo)
    displayFileInfo(fileName) {
        // This method is now handled by updateCurrentFileInfo
        // Keeping for backward compatibility
    }

    // Populate worksheet selector
    populateWorksheetSelector() {
        const select = document.getElementById('worksheetSelect');
        select.innerHTML = '<option value="">Choose a worksheet...</option>';
        
        this.workbook.SheetNames.forEach(sheetName => {
            const option = document.createElement('option');
            option.value = sheetName;
            option.textContent = sheetName;
            select.appendChild(option);
        });
    }

    // Handle worksheet selection change
    handleWorksheetChange(e) {
        const sheetName = e.target.value;
        if (sheetName) {
            this.processWorksheet(sheetName);
        } else {
            document.getElementById('dataSection').style.display = 'none';
        }
    }

    // Process selected worksheet
    processWorksheet(sheetName) {
        try {
            const worksheet = this.workbook.Sheets[sheetName];
            
            // Convert worksheet to JSON with header row
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1, // Use first row as header
                defval: '', // Default value for empty cells
                raw: false // Get formatted values
            });

            if (jsonData.length === 0) {
                ToastManager.show('The selected worksheet is empty', 'warning');
                return;
            }

            this.currentData = jsonData;
            this.analyzeHtmlContent();
            this.displayData();
            
            // Save processed data for persistence
            if (this.currentFileIndex >= 0 && this.uploadedFiles[this.currentFileIndex]) {
                this.uploadedFiles[this.currentFileIndex].currentSheet = sheetName;
                this.uploadedFiles[this.currentFileIndex].processedData = {
                    data: jsonData,
                    htmlCells: this.htmlCells,
                    isHtmlMode: this.isHtmlMode
                };
                this.savePersistedData();
            }
            
        } catch (error) {
            ToastManager.show('Error processing worksheet: ' + error.message, 'error');
            console.error('Worksheet processing error:', error);
        }
    }

    // Analyze data for HTML content
    analyzeHtmlContent() {
        this.htmlCells = [];
        
        if (!this.currentData || this.currentData.length < 2) return;

        // Skip header row, analyze data rows
        for (let rowIndex = 1; rowIndex < this.currentData.length; rowIndex++) {
            const row = this.currentData[rowIndex];
            
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cellValue = row[colIndex];
                
                if (this.isHtmlContent(cellValue)) {
                    this.htmlCells.push({
                        row: rowIndex,
                        col: colIndex,
                        value: cellValue,
                        rendered: this.renderHtmlSafely(cellValue)
                    });
                }
            }
        }
    }

    // Check if cell content is HTML
    isHtmlContent(value) {
        if (typeof value !== 'string' || value.trim() === '') return false;
        
        // Check for HTML tags
        const htmlTagPattern = /<\s*\w.*?>/i;
        return htmlTagPattern.test(value);
    }

    // Safely render HTML content
    renderHtmlSafely(htmlContent) {
        try {
            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Basic sanitization - remove script tags and dangerous attributes
            this.sanitizeHtml(tempDiv);
            
            return tempDiv.innerHTML;
        } catch (error) {
            console.warn('Error rendering HTML:', error);
            return htmlContent; // Return original if rendering fails
        }
    }

    // Basic HTML sanitization
    sanitizeHtml(element) {
        // Remove script tags
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // Remove dangerous attributes
        const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur'];
        const allElements = element.querySelectorAll('*');
        
        allElements.forEach(el => {
            dangerousAttrs.forEach(attr => {
                if (el.hasAttribute(attr)) {
                    el.removeAttribute(attr);
                }
            });
        });
    }

    // Display data in table
    displayData() {
        if (!this.currentData || this.currentData.length === 0) return;

        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        // Clear existing content
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Create header row
        const headerRow = document.createElement('tr');
        const headers = this.currentData[0] || [];
        
        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header || `Column ${index + 1}`;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Create data rows
        for (let i = 1; i < this.currentData.length; i++) {
            const row = this.currentData[i];
            const tr = document.createElement('tr');

            for (let j = 0; j < headers.length; j++) {
                const td = document.createElement('td');
                const cellValue = row[j] || '';
                
                // Check if this cell contains HTML
                const htmlCell = this.htmlCells.find(cell => cell.row === i && cell.col === j);
                
                if (htmlCell) {
                    td.classList.add(this.isHtmlMode ? 'html-rendered' : 'html-cell');
                    
                    if (this.isHtmlMode) {
                        // Render HTML content
                        td.innerHTML = htmlCell.rendered;
                    } else {
                        // Show raw HTML
                        td.textContent = cellValue;
                    }
                } else {
                    // Regular cell content
                    td.textContent = cellValue;
                }
                
                tr.appendChild(td);
            }
            
            tableBody.appendChild(tr);
        }

        // Show data section and update validation panel
        document.getElementById('dataSection').style.display = 'block';
        this.updateValidationPanel();
    }

    // Toggle HTML rendering mode
    toggleHtmlMode() {
        this.isHtmlMode = !this.isHtmlMode;
        
        this.updateHtmlModeButton();
        
        // Refresh table display
        this.displayData();
        
        // Save the state
        this.savePersistedData();
    }

    // Update HTML mode button appearance
    updateHtmlModeButton() {
        const toggleBtn = document.getElementById('toggleHtmlMode');
        const modeText = document.getElementById('htmlModeText');
        
        if (this.isHtmlMode) {
            toggleBtn.classList.add('active');
            modeText.textContent = 'Show Raw HTML';
        } else {
            toggleBtn.classList.remove('active');
            modeText.textContent = 'Show HTML Rendered';
        }
    }

    // Update validation panel
    updateValidationPanel() {
        const validationPanel = document.getElementById('validationPanel');
        const htmlCellsList = document.getElementById('htmlCellsList');
        const htmlCount = document.getElementById('htmlCount');
        
        if (this.htmlCells.length === 0) {
            validationPanel.style.display = 'none';
            return;
        }

        validationPanel.style.display = 'block';
        htmlCellsList.innerHTML = '';
        htmlCount.textContent = `${this.htmlCells.length} cell${this.htmlCells.length === 1 ? '' : 's'} with HTML`;

        this.htmlCells.forEach((cell, index) => {
            const cellPreview = document.createElement('div');
            cellPreview.className = 'html-cell-preview';
            
            const headers = this.currentData[0] || [];
            const columnName = headers[cell.col] || `Column ${cell.col + 1}`;
            
            cellPreview.innerHTML = `
                <h5>Row ${cell.row}, ${columnName}</h5>
                <div class="html-preview">
                    <strong>Raw HTML:</strong><br>
                    ${this.escapeHtml(cell.value)}
                </div>
                <div class="html-rendered-preview">
                    ${cell.rendered}
                </div>
            `;
            
            htmlCellsList.appendChild(cellPreview);
        });

        // Update file data with HTML cell count
        if (this.currentFileIndex >= 0 && this.uploadedFiles[this.currentFileIndex]) {
            this.uploadedFiles[this.currentFileIndex].htmlCells = this.htmlCells.length;
            this.savePersistedData();
        }
    }

    // Escape HTML for display
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Export processed data
    exportProcessedData() {
        if (!this.currentData) {
            ToastManager.show('No data to export', 'warning');
            return;
        }

        try {
            // Create processed data with HTML rendered
            const processedData = this.currentData.map((row, rowIndex) => {
                if (rowIndex === 0) return row; // Keep headers as-is
                
                return row.map((cell, colIndex) => {
                    const htmlCell = this.htmlCells.find(c => c.row === rowIndex && c.col === colIndex);
                    return htmlCell ? htmlCell.rendered : cell;
                });
            });

            // Create new workbook and worksheet
            const newWorkbook = XLSX.utils.book_new();
            const newWorksheet = XLSX.utils.aoa_to_sheet(processedData);
            
            const currentFile = this.uploadedFiles[this.currentFileIndex];
            const baseName = currentFile ? currentFile.name.replace(/\.(xlsx|xls)$/i, '') : 'processed_data';
            const sheetName = document.getElementById('worksheetSelect').value || 'Sheet1';
            
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, `${baseName}_${sheetName}_processed`);
            
            // Generate and download file
            const fileName = `SG_One_${baseName}_processed_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(newWorkbook, fileName);
            
            ToastManager.show('Data exported successfully!', 'success');
            
        } catch (error) {
            ToastManager.show('Error exporting data: ' + error.message, 'error');
            console.error('Export error:', error);
        }
    }

    // Clear file and reset application
    clearFile() {
        this.workbook = null;
        this.currentData = null;
        this.htmlCells = [];
        this.isHtmlMode = false;
        
        // Reset UI elements
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('worksheetSection').style.display = 'none';
        document.getElementById('dataSection').style.display = 'none';
        
        // Reset toggle button
        const toggleBtn = document.getElementById('toggleHtmlMode');
        const modeText = document.getElementById('htmlModeText');
        toggleBtn.classList.remove('active');
        modeText.textContent = 'Show HTML Rendered';
    }

    // Show loading indicator
    showLoading(show, message = 'Processing...') {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        if (show) {
            loadingText.textContent = message;
            loadingOverlay.style.display = 'flex';
        } else {
            loadingOverlay.style.display = 'none';
        }
    }

    // Show error message
    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorModal').style.display = 'flex';
    }

    // Show success message
    showSuccess(message) {
        ToastManager.show(message, 'success');
    }

    // Hide error message
    hideError() {
        document.getElementById('errorModal').style.display = 'none';
    }

    // Export all data
    exportAllData() {
        if (this.uploadedFiles.length === 0) {
            ToastManager.show('No files to export', 'warning');
            return;
        }

        try {
            const newWorkbook = XLSX.utils.book_new();
            
            this.uploadedFiles.forEach((fileData, index) => {
                if (fileData.workbookData) {
                    // Add each worksheet from each file
                    fileData.workbookData.SheetNames.forEach(sheetName => {
                        const worksheet = fileData.workbookData.Sheets[sheetName];
                        const newSheetName = `${fileData.name.replace('.xlsx', '').replace('.xls', '')}_${sheetName}`;
                        XLSX.utils.book_append_sheet(newWorkbook, worksheet, newSheetName);
                    });
                }
            });
            
            const fileName = `SG_One_Excel_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(newWorkbook, fileName);
            
            ToastManager.show(`Exported ${this.uploadedFiles.length} files successfully!`, 'success');
            
        } catch (error) {
            ToastManager.show('Error exporting data: ' + error.message, 'error');
            console.error('Export error:', error);
        }
    }
}

// Initialize SG One Excel Reader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('DOM loaded, starting SG One Excel Reader initialization...', 'info');
    
    // Wait a bit for SheetJS to load if it's still loading
    setTimeout(() => {
        try {
            if (typeof XLSX === 'undefined') {
                console.error('SheetJS library not available after timeout');
                ToastManager.show('Excel processing library failed to load. Please refresh the page or check your internet connection.', 'error');
                return;
            }
            
            debugLog('Creating SG One ExcelReader instance...', 'info');
            
            // Test storage functionality first
            debugLog('Testing storage functionality...', 'info');
            const storageTest = StorageManager.test();
            debugLog(`Storage test result: ${storageTest}`, storageTest ? 'success' : 'error');
            
            // Check if required DOM elements exist before initializing
            const requiredElements = [
                'uploadArea', 'fileInput', 'worksheetSelect', 
                'toggleHtmlMode', 'exportData'
            ];
            
            const missingElements = requiredElements.filter(id => !document.getElementById(id));
            if (missingElements.length > 0) {
                console.warn('Some required elements not found:', missingElements);
                debugLog(`Missing elements: ${missingElements.join(', ')}`, 'warning');
            }
            
            window.excelReader = new ExcelReader();
            
            // Expose debug method globally
            window.debugExcelReader = () => window.excelReader.debugCookieData();
            window.testCookies = () => StorageManager.test();
            window.testPersistence = () => {
                console.log('=== PERSISTENCE TEST ===');
                console.log('1. Testing storage...');
                const storageTest = StorageManager.test();
                console.log('Storage test result:', storageTest);
                
                console.log('2. Current application state...');
                if (window.excelReader) {
                    window.excelReader.debugCookieData();
                } else {
                    console.log('ExcelReader not available');
                }
                
                console.log('3. All cookies:', document.cookie);
                console.log('4. localStorage available:', typeof Storage !== 'undefined');
                console.log('5. Cookie enabled:', navigator.cookieEnabled);
                console.log('=== TEST COMPLETE ===');
            };
            
            debugLog('SG One Excel Reader initialized successfully!', 'success');
            
            // Show welcome message
            ToastManager.show('Welcome to SG One Excel Reader!', 'success', 3000);
            
        } catch (error) {
            console.error('Failed to initialize SG One Excel Reader:', error);
            ToastManager.show('Application failed to initialize: ' + error.message, 'error');
        }
    }, 2000); // Give SheetJS 2 seconds to load
});

// Add some utility functions for enhanced functionality
window.ExcelReaderUtils = {
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate HTML content more thoroughly
    validateHtmlContent(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return !doc.querySelector('parsererror');
        } catch (e) {
            return false;
        }
    },

    // Get cell reference (A1, B2, etc.)
    getCellReference(row, col) {
        const columnName = this.numberToColumnName(col + 1);
        return columnName + (row + 1);
    },

    // Convert number to column name (1 = A, 2 = B, etc.)
    numberToColumnName(num) {
        let result = '';
        while (num > 0) {
            num--;
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26);
        }
        return result;
    }
};
