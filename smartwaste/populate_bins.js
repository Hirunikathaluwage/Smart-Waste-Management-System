// MongoDB script to populate 5 bin records with separate latitude/longitude fields
// Run this script in MongoDB Compass or MongoDB shell

use smartwaste;

// Clear existing bins collection
db.bins.deleteMany({});

// Insert 5 sample bins with separate latitude and longitude fields
db.bins.insertMany([
  {
    "binId": "BIN-001",
    "ownerId": "RES-001",
    "status": "ACTIVE",
    "tag": {
      "type": "QR",
      "value": "BIN-001"
    },
    "latitude": 6.9271,
    "longitude": 79.8612,
    "address": "123 Galle Road, Colombo 03",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.csse.smartwaste.bin.entity.Bin"
  },
  {
    "binId": "BIN-002",
    "ownerId": "RES-002",
    "status": "ACTIVE",
    "tag": {
      "type": "QR",
      "value": "BIN-002"
    },
    "latitude": 6.9147,
    "longitude": 79.8523,
    "address": "456 Union Place, Colombo 02",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.csse.smartwaste.bin.entity.Bin"
  },
  {
    "binId": "BIN-003",
    "ownerId": "RES-003",
    "status": "DAMAGED",
    "tag": {
      "type": "QR",
      "value": "BIN-003"
    },
    "latitude": 6.9319,
    "longitude": 79.8656,
    "address": "789 Main Street, Colombo 11",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.csse.smartwaste.bin.entity.Bin"
  },
  {
    "binId": "BIN-004",
    "ownerId": "RES-004",
    "status": "ACTIVE",
    "tag": {
      "type": "QR",
      "value": "BIN-004"
    },
    "latitude": 6.9089,
    "longitude": 79.8765,
    "address": "321 Marine Drive, Colombo 06",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.csse.smartwaste.bin.entity.Bin"
  },
  {
    "binId": "BIN-005",
    "ownerId": "RES-005",
    "status": "ACTIVE",
    "tag": {
      "type": "QR",
      "value": "BIN-005"
    },
    "latitude": 6.9201,
    "longitude": 79.8888,
    "address": "654 Galle Road, Mount Lavinia",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "_class": "com.csse.smartwaste.bin.entity.Bin"
  }
]);

// Verify the insertion
print("✅ Successfully inserted " + db.bins.countDocuments() + " bin records");

// Display all inserted bins
print("\n📋 Inserted Bin Records:");
db.bins.find({}, {
  "binId": 1,
  "ownerId": 1,
  "status": 1,
  "latitude": 1,
  "longitude": 1,
  "address": 1
}).forEach(function(bin) {
  print("Bin ID: " + bin.binId + 
        " | Owner: " + bin.ownerId + 
        " | Status: " + bin.status + 
        " | Location: (" + bin.latitude + ", " + bin.longitude + ")" +
        " | Address: " + bin.address);
});
