# M7A - Autonomic Engineering Forge

The Forge is an advanced application orchestration environment powered by the M7A Neural Kernel. It allows operatives to synthesize full-stack applications from high-level conceptual prompts.

## Quick Start

### 1. Environment Configuration
Create a `.env` file from `.env.example` and provide your credentials.
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Matrix
```bash
npm run dev
```

## Security Protocols

### Firestore Rules
Security rules are mandatory for production operation. Deploy them using:
```bash
npx firebase-tools deploy --only firestore:rules
```

### Authentication
The forge supports Google OAuth and Operative Email/Password protocols.

## Autonomic Calibration
The system uses Google Gemini for architectural synthesis. Ensure your `GEMINI_API_KEY` is correctly set in the environment.

## Deployment
Synthesis results are staged in the `dist` conduit.
```bash
npm run build
npm run start
```
