curl -i \
-H "Content-Type: application/vnd.stream.gilt.v1+json" \
-H "Accept: application/vnd.stream.gilt.v1+json" \
-XPUT http://localhost:18402/streams/com.gilt.gumshoe.v1.GumshoeEvent \
-d '{
  "id" : "com.gilt.gumshoe.v1.GumshoeEvent",
  "transport" : "kinesis",
  "schema" : "com.gilt.gumshoe.v1.GumshoeEvent",
  "uuidVersion" : 4
}'
