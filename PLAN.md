# Project Plan: SME Marketing Content Generator

## 1. Project Goal

Develop a responsive web application that allows commercial bank employees to generate marketing content (Email, SMS, Mobile App Notification) for SME customers in different tones and languages using an external AI API.

## 2. Core Features

*   **Content Type Selection:** Email, SMS, Mobile App Notification
*   **Tone Selection:** Professional, Friendly, Urgent, Persuasive, Informative, Empathetic, Humorous, Formal, Casual, Hong Kong local style
*   **Language Selection:** English, Traditional Chinese, Simplified Chinese
*   **Content Generation:** Utilize an AI API to generate content based on selections.
*   **Responsive UI:** Adaptable layout for desktop, tablet, and mobile devices.

## 3. Technology Stack

*   **Frontend:** React
*   **Backend:** Node.js / Express
*   **AI Service:** OpenRouter API
*   **Version Control:** Git

## 4. High-Level Architecture

```mermaid
graph LR
    subgraph Browser (React)
        direction LR
        A[User Interface] --> B{User Input (Type, Tone, Lang)};
        B --> C[Generate Button];
    end

    subgraph Server (Node.js/Express)
        direction TB
        E[API Endpoint /api/generate] --> F{Prompt Construction};
        F --> G[OpenRouter API Call];
        G --> H{Response Handling};
        H --> E;
    end

    subgraph External Service
        direction LR
        I[OpenRouter API (Various Models)]
    end

    C -- HTTP Request --> E;
    E -- API Call --> I;
    I -- Generated Content --> E;
    E -- HTTP Response --> A;
```

## 5. Development Steps

1.  **Project Setup:** Create directory structure (`/frontend`, `/backend`), initialize Git, basic config.
2.  **Backend Development:**
    *   Set up Node.js/Express server.
    *   Create `POST /api/generate` endpoint.
    *   Implement OpenRouter API integration (secure key storage, prompt engineering, API calls, error handling).
3.  **Frontend Development:**
    *   Set up React application.
    *   Build UI components (Input Form, Generate Button, Output Display, Loading/Error states).
    *   Implement API call logic to connect to the backend.
    *   Ensure responsiveness using CSS.
4.  **Integration & Testing:**
    *   End-to-end testing of the data flow.
    *   Cross-browser and cross-device testing.