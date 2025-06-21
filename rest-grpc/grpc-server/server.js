const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('number.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const numberPackage = grpcObject.numberPackage;

const numbers = [];

const server = new grpc.Server();

server.addService(numberPackage.NumberService.service, {
  AddNumber: (call, callback) => {
    const num = call.request.number;
    numbers.push(num);
    callback(null, { success: true, stored: num });
  },
  GetNumbers: (call, callback) => {
    callback(null, { numbers });
  }
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`🚀 gRPC server running on http://localhost:${port}`);
    server.start();
  }
);
