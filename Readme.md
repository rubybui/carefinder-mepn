STEP TO RUN APPLICATION
1. npm install
SEED DATABASE node seeds/seeds.js

Optional
2. script: npm run dev to start app
3. NAVIGATE TO [SIGNUP](http://localhost:3000/auth/signup) AND CREATE ACCOUNT
4. NAVIGATE TO [APIKEYS] (http://localhost:3000/apikeys) CLICK ON CREATE NEW KEY

5. USE API KEY TO TEST ENDPOINT (UNDERNEATH ARE POSSIBLE API CALL)

ALL API ENDPOINT DEVELOPED
https://docs.google.com/document/d/15df_jNi6xguhjXavTZ6NcjOrI0i6uYAku9cfpM1TEx8/edit?usp=sharing

Hospitals API Endpoints
/hospitals
GET: Read all hospital resources.
curl -X GET http://localhost:3000/hospitals -H "x-api-key: 5db5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"         
POST: Create a new hospital resource (Administrator only). 
curl -X POST http://localhost:3000/hospitals \
-H "x-api-key: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f" \
-H "Content-Type: application/json" \
-d '{
"provider_id": "010008",
"hospital_name": "CRENSHAW COMMUNITY HOSPITAL",
"address": "101 HOSPITAL CIRCLE",
"city": "LUVERNE",
"state": "AL",
"zip_code": "36049",
"county_name": "CRENSHAW",
"phone_number": {
"_phone_number": "3343353374"
},
"hospital_type": "Acute Care Hospitals",
"hospital_ownership": "Proprietary",
"emergency_services": true,
"location": {
"_human_address": "{\"address\":\"101 HOSPITAL CIRCLE\",\"city\":\"LUVERNE\",\"state\":\"AL\",\"zip\":\"36049\"}",
"_latitude": 31.69311635,
"_longitude": -86.26549483099967,
"_needs_recoding": false
},
"__id": "5",
"__uuid": "E7F0426D-98A4-4074-8716-C70929908CDD",
"__position": "5",
"__address": "http://data.medicare.gov/resource/xubh-q36u/5"
}'
DELETE: Delete all hospital resources (Administrator only).

curl -X DELETE http://localhost:3000/hospitals \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"  

/hospitals?providerid={number}
GET: Read a hospital resource by unique provider ID.
curl -X GET "http://localhost:3000/hospitals?providerid=010001" \ -H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

PUT: Update/Create a hospital resource by unique provider ID (Administrator only).
 curl -X PUT "http://localhost:3000/hospitals?providerid=010001" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f" \
-H "Content-Type: application/json" \
-d '{
  "hospital_name": "CHANGED SOUTHEAST ALABAMA MEDICAL CENTER",
  "address": "1108 ROSS CLARK CIRCLE",
  "city": "DOTHAN",
  "state": "AL",
  "zip_code": "36301",
  "county_name": "HOUSTON",
  "hospital_type": "Acute Care Hospitals",
  "hospital_ownership": "Government - Hospital District or Authority",
  "emergency_services": "true"
}'
DELETE: Delete a hospital resource by unique provider ID (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?providerid=010001" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"
{"message":"1 hospital(s) deleted"}%                                                                                                 

/hospitals?city={name}
GET: Read hospital resources by city name.
curl -X GET "http://localhost:3000/hospitals?city=DOTHAN" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by city name (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?city=DOTHAN" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"


/hospitals?state={name}
GET: Read hospital resources by state name.
curl -X GET "http://localhost:3000/hospitals?state=AL" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by state name (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?state=AL" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

/hospitals?county={name}
GET: Read hospital resources by county name.
curl -X GET "http://localhost:3000/hospitals?county=HOUSTON" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"
DELETE: Delete hospital resources by county name (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?county=HOUSTON" \
-H "X-API-KEY: 5db5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

/hospitals?name={name}
GET: Read hospital resources by name.
curl -X GET "http://localhost:3000/hospitals?name=PROVIDENCE%20ALASKA%20MEDICAL%20CENTER" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by name (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?name=PROVIDENCE%20ALASKA%20MEDICAL%20CENTER" \   
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

/hospitals?type={type}
GET: Read hospital resources by type.
curl -X GET "http://localhost:3000/hospitals?type=Acute%20Care%20Hospitals" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by type (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?type=Acute%20Care%20Hospitals" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

{"message":"3363 hospital(s) deleted"}%   

/hospitals?ownership={owner}
GET: Read hospital resources by ownership.
curl -X GET "http://localhost:3000/hospitals?ownership=Government%20-%20Hospital%20District%20or%20Authority" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by ownership (Administrator only).
 curl -X DELETE "http://localhost:3000/hospitals?ownership=Government%20-%20Hospital%20District%20or%20Authority" \ 
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"
{"message":"267 hospital(s) deleted"}% 

/hospitals?emergency={true|false}
GET: Read hospital resources by emergency service availability.
curl -X GET "http://localhost:3000/hospitals?emergency=true" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by emergency service availability (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals?emergency=true" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"
{"message":"982 hospital(s) deleted"}

/hospitals?city={name}&state={name}
GET: Read hospital resources by city and state names.
curl -X GET "http://localhost:3000/hospitals?city=WEST%20LOS%20ANGELES&state=CA" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"

DELETE: Delete hospital resources by city and state names (Administrator only).
 curl -X DELETE "http://localhost:3000/hospitals?city=WEST%20LOS%20ANGELES&state=CA" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"
{"message":"1 hospital(s) deleted"}% 

Extra Credit Endpoint: /hospitals?lat={latitude}&lon={longitude}&dist={distance}
GET: Read hospital resources within a radius from a coordinate.
curl -X GET "http://localhost:3000/hospitals/radius?lat=33.33899688900044&lon=-118.33088830799971&dist=50" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"


DELETE: Delete hospital resources within a radius from a coordinate (Administrator only).
curl -X DELETE "http://localhost:3000/hospitals/radius?lat=33.33899688900044&lon=-118.33088830799971&dist=50" \
-H "X-API-KEY: ddb5709667b5b0bec0cd43026e6b2e5bc36210383f3c5a60baefa8f25c52d97f"


API Keys Endpoints
/apikeys
GET: Retrieve all API key resources (Administrator only).
POST: Create a new API key resource.
DELETE: Delete all API key resources (Administrator only).
/apikeys?key={key}
GET: Retrieve metadata for a specific API key (Administrator only).
DELETE: Delete a specific API key resource.


