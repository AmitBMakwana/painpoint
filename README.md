# PainPoint — Problem Discovery & Solution Community Platform

> **"Real Problems. Real People. Better Solutions."**

PainPoint is a public-first SaaS platform where anyone can discover real-world problems, read community conversations, validate personal pain points, propose solutions, and see the strongest ideas ranked and pinned through deterministic community and AI-assisted signals.

---

## 🚀 Key Features

- **Public-First Discovery**: Browse all 16 domains, search problems, read discussions, and explore community solutions without mandatory registration.
- **Problem Detail & Validation Engine**: "Is this your problem too?" interactive validator with frequency breakdown and 1–5 pain scale.
- **🏆 Pinned Top 3 Solutions**: Deterministic ranking algorithm combines community upvotes, practitioner validation, helpful feedback ratios, and AI problem-fit signals.
- **Conversational Problem Creation**: 4-step wizard with real-time AI structuring preview (domain, category, audience, tags).
- **Community Conversations**: Nested discussion threads with helpful voting and author reputation.
- **Contextual Authentication**: Guests are welcomed with gentle contextual auth modals only when attempting protected mutations.
- **Transparent Pricing**: Free Community, Pro Builder ($19/mo), Founder / Studio ($49/mo), and Business ($149/mo).

---

## 🛠️ Technology Stack

- **Backend**: Laravel 12/13, PHP 8.2+ (Target 8.3/8.4), MySQL, Redis, Laravel Queues
- **Frontend**: Inertia.js, React 19.3, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), Vite 7
- **UI & Motion**: Lucide React, Framer Motion
- **Architecture**: Domain-Driven Design under `app/Domain/` (Problems, Solutions, Ranking, AI, Validation, Reputation, Billing, Moderation)

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/AmitBMakwana/painpoint.git
cd painpoint
```

### 2. Install dependencies
```bash
composer install
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Run database migrations
```bash
php artisan migrate
```

### 5. Build frontend assets & start dev server
```bash
npm run build
php artisan serve
```

Access the platform at: **`http://127.0.0.1:8000`**

---

## 🧪 Running Tests
```bash
php artisan test
```

---

## 📄 License
Open-source software licensed under the [MIT license](LICENSE).
