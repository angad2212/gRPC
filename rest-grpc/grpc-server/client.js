const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load and parse the proto file
const packageDef = protoLoader.loadSync('number.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const numberPackage = grpcObject.numberPackage;

// Connect to the server
const client = new numberPackage.NumberService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 1️⃣ Call AddNumber
client.AddNumber({ number: 42 }, (err, response) => {
  if (err) {
    console.error("❌ Error adding number:", err);
    return;
  }
  console.log("✅ Added number:", response);

  // 2️⃣ After adding, call GetNumbers
  client.GetNumbers({}, (err, response) => {
    if (err) {
      console.error("❌ Error fetching numbers:", err);
      return;
    }
    console.log("📦 Stored numbers:", response.numbers);
  });
});
