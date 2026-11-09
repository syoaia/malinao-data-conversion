# CSV to JSON Data Mapping Exercise

This project transforms a CSV file into a JSON file using the mapping rules from the exercise.

## Run locally

```bash
cd "/Users/guess/Documents/INTEGRATIVE PROGRAMMING/DataConversion"
node server.js
```

Open:

```text
http://localhost:3000
```

## Files

- `exercise_datamap.csv` — source CSV data
- `index.html` — frontend screen for uploading or loading the CSV
- `script.js` — CSV parsing and transformation logic
- `server.js` — local web server that serves the app

## Expected output format

```json
[
  {
    "studentId": 2026001,
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "program": "Bachelor of Science in Information Technology",
    "yearLevel": 3,
    "emailAddress": "juan@example.com",
    "outstandingBalance": 0
  }
]
```

## Deployment name

This project is intended for a Vercel deployment using the naming convention:

```text
https://aishamalinao.vercel.app
```

The page also includes the required student details and the CSV-to-JSON mapping behavior.
