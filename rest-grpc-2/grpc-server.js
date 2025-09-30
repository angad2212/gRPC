const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Temp database
const users = new Map(); // Map<number, { id: number, name: string, email: string }>
let nextId = 1; // auto-id starting at 1

function CreateUser(call, callback) {
    const { name, email } = call.request;
    if (!name || !email) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'name and email are required'
      });
    }
    const id = nextId++;
    const user = { id, name, email };
    users.set(id, user);
    callback(null, { user });
  }

function GetUser(call, callback) {
  const { id } = call.request;
  const user = users.get(id);
  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: `User ${id} not found`
    });
  }
  callback(null, { user });
}

function ListUsers(call, callback) {
    const list = Array.from(users.values());
    callback(null, { users: list });
}

function main() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, {
    CreateUser,
    GetUser,
    ListUsers
  });
  const addr = '0.0.0.0:50053';
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Server bind error:', err);
      process.exit(1);
    }
    console.log(`gRPC server listening on ${addr}`);
    server.start();
  });
}
  
main();