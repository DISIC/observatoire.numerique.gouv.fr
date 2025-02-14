const { GristDocAPI } = require('grist-api');

// Authenticate
const DOC_URL = process.env.GRIST_DOC_URL;

// Initialize a base
const api = new GristDocAPI(DOC_URL, { api_key: process.env.GRIST_API_KEY });

export { api };
