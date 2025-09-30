# Service Communication Patterns: REST vs gRPC vs GraphQL  

This repo is a **practical guide + playground** for learning and comparing the **three major API paradigms** used in modern backend and distributed systems:  

- **REST (Representational State Transfer)**  
- **gRPC (Google Remote Procedure Call)**  
- **GraphQL (Query Language for APIs)**  

The aim: **understand their trade-offs**, not just use them blindly.  

---

## Quick Decision Rules  

- **Use REST if…** you need simplicity, wide compatibility, and human-friendly debugging.  
- **Use gRPC if…** you need high performance, type safety, or streaming between microservices.  
- **Use GraphQL if…** clients need flexible queries and control over data shape.  

👉 Often, large systems use a **hybrid**:  
- REST for **external APIs**  
- gRPC for **internal microservice communication**  
- GraphQL for **frontend-facing data aggregation**  

---

## REST (HTTP + JSON)

### Strengths
- Ubiquitous — supported everywhere (browsers, IoT, mobile, etc.).  
- Easy to debug with `curl`, Postman, or browser.  
- Leverages HTTP features: caching (`ETag`, `Cache-Control`), authentication, proxies, CDNs.  
- Loose coupling between client/server.  

### Weaknesses
- Fixed endpoints — rigid contract (hard to evolve if clients want custom data).  
- Verbose JSON → slower serialization vs binary formats.  
- Multiple round-trips often needed (e.g., `/user` then `/user/orders`).  

### When to Use
- Public APIs or third-party integrations.  
- When caching/CDNs matter.  
- When developer friendliness is a must (quick testing, easy onboarding).  

---

## gRPC (Protobuf + HTTP/2)

### Strengths
- High performance: compact binary Protobuf serialization.  
- Strong typing: schema-first (`.proto` files generate client + server stubs).  
- Streaming support: client-side, server-side, and bidirectional.  
- Built on HTTP/2 → multiplexing, lower latency.  

### Weaknesses
- Harder to debug (binary over the wire, not human-readable).  
- Browsers don’t support gRPC natively (need gRPC-Web proxy).  
- No built-in HTTP caching.  

### When to Use
- Internal microservices that need fast, reliable communication.  
- Real-time systems (chat, telemetry, IoT).  
- Strongly typed contracts across multiple languages.  

---

## GraphQL (Flexible Query Language)

### Strengths
- Client-driven — ask exactly for the data you need, nothing more.  
- Great for UI/frontends that need different data shapes.  
- Introspection: auto-generate docs, explore API easily.  
- Reduces over-fetching (vs REST) and under-fetching (vs rigid APIs).  

### Weaknesses
- More complex server setup (resolvers, schemas).  
- Caching is harder (responses vary by query).  
- Can be overkill for simple APIs.  
- Risk of expensive queries unless you add limits/validation.  

### When to Use
- Frontend teams want flexible queries.  
- Aggregating multiple backend services into one unified API.  
- Mobile apps (where network efficiency matters).  

---

## Choosing Between Them  

| Criteria                  | REST | gRPC | GraphQL |
|---------------------------|------|------|---------|
| Ease of debugging         | ✔️   | ❌   | ⚠️ Needs tools |
| Performance               | ❌   | ✔️   | ❌ |
| Streaming support         | ❌   | ✔️   | ⚠️ (subscriptions) |
| Public APIs               | ✔️   | ❌   | ⚠️ |
| Internal microservices    | ❌   | ✔️   | ❌ |
| Flexible queries          | ❌   | ❌   | ✔️ |
| Caching/CDN support       | ✔️   | ❌   | ⚠️ (manual) |

---

## Rule of Thumb  

- **If external → REST** (or GraphQL if clients demand flexibility).  
- **If internal microservices → gRPC**.  
- **If UI/frontend with varied data needs → GraphQL**.  

