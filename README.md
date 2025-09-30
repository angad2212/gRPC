# Service Communication  

This repository is a practical exploration of **service-to-service communication patterns** using key API paradigms:  

- **REST** → Resource-oriented APIs over HTTP/JSON.  
- **gRPC** → High-performance RPC framework using Protocol Buffers over HTTP/2.  
- **GraphQL** → Flexible query language for APIs that gives clients control over the data shape.  
- **WebSockets** → Real-time, bidirectional communication channel over a persistent TCP connection.  

---

### REST vs gRPC (Brief Comparison)  

- **Serialization**: REST typically uses **JSON**, which is human-readable but heavier. gRPC uses **Protocol Buffers (Protobuf)**, which are compact and binary-encoded, making serialization/deserialization much faster.  
- **Transport**: REST runs over **HTTP/1.1** with text-based requests/responses, while gRPC is built on **HTTP/2**, enabling multiplexed streams, lower latency, and built-in support for bidirectional streaming.  
- **Use Case Fit**: REST is simple, widely supported, and great for external/public APIs. gRPC shines in **internal microservice communication**, where speed and efficiency matter most.  

📊 **Performance Note**:  
In a basic test with identical requests:  
- **REST** averaged **~24 ms**  
- **gRPC** averaged **~12 ms**  

<img width="844" height="426" alt="Image" src="https://github.com/user-attachments/assets/93c8a202-4df0-40fc-81da-2a292b62f9da" />

<img width="839" height="477" alt="Image" src="https://github.com/user-attachments/assets/83b23eec-ad9c-414d-b2a6-88f5dba459cc" />
