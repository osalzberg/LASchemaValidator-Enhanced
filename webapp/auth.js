/**
 * MICROSOFT AZURE AD AUTHENTICATION MODULE
 * Simple redirect-based authentication for @microsoft.com domains
 */

// MSAL Configuration
const msalConfig = {
    auth: {
        clientId: '424384d7-e177-491c-aa56-365b4581f0d3',
        authority: 'https://login.microsoftonline.com/microsoft.onmicrosoft.com',
        redirectUri: window.location.origin + window.location.pathname,
        postLogoutRedirectUri: window.location.origin + window.location.pathname
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false
    }
};

// Login request configuration
const loginRequest = {
    scopes: ['openid', 'profile', 'email', 'User.Read']
};

// Initialize MSAL instance
let msalInstance;
let account = null;

/**
 * Initialize the authentication system
 */
async function initializeAuth() {
    try {
        if (typeof msal === 'undefined') {
            throw new Error('MSAL library is not loaded');
        }
        
        msalInstance = new msal.PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        
        // Handle redirect responses
        const response = await msalInstance.handleRedirectPromise();
        
        if (response) {
            account = response.account;
            await handleSuccessfulLogin(account);
        } else {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                account = accounts[0];
                if (await validateAccount(account)) {
                    await handleSuccessfulLogin(account);
                } else {
                    await signOut();
                }
            } else {
                showLoginScreen();
            }
        }
    } catch (error) {
        console.error('Authentication initialization error:', error);
        showLoginError('Failed to initialize authentication. Please refresh the page.');
        showLoginScreen();
    }
}

/**
 * Validate account has @microsoft.com email
 */
async function validateAccount(account) {
    try {
        const email = account.username || account.idTokenClaims?.preferred_username || account.idTokenClaims?.email;
        
        if (!email) {
            showLoginError('No email found in account.');
            return false;
        }
        
        if (!email.toLowerCase().endsWith('@microsoft.com')) {
            showLoginError('Access denied. Only @microsoft.com accounts are authorized.');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Account validation error:', error);
        showLoginError('Error validating account.');
        return false;
    }
}

/**
 * Handle successful login
 */
async function handleSuccessfulLogin(account) {
    try {
        if (!await validateAccount(account)) {
            return;
        }
        
        updateUserInfo(account);
        showMainApplication();
    } catch (error) {
        console.error('Error handling login:', error);
        showLoginError('Error processing login.');
    }
}

/**
 * Sign in function
 */
async function signIn() {
    try {
        if (!msalInstance) {
            throw new Error('MSAL not initialized');
        }
        
        showLoginProgress(true);
        hideLoginError();
        
        await msalInstance.loginRedirect(loginRequest);
        
    } catch (error) {
        console.error('Sign in error:', error);
        showLoginProgress(false);
        showLoginError('Sign in failed. Please try again.');
    }
}

/**
 * Sign out function
 */
async function signOut() {
    try {
        if (msalInstance && account) {
            account = null;
            await msalInstance.logoutRedirect();
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.error('Sign out error:', error);
        window.location.reload();
    }
}

/**
 * Update user info in UI
 */
function updateUserInfo(account) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userInfoElement = document.getElementById('userInfo');
    
    if (userNameElement && userEmailElement && userInfoElement) {
        const displayName = account.idTokenClaims?.name || account.name || 'User';
        const email = account.username || account.idTokenClaims?.preferred_username || account.idTokenClaims?.email;
        
        userNameElement.textContent = displayName;
        userEmailElement.textContent = email;
        userInfoElement.classList.remove('d-none');
    }
}

/**
 * Show login screen
 */
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const appContent = document.getElementById('appContent');
    const userInfo = document.getElementById('userInfo');
    
    if (loginScreen) loginScreen.classList.remove('d-none');
    if (appContent) appContent.classList.add('d-none');
    if (userInfo) userInfo.classList.add('d-none');
    
    showLoginProgress(false);
    hideLoginError();
}

/**
 * Show main application
 */
function showMainApplication() {
    const loginScreen = document.getElementById('loginScreen');
    const appContent = document.getElementById('appContent');
    
    if (loginScreen) loginScreen.classList.add('d-none');
    if (appContent) appContent.classList.remove('d-none');
}

/**
 * Show/hide login progress
 */
function showLoginProgress(show) {
    const loginProgress = document.getElementById('loginProgress');
    const signInButton = document.getElementById('signInButton');
    
    if (loginProgress) {
        if (show) {
            loginProgress.classList.remove('d-none');
        } else {
            loginProgress.classList.add('d-none');
        }
    }
    
    if (signInButton) {
        signInButton.disabled = show;
    }
}

/**
 * Show login error
 */
function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    
    if (loginError && loginErrorMessage) {
        loginErrorMessage.textContent = message;
        loginError.classList.remove('d-none');
    }
}

/**
 * Hide login error
 */
function hideLoginError() {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.classList.add('d-none');
    }
}

/**
 * Get access token
 */
async function getAccessToken() {
    try {
        if (!account) {
            throw new Error('No account available');
        }
        
        const tokenRequest = {
            scopes: ['User.Read'],
            account: account
        };
        
        const response = await msalInstance.acquireTokenSilent(tokenRequest);
        return response.accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

/**
 * Check if authenticated
 */
function isAuthenticated() {
    return account !== null && msalInstance && msalInstance.getAllAccounts().length > 0;
}

/**
 * Get current user
 */
function getCurrentUser() {
    return account;
}

// Make functions globally available
window.signIn = signIn;
window.signOut = signOut;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.getAccessToken = getAccessToken;
