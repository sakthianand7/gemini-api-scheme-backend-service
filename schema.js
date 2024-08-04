const SEARCH_QUERY_SCHEMA = `
{ "type": "object",
  "properties": {
    "schemeWebsiteUrl" : {"type": "string"},
    "schemeName": { "type": "string" },
    "schemeDetails" : {"type": "string"},
    "eligible": { "type": "boolean" },
    "reason": { "type": "string" }
  }
}`;

const HOME_PAGE_CONTENT_SCHEMA = `
{ "type": "object",
  "properties": {
    "name": { "type": "string" },
    "category": { "type": "string" },
    "description": { "type": "string" },
    "eligibility": { "type": "string" },
    "website_url": { "type": "string" },
    "fees": { "type": "string"},
    "deadline": { "type": "string"},
    "eco_friendly": { "type": "boolean" }
  }
}`;

const ELIGIBILITY_CHECK_SCHEMA = `
{ "type": "object",
  "properties": {
    "schemeName": { "type": "string" },
    "eligibility": { "type": "boolean" },
    "reason": { "type": "string" }
  }
}`;

module.exports = {SEARCH_QUERY_SCHEMA, HOME_PAGE_CONTENT_SCHEMA, ELIGIBILITY_CHECK_SCHEMA}