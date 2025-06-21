const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto file
const packageDef = protoLoader.loadSync("todo.proto", {});

// Load gRPC package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Create the gRPC server
const server = new grpc.Server();

// Dummy in-memory list
const todos = [];

// Implement the gRPC methods
function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodosStream(call) {
  todos.forEach(todo => call.write(todo));
  call.end();
}

// Register the service
server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodosStream,
});

// Bind the server
server.bindAsync('0.0.0.0:40000', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Server binding error:", err);
    return;
  }
  console.log(`✅ gRPC server is running at port ${port}`);
  server.start();
});
