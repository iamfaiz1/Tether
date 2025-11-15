```mermaid

%% --- 1. User Authentication (Sign Up) Flow ---
graph TD
A[User Loads App] --> B{Token in localStorage?};
B -- No --> C[Set Page: login];
C --> D[Show LoginPage];
D -- User Clicks Sign Up --> E[Show Sign Up Form];
E -- User Submits --> F[POST /api/auth/signup];
F --> G[Backend: auth.py];
G -- Validates & Hashes --> H[Save to users.json];
H --> I[Create JWT Token];
I --> J[Return 200 OK Token + User];
J --> K[App handleLoginSuccess];
K -- Saves Token & User --> L[Set Page: home];
L --> M[Show Header Hero etc];
M --> N[Header shows Profile & Logout];
B -- Yes --> K;

%% --- 2. Report Submission & Matching Flow ---
graph TD
A[User Logged In on home Page] --> B[Fills ReportForm];
B -- Submits with Photo --> C[POST /api/report with Auth Token];
C --> D[Backend: report.py];
D -- Gets user_id --> E[Generate Embedding];
E --> F[Save to parents or volunteers json];
F --> G[Save Image to uploads];
G --> H[Run find_and_update_match];
H -- Searches Opposite DB --> I{Match Found?};
I -- No --> J[API Returns match_found false];
J --> K[ReportForm shows Submitted];
I -- Yes --> L[Update both DB records with unconfirmed match];
L --> M[API Returns match_found true];
M --> N[App handleMatchFound];
N --> O[Set Page: match];
O --> P[Show MatchConfirmationPage];

%% --- 3. Match Confirmation Flow ---
graph TD
A[MatchConfirmationPage Loads] --> B[GET /api/match/id];
B --> C[Backend: match.py];
C -- Finds both reports --> D[Return Parent and Volunteer Data];
D --> E[Page Displays Both Images & Details];
E -- User Clicks Yes --> F[POST /api/confirm];
F --> G[Backend sets confirmed true];
G --> H[Create child entry in children.json];
H --> I[Return OK];
I --> J[App handleMatchComplete];
J --> K[Set Page home];
K --> L[Header shows My Match Icon];

```