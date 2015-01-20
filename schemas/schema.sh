# curl -i -H "Content-Type: application/json" -H "Accept: application/json" -XGET http://localhost:15951/subjects/com.gilt.web.test.PageView/latestSchema

curl -i \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-XPUT http://localhost:15951/subjects/com.gilt.gumshoe.v1.GumshoeEvent/schemas \
-d '{
  "namespace": "com.gilt.gumshoe.v1",
  "type": "record",
  "name": "GumshoeEvent",
  "fields": [
    {"name": "uuid", "type": {"namespace": "gfc.avro", "type": "fixed", "size": 16, "name": "UUID"}},

    {"name": "eventName", "type": "string"},
    {"name": "eventData", "type": ["null", "string"], "default": null},

    {"name": "sessionUuid", "type": {"namespace": "gfc.avro", "type": "fixed", "size": 16, "name": "UUID"}},

    {"name": "timestamp", "type": "long"},
    {"name": "timezoneOffset", "type": "long"},

    {"name": "giltData", "type":
      {"type": "record",
       "name": "GiltData",
       "namespace": "com.gilt.gumshoe.v1.GumshoeEvent.GiltData",
       "fields": [
          {"name": "abTests", "type": ["null", "string"], "default": null},
          {"name": "applicationName", "type": ["null", "string"], "default": null},
          {"name": "channel", "type": ["null", "string"], "default": null},
          {"name": "groups", "type": ["null", "string"], "default": null},
          {"name": "hasPurchased", "type": ["null", "boolean"], "default": null},
          {"name": "isBotRequest", "type": ["null", "boolean"], "default": null},
          {"name": "isLoyaltyUser", "type": ["null", "boolean"], "default": null},
          {"name": "loyaltyStatus", "type": ["null", "string"], "default": null},
          {"name": "pricer", "type": ["null", "string"], "default": null},
          {"name": "section", "type": ["null", "string"], "default": null},
          {"name": "store", "type": ["null", "string"], "default": null},
          {"name": "subsite", "type": ["null", "string"], "default": null},
          {"name": "timezone", "type": ["null", "string"], "default": null},
          {"name": "vendorUserId", "type": ["null", "string"], "default": null}
        ]
      }
    },

    {"name": "pageData", "type":
      {
        "type": "record",
        "name": "PageData",
        "namespace": "com.gilt.gumshoe.v1.GumshoeEvent.PageData",
        "fields": [
          {"name": "characterSet", "type": "string"},
          {"name": "colorDepth", "type": "string"},
          {"name": "cookie", "type": "string"},
          {"name": "googleClickId", "type": "string"},
          {"name": "hash", "type": "string"},
          {"name": "host", "type": "string"},
          {"name": "hostName", "type": "string"},
          {"name": "ipAddress", "type": "string"},
          {"name": "javaEnabled", "type": "boolean"},
          {"name": "language", "type": "string"},
          {"name": "loginKey", "type": "string"},
          {"name": "origin", "type": "string"},
          {"name": "path", "type": "string"},
          {"name": "platform", "type": "string"},
          {"name": "port", "type": "int"},
          {"name": "promotionKey", "type": "string"},
          {"name": "protocol", "type": "string"},
          {"name": "queryString", "type": "string"},
          {"name": "referer", "type": "string"},
          {"name": "screenAvailHeight", "type": "int"},
          {"name": "screenAvailWidth", "type": "int"},
          {"name": "screenHeight", "type": "int"},
          {"name": "screenOrientationAngle", "type": "int"},
          {"name": "screenOrientationType", "type": "string"},
          {"name": "screenPixelDepth", "type": "string"},
          {"name": "screenResolution", "type": "string"},
          {"name": "screenWidth", "type": "int"},
          {"name": "title", "type": "string"},
          {"name": "url", "type": "string"},
          {"name": "userAgent", "type": "string"},
          {"name": "utmCampaign", "type": "string"},
          {"name": "utmContent", "type": "string"},
          {"name": "utmMedium", "type": "string"},
          {"name": "utmSource", "type": "string"},
          {"name": "utmTerm", "type": "string"},
          {"name": "viewportHeight", "type": "int"},
          {"name": "viewportResolution", "type": "string"},
          {"name": "viewportWidth", "type": "int"}
        ]
      }
    }
  ]
}'
