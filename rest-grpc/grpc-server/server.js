const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

//load the proto file, and generate the grpc service
const packageDef = protoLoader.loadSync('number.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const numberPackage = grpcObject.numberPackage; //has access to all services in proto file

const numbers = []; //temp database
const server = new grpc.Server(); //now, create a grpc server to hit the service

server.addService(numberPackage.NumberService.service, {
  AddNumber: (call, callback) => { //call is like req, callback is like res
    const num = call.request.number;
    numbers.push(num);
    callback(null, { success: true, stored: num });
  },
  GetNumbers: (call, callback) => {
    callback(null, { numbers });
  }
});

//now starting the server
server.bindAsync(
  '0.0.0.0:50052', // 1
  grpc.ServerCredentials.createInsecure(), // 2
  (err, port) => { // 3
    if (err) {
      console.error(err);
      return;
    }
    console.log(`🚀 gRPC server running on http://localhost:${port}`);
    server.start();
  }
);