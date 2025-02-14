db.Procedure.updateMany(
	{},
	{ $rename: { airtable_identifier: 'grist_identifier' } }
);
