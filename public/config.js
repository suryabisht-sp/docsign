var config = {};

// Configuration file example. 
//
// Development: Add to the public directory as config.js.
// 
// Production: Add to the build directory after the build is 
// complete as config.js.

// Your app's URL
config.DS_APP_URL='http://localhost:3000/react-oauth-docusign/build';
// development url default is 'http://localhost:3000/react-oauth-docusign/build';

// If config.DS_REDIRECT_AUTHENTICATION is true, then add a
// redirect URI to the integration key of DS_APP_URL since
// the OAuth flow will restart the application
//
// If config.DS_REDIRECT_AUTHENTICATION is false, then add a
// redirect URI to the integration key of 
// DS_APP_URL/oauthResponse.html


config.DS_CLIENT_ID='6b45631f-9e9e-4602-9eb1-3c83bbf84abf';
config.IMPLICIT_SCOPES='signature cors';
// DocuSign Identity server
config.DS_IDP='https://account-d.docusign.com';

// Your private API CORS proxies
// Add additional entries for the demo and prod platforms that your 
// users' accounts need
config.DS_API_CORS_PROXIES= {
    'https://na2.docusign.net' : 'https://www.example.com',
    'https://na3.docusign.net': 'https://xxxproxy.example.com',
     'https://demo.docusign.net':'https://demo.docusign.net',
     
    //  'https://demo.docusign.net':'https://account-d.docusign.com/oauth',

    // 'https://demo.docusign.net':'https://www.example.com',
    // 'https://demo.docusign.net': 'http://localhost:3000'
}

// redirect authentication? 
// true: the app redirects to the IdP
// false: the app opens a new tab for authentication, then closes it
config.DS_REDIRECT_AUTHENTICATION=true;
config.DS_DEBUG=true;
