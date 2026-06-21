# Shreesh Pitambare — Data Structure Portfolio

![Portfolio Preview](frontend/src/assets/hero.png)

A futuristic, interactive portfolio website built with **React + Vite** (frontend) and **Flask + MongoDB** (backend), where **every section is a real data structure** — Stack, Array, Tree, Graph, Linked List, and Queue. Designed to showcase not just projects, but a deep understanding of computer science fundamentals through visual storytelling.

🔗 **Live Demo:** [Coming Soon]  
🐙 **GitHub:** [https://github.com/thenameisshreesh/Portfolio](https://github.com/thenameisshreesh/Portfolio)

---

## 📖 Table of Contents

- [About Me](#about-me)
- [Tech Stack](#tech-stack)
- [Sections & Data Structures](#sections--data-structures)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Resume](#resume)
- [License](#license)

---

## 👤 About Me

**Shreesh Pitambare**  
Pune, Maharashtra, India  
📧 shreeshpitambare084@gmail.com  
🔗 [GitHub](https://github.com/thenameisshreesh) | [LinkedIn](https://linkedin.com/in/shreesh-pitambare-240456358)

**Full-Stack Java Developer** proficient in Spring Boot, RESTful APIs, Microservices, Hibernate, JDBC, and cloud-native application engineering. Skilled in building scalable distributed systems and crafting AI-powered solutions using Python, Flask, FastAPI, RAG, and LLM technologies. Strong foundation in Data Structures and Algorithms, Object-Oriented Programming, Databases, Operating Systems, Computer Networks, and System Design.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot** | Enterprise application framework |
| **Spring MVC / Spring Data JPA** | Web layer & data access |
| **Hibernate ORM** | Object-relational mapping |
| **Flask / FastAPI** | Python microservices |
| **REST APIs / Microservices** | Distributed system architecture |
| **Maven** | Build & dependency management |

### Frontend & Mobile
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite** | Build tool |
| **Flutter** | Cross-platform mobile apps |
| **Framer Motion** | Animations |
| **D3.js** | Data visualizations |
| **Axios** | HTTP client |

### Databases & Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | NoSQL database |
| **PostgreSQL / MySQL** | Relational databases |
| **Supabase** | Backend-as-a-Service |
| **Kafka** | Message streaming |
| **Redis** | Caching |

### Emerging Tech
| Technology | Purpose |
|---|---|
| **LangChain / RAG** | LLM-powered applications |
| **FAISS** | Vector similarity search |
| **Hyperledger** | Blockchain framework |
| **n8n** | Workflow automation |

---

## 🧩 Sections & Data Structures

This portfolio transforms each section into a visual data structure:

| Section | Data Structure | Component | What It Shows |
|---|---|---|---|
| **Hero** | 🥞 **Stack** (LIFO) | `StackHero.jsx` | Cards auto-pop on load revealing "Hi, I'm Shreesh" → "Full Stack Developer" → "AI + Futuristic UI Builder". Visual stack with memory addresses. |
| **About** | 📊 **Array** | `ArrayAbout.jsx` | Three array blocks (`[0]`, `[1]`, `[2]`) visible simultaneously. Active block glows, inactive blocks dim. Horizontal scroll navigates between them. |
| **Skills** | 🌳 **Tree** | `TreeSkills.jsx` | Root node → branches → leaves appear sequentially with animated SVG edges. Each leaf node shows skill level with a circular arc. |
| **Projects** | 🔗 **Graph** | `GraphProjects.jsx` | Projects as 3D graph nodes with visible edges. Active node zooms forward, connected edges glow. Click to navigate between projects. |
| **Experience** | 🔗 **Linked List** | `LinkedListExperience.jsx` | Experience timeline as linked list nodes with `DATA \| NEXT →` compartments. Pointer slides over nodes, NULL node at end. |
| **Contact** | 🏗️ **Queue** (FIFO) | `QueueContact.jsx` | Contact form with queue animation. Submissions are enqueued and processed in order. |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React     │────▶│   Flask API  │────▶│  MongoDB    │
│   Frontend  │◀────│   (Python)   │◀────│  Atlas      │
│   :5173     │     │   :5000      │     │  (Cloud)    │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │                    ├── SMTP (Email notifications)
       │                    └── Contact form storage
       │
       └── Data structure animations
           (All client-side React + D3.js)
```

### Data Flow
1. **Static content** (projects, skills) is fetched from Flask API → MongoDB Atlas on page load
2. **Contact form** submissions are stored in MongoDB and trigger email notifications via SMTP
3. **All animations** run client-side using React state, Framer Motion, and D3.js
4. **No authentication** required — public portfolio site

---

## ⚙️ How It Works

### Section 1 — Stack (Hero)
- On scroll into view, a `useEffect` triggers three timed `pop()` operations
- Cards are stored in a LIFO array; each pop slides a card from the stack visual to the "popped" panel
- Re-entering the view resets the stack

### Section 2 — Array (About)
- Three "memory cells" stored as an array of objects
- `useInView` hook detects scroll position to determine active index
- Active cell gets full opacity + glow; others dim to 30-40%

### Section 3 — Tree (Skills)
- SVG-based tree with `<line>` elements for edges and `<circle>`/`<text>` for nodes
- Sequential animation using chained `setTimeout` calls building root → branches → leaves
- `stroke-dashoffset` CSS animation draws edges

### Section 4 — Graph (Projects)
- 3D perspective using CSS `perspective` and `transform-style: preserve-3d`
- Nodes positioned with `(x, y, z)` coordinates in a spherical arrangement
- Clicking a node triggers a "camera pan" — the graph rotates so the node faces forward

### Section 5 — Linked List (Experience)
- Each node is a box with `DATA` and `NEXT →` compartments
- A pointer (`ptr`) slides above nodes based on scroll position
- The `NEXT` arrow glows when the node is active

### Section 6 — Queue (Contact)
- Form submissions are enqueued and processed sequentially (FIFO)
- Each submission triggers an email notification and auto-reply

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.9+
- **MongoDB Atlas** account (free tier)
- **Gmail account** (for SMTP email notifications)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/thenameisshreesh/Portfolio.git
cd Portfolio

# Set up backend virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio" > .env
echo "PORT=5000" >> .env
echo "SMTP_EMAIL=your-email@gmail.com" >> .env
echo "SMTP_PASSWORD=your-app-password" >> .env

# Seed the database
python seed_data.py

# Run the server
python run.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Fetch all projects |
| `GET` | `/api/skills` | Fetch all skills |
| `POST` | `/api/contact` | Submit contact form |

### POST /api/contact

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great portfolio!"
}
```

**Response:** `{ "success": true, "id": "..." }`

---

## 📁 Project Structure

```
Portfolio/
├── README.md                    # This file
├── implementation_plan.md       # Original design specification
├── .gitignore
├── backend/
│   ├── requirements.txt
│   ├── run.py                   # Flask entry point
│   ├── seed_data.py             # Database seeder
│   ├── test.py                  # Quick DB test
│   └── app/
│       ├── __init__.py          # Flask app factory
│       ├── config.py            # Configuration
│       ├── controllers/
│       │   ├── contact_controller.py
│       │   ├── project_controller.py
│       │   └── skill_controller.py
│       ├── models/
│       │   ├── contact.py
│       │   ├── project.py
│       │   └── skill.py
│       └── routes/
│           └── api.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── README.md
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── client.js
        ├── assets/
        ├── components/
        │   ├── about/      # ArrayAbout.jsx
        │   ├── common/     # ParticleBackground, CursorGlow, Loader
        │   ├── contact/    # QueueContact.jsx
        │   ├── experience/ # LinkedListExperience.jsx
        │   ├── hero/       # StackHero.jsx
        │   ├── nav/        # Navbar.jsx
        │   ├── projects/   # GraphProjects.jsx
        │   └── skills/     # TreeSkills.jsx
        ├── context/
        ├── hooks/          # useApi.js
        └── styles/         # global.css, tokens.css
```

---

## 📄 Resume

### Education
| Degree | Institution | Year | Score |
|---|---|---|---|
| B.Tech (CSE IoT, Cybersecurity with Blockchain) | Vishwakarma Institute of Technology, Pune | 2025–2028 | CGPA: 9.6 |
| Diploma in Computer Engineering | Government Polytechnic, Miraj | 2022–2025 | 92.91% |

### Experience

**App Development Intern — NKSKILLEDGE Pvt. Ltd.** (Feb 2026 – May 2026)
- Developed and deployed REST API endpoints and backend microservices supporting 100+ concurrent users via Kafka message queuing

**Web Development Intern — Packaging Wallah** (Aug 2025 – Dec 2025)
- Architected a full-stack ticket booking system using Flask, SQL, Google Maps API, and Cashfree Payment Gateway, enabling seamless transactions for 100+ concurrent users with zero downtime

### Achievements
- Filed **4 patents** in IoT, Artificial Intelligence, and smart monitoring domains
- **Winner of 5 National-Level Hackathons**
- Secured top positions in **2 technical poster competitions**
- **Certifications:** Java + Advanced Java | CCNA (Cisco) | Deloitte Cyber Simulation | DevOps (Great Learning)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/thenameisshreesh">Shreesh Pitambare</a>
</p>