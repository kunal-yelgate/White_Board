# 🎨 Visual Whiteboard

> A real-time collaborative whiteboard application built with React, Fabric.js, and WebSockets. Draw, sketch, and brainstorm together with your team — seamlessly and instantly.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Fabric.js-FF6B6B?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
</p>

---

## ✨ Features

- 🖊️ **Freehand Drawing** — Smooth pen tool with pressure support
- 🟦 **Shapes & Objects** — Rectangles, circles, lines, arrows, and text
- 🧽 **Eraser Tool** — Precision erasing with adjustable size
- 🎨 **Color Palette** — Custom colors, opacity control, and stroke width
- 👥 **Real-Time Collaboration** — See cursors and edits live with WebSockets
- ↩️ **Undo / Redo** — Full history stack with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`)
- 🖼️ **Image Upload** — Drag & drop images onto the canvas
- 🔍 **Zoom & Pan** — Navigate large boards with ease
- 💾 **Auto-Save** — Persistent storage with MongoDB
- 🔗 **Shareable Rooms** — Unique room IDs for instant collaboration
- 📱 **Responsive Design** — Works on desktop and tablet

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  React App  │◄──►│  Fabric.js  │◄──►│  Socket.io  │     │
│  │  (UI/State) │    │ (Canvas API)│    │   Client    │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
                                                  ▼ WebSocket
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Node.js    │◄──►│  Socket.io  │◄──►│    Redis    │     │
│  │  (Express)  │    │  (WS Hub)   │    │  (Pub/Sub)  │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│                                               │              │
│  ┌─────────────┐    ┌─────────────┐          │              │
│  │  MongoDB    │◄──►│  AWS S3 /   │◄─────────┘              │
│  │  (Metadata) │    │ Cloudinary  │  (Session State)        │
│  └─────────────┘    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **State** | Zustand | Lightweight global state |
| **Canvas** | Fabric.js | 2D drawing & object manipulation |
| **Styling** | CSS Modules / Tailwind | Component styling |
| **Real-Time** | Socket.io Client | WebSocket communication |
| **Backend** | Node.js + Express | API & WebSocket server |
| **Real-Time** | Socket.io | Bidirectional event handling |
| **Database** | MongoDB | Whiteboard data persistence |
| **Cache** | Redis | Session state & pub/sub |
| **Storage** | AWS S3 / Cloudinary | Image asset storage |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.0.0`
- npm `>= 9.0.0` or yarn
- MongoDB `>= 6.0` (local or Atlas)
- Redis `>= 7.0` (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/visual-whiteboard.git
cd visual-whiteboard
```

### 2. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

Create `.env` files for both client and server:

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visual-whiteboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
AWS_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**Client (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start Development Servers

```bash
# Start MongoDB & Redis (if running locally)
# macOS (using Homebrew)
brew services start mongodb-community
brew services start redis

# Linux
sudo systemctl start mongod
sudo systemctl start redis

# Start the backend server
npm run dev

# In a new terminal, start the React client
cd client
npm start
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
visual-whiteboard/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Canvas/              # Fabric.js canvas wrapper
│   │   │   ├── Toolbar/             # Drawing tools & controls
│   │   │   ├── Collaboration/       # User cursors & presence
│   │   │   └── UI/                  # Layout components
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useFabric.js         # Fabric.js initialization
│   │   │   ├── useWebSocket.js      # Socket connection
│   │   │   ├── useWhiteboardState.js # Global state
│   │   │   └── useHistory.js        # Undo/redo logic
│   │   ├── store/                   # Zustand stores
│   │   ├── utils/                   # Helpers & serializers
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── config/                      # DB & Socket config
│   ├── handlers/                    # Socket event handlers
│   │   ├── drawHandler.js
│   │   ├── objectHandler.js
│   │   ├── cursorHandler.js
│   │   └── historyHandler.js
│   ├── middleware/                  # Auth & rate limiting
│   ├── models/                      # Mongoose schemas
│   ├── rooms/                       # Room management
│   ├── routes/                      # REST API routes
│   └── index.js                     # Entry point
│
├── shared/                          # Shared types & constants
├── docker-compose.yml               # Docker setup
└── README.md
```

---

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `room:join` | Client → Server | Join a whiteboard room |
| `room:leave` | Client → Server | Leave current room |
| `draw:start` | Client → Server | Begin drawing stroke |
| `draw:move` | Client → Server | Drawing in progress (throttled) |
| `draw:end` | Client → Server | Complete drawing stroke |
| `object:modify` | Client → Server | Move, resize, or rotate object |
| `object:delete` | Client → Server | Delete selected objects |
| `cursor:move` | Client → Server | Mouse position update |
| `user:draw:start` | Server → Client | Another user started drawing |
| `user:draw:move` | Server → Client | Another user is drawing |
| `object:created` | Server → Client | New object added to canvas |
| `object:modified` | Server → Client | Object was modified |
| `objects:deleted` | Server → Client | Objects were removed |
| `user:joined` | Server → Client | New user entered room |
| `user:left` | Server → Client | User disconnected |
| `user:cursor` | Server → Client | Remote cursor position |

---

## 🛠️ Development

### Running Tests

```bash
# Client tests
cd client
npm test

# Server tests
cd server
npm test
```

### Building for Production

```bash
# Build React app
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Setup

```bash
# Start all services with Docker Compose
docker-compose up -d

# Services:
# - App: http://localhost:3000
# - API: http://localhost:5000
# - MongoDB: localhost:27017
# - Redis: localhost:6379
```

---

## 🎯 Roadmap

- [x] Basic drawing tools (pen, shapes, text)
- [x] Real-time collaboration with WebSockets
- [x] Undo / Redo functionality
- [x] Image upload & drag-drop
- [x] Zoom & pan navigation
- [ ] **Sticky Notes** — Add and edit sticky notes
- [ ] **Templates** — Pre-made board templates
- [ ] **Comments** — Add comments to specific areas
- [ ] **Version History** — Time-travel through board states
- [ ] **Export** — PDF, PNG, SVG export
- [ ] **Auth & Teams** — OAuth login and team workspaces
- [ ] **Mobile App** — React Native companion app
- [ ] **Offline Support** — Service worker & local sync

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on code style, testing, and commit conventions.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) — Powerful canvas library
- [Socket.io](https://socket.io/) — Real-time bidirectional communication
- [React](https://react.dev/) — UI library
- [Zustand](https://github.com/pmndrs/zustand) — State management

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</p>
