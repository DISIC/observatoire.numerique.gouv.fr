from grist_api import GristDocAPI
import os
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

# Load environment variables
load_dotenv()

# Connect to Grist
try:
    api = GristDocAPI(
        os.getenv('GRIST_DOC_ID'), 
        api_key=os.getenv('GRIST_API_KEY'), 
        server=os.getenv('GRIST_DOC_SERVER')
    )
    editions_table = api.fetch_table(os.getenv('GRIST_TABLE_EDITION'))
    administration_central_table = api.fetch_table(os.getenv('GRIST_TABLE_ADMINISTRATION_CENTRAL'))
    print(f"Successfully connected to Grist and fetched tables")
except Exception as e:
    print(f"Failed to connect to Grist API: {str(e)}")
    raise

# Connect to MongoDB
try:
    mongo_client = MongoClient(os.getenv('MONGODB_URI'))
    db = mongo_client[os.getenv('MONGODB_DB_NAME')]
    editions_collection = db[os.getenv('MONGODB_EDITIONS_COLLECTION')]
    procedures_collection = db[os.getenv('MONGODB_PROCEDURES_COLLECTION')]
    print(f"Successfully connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    raise


if __name__ == "__main__":
    # Define the new fields you want to add to procedures and their default values
    new_procedure_fields = {
       "administration_central": "",
    }

    administration_central_dict = {}
    for row in administration_central_table:
        row = row._asdict()
        administration_central_dict[row['id']] = row['Nom_Administration_Centrale']
   
    # Define the chunk size
    CHUNK_SIZE = 500
    
    # Get all procedure IDs first
    all_procedure_ids = [p['_id'] for p in procedures_collection.find({ 'grist_identifier': { '$exists': True } }, {'_id': 1})]
    total_procedures = len(all_procedure_ids)
    
    print(f"Processing {total_procedures} procedures in chunks of {CHUNK_SIZE}")
    
    # Process in chunks
    for i in range(0, total_procedures, CHUNK_SIZE):
        chunk_ids = all_procedure_ids[i:i+CHUNK_SIZE]
        procedures_chunk = list(procedures_collection.find({"_id": {"$in": chunk_ids}}))
        
        updates = []
        for procedure in procedures_chunk:
            # Get procedure from Grist based on the id
            procedure_grist_id = procedure['grist_identifier']
            procedure_grist = api.fetch_table(os.getenv('GRIST_TABLE_PROCEDURE'), {'Dashlord_ID_XWIKI': procedure_grist_id})
            if (len(procedure_grist) > 0):
                procedure_grist = procedure_grist[0]._asdict()
                updates.append(UpdateOne(
                    {"_id": procedure['_id']},
                    {"$set": {
                        "administration_central": procedure_grist['Nom_Administration_Centrale'],
                    }}
                ))
        
        # Execute bulk update if there are any updates
        if updates:
            result = procedures_collection.bulk_write(updates)
            print(f"Processed chunk {i//CHUNK_SIZE + 1}: Updated {result.modified_count} documents")
