# app/database.py
from pymongo import MongoClient
import gridfs
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
# connection name

DB_NAME = os.getenv("DB_NAME", "tether_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# GridFS for images
fs = gridfs.GridFS(db)

# main collection
submissions = db["submissions"]
