# CarbonLens API Contract

## Authentication

### `POST /auth/login`

Request:

```json
{
  "email": "sustainability@carbonlens.demo",
  "password": "demo123"
}
```

Response:

```json
{
  "token": "demo-token",
  "user": {
    "id": "usr_1",
    "orgId": "org_1",
    "name": "Asha Verma",
    "role": "SUSTAINABILITY_MANAGER"
  }
}
```

## Dashboard

### `GET /dashboard/summary`

Response:

```json
{
  "totalEmissions": 1240.5,
  "scope1": 420.2,
  "scope2": 650.8,
  "scope3Covered": 169.5,
  "dataQualityScore": 82,
  "openIssues": 6
}
```

### `GET /dashboard/trends`

Response:

```json
{
  "months": [
    { "month": "Jan", "emissions": 102 },
    { "month": "Feb", "emissions": 97 },
    { "month": "Mar", "emissions": 110 }
  ]
}
```

## Records

### `GET /records`

Response:

```json
{
  "records": []
}
```

### `POST /records/upload`

Request:

```json
{
  "fileName": "electricity-march.csv",
  "recordType": "ELECTRICITY"
}
```

Response:

```json
{
  "acceptedRows": 24,
  "flaggedRows": 2,
  "issuesCreated": 2
}
```

### `POST /records/manual`

Request:

```json
{
  "facilityId": "fac_1",
  "sourceType": "DIESEL",
  "scope": "SCOPE_1",
  "category": "Stationary Combustion",
  "activityValue": 340,
  "activityUnit": "liters",
  "periodMonth": 3,
  "periodYear": 2026
}
```

Response:

```json
{
  "recordId": "rec_45",
  "calculatedEmissions": 911.2,
  "status": "ACCEPTED"
}
```

## Suppliers

### `GET /suppliers`

Response:

```json
{
  "suppliers": []
}
```

### `POST /supplier-submissions`

Request:

```json
{
  "supplierId": "sup_1",
  "scope3Category": "Upstream Transportation",
  "activityValue": 1200,
  "activityUnit": "km",
  "reportingPeriod": "2026-03",
  "notes": "Primary logistics lane"
}
```

Response:

```json
{
  "submissionId": "sub_10",
  "dataQualityScore": 78,
  "status": "SUBMITTED"
}
```

## Governance

### `GET /issues`

Response:

```json
{
  "issues": []
}
```

### `POST /issues/:id/assign`

Request:

```json
{
  "ownerUserId": "usr_2"
}
```

Response:

```json
{
  "issueId": "iss_4",
  "ownerUserId": "usr_2",
  "status": "OPEN"
}
```

### `POST /issues/:id/status`

Request:

```json
{
  "status": "RESOLVED"
}
```

Response:

```json
{
  "issueId": "iss_4",
  "status": "RESOLVED"
}
```

## Reports

### `POST /reports/generate`

Request:

```json
{
  "organizationId": "org_1",
  "reportingPeriod": "2026-Q1"
}
```

Response:

```json
{
  "reportId": "rep_7",
  "title": "Q1 ESG Summary",
  "status": "GENERATED"
}
```

### `GET /reports`

Response:

```json
{
  "reports": []
}
```

## Optional AI Insights

### `POST /insights/generate`

Request:

```json
{
  "organizationId": "org_1",
  "reportingPeriod": "2026-Q1"
}
```

Response:

```json
{
  "headline": "Electricity and diesel remain the top emission drivers.",
  "recommendations": [
    "Improve supplier submission completion",
    "Audit diesel-heavy facility operations",
    "Prioritize energy efficiency actions"
  ]
}
```

