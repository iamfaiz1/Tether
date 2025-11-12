project/
│
├── app/
│   ├── main.py           # FastAPI entrypoint
│   ├── database.py       # MongoDB connection setup
│   ├── models.py         # Data models (Pydantic)
│   ├── routes/
│   │   └── upload.py     # Upload route (modular)
│   └── utils/
│       └── gridfs_utils.py  # helper functions for image save/fetch
│
├── static/
│   └── index.html        # frontend
│
└── requirements.txt


to run
uvicorn app.main:app --reload