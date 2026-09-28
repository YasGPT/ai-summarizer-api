# AI Summarizer API

A lightweight REST API built with Express and Google Gemini that generates concise summaries from input text.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run the Server
```bash
node index.js
```
The server will start on `http://localhost:3000`.

---

## Example Usage

### Request
**Endpoint:** `POST /summarize`  
**Headers:** `Content-Type: application/json`

```json
{
  "text": "Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets developers run JavaScript on the server instead of only in the browser. Because it uses an event-driven, non-blocking model, it handles many connections efficiently. It is widely used to build APIs, real-time apps, and microservices."
}
```

### PowerShell Example
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/summarize -ContentType "application/json" -Body '{"text":"Node.js is a JavaScript runtime built on the V8 engine. It lets developers run JavaScript on the server. It is widely used to build APIs and real-time apps."}'
```

### Response
**Status:** `200 OK`
```json
{
  "summary": "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows developers to execute code on the server side. By utilizing an event-driven, non-blocking architecture, it efficiently manages numerous simultaneous connections for building APIs, real-time applications, and microservices."
}
```
