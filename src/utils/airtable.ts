const Airtable = require('airtable');

// Authenticate
Airtable.configure({
	apiKey: process.env.AIRTABLE_API_KEY
});

// Initialize a base
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// Reference a table
const table = base(process.env.AIRTABLE_TABLE_NAME);
const tableEditions = base(process.env.AIRTABLE_TABLE_EDITIONS_NAME);
const tableDemande = base(process.env.AIRTABLE_TABLE_DEMANDE_NAME);

export { table, tableDemande, tableEditions };
