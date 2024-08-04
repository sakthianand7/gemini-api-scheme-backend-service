const SEARCH_QUERY_PROMPT = "multiple matching schemes for the query mentioned in the above json for the above profile using this JSON schema:";
const HOMEPAGE_PROMPT = "Top 6 latest active government schemes with high public interest or social impact in India using this JSON schema in detail:";
const ELIGIBILITY_CHECK_PROMPT = "Check the eligibility of the government scheme for the above profile(check all the fields) using this JSON schema:";
const COMPARE_SCHEME_PROMPT = "detailed Comparison of these schemes and return in json with key for each json is the scheme name";

module.exports = {SEARCH_QUERY_PROMPT, HOMEPAGE_PROMPT, ELIGIBILITY_CHECK_PROMPT, COMPARE_SCHEME_PROMPT}