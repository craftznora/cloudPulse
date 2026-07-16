# CloudPulse Code Review & Explanations

This document provides a comprehensive review and architectural explanation of the CloudPulse project. It details how the Next.js 15 frontend, the custom UI components, and the serverless AWS Lambda backend function.

---

## 📂 Codebase Overview
The project is split into a Next.js frontend application and serverless backend Lambda files:
* `/app`: Handles Next.js routing, pages, global styling, layout configuration, and the dynamic favicon.
* `/components`: Contains modular and reusable UI elements (e.g. navigation header, drawers, animation wrappers, and auth notes).
* `/lib`: Houses mock database profiles used for simulated operations prior to full API Gateway integration.
* `/aws/lambda`: Contains index handler files for your serverless Node.js backend.

---

## 1. Next.js Frontend App Architecture (`/app`)

### 🌐 Global Layout & Styling
* **`app/layout.jsx`**:
  * Configures customized Google Font families (`Spline Sans` for body, `IBM Plex Mono` for code components).
  * Outlines the HTML/body hierarchy, including the `<Navbar />` and `<Footer />`.
  * **Global Background Grid**: Declares the `.dot-grid` utility style directly on the `<body>` element. This guarantees that the dot grid background stretches uniformly to fit the page viewport on all routes.
* **`app/globals.css`**:
  * Uses Tailwind CSS v4 design tokens.
  * Defines the `.dot-grid` utility style using a custom radial gradient:
    ```css
    .dot-grid {
      background-image: radial-gradient(#ccd5e3 1px, transparent 1px);
      background-size: 22px 22px;
    }
    ```
  * Declares custom visual animations (e.g. bounce-in entry scales for modals `.pop-in`, backdrop fades `.fade-in`, and drift animations `.drift-x`).

### 🏠 Home Page (`/`)
* **`app/page.jsx`**:
  * Serves as the landing page of the application.
  * Contains a header section detailing the purpose of the platform.
  * Displays dynamic metrics cards counting feedback items by category with count-up animations (`<CountUp />`).
  * Features a "live activity" feed status indicating when the newest post was created.
  * Lists previews of the top three most recent feedback items.

### 📥 Submit Feedback (`/submit`)
* **`app/submit/page.jsx`**:
  * Renders the feedback creation form (Title, Description, Category, Attachment).
  * **Field Constraints**:
    * Restricts the description text to `1000` characters. Contains a real-time progress bar indicating limit status (color-shifting from blue to orange to red).
    * Validates attachments to `.png`, `.jpg`, `.jpeg`, or `.pdf` file types under a `10 MB` size threshold.
  * **Keyword Sentiment Matching**: Automatically checks description text for positive and negative expressions to compute simulated sentiment scores in real-time.
  * **Success Modal**: Built as a pop-in overlay dialog (`fixed inset-0 z-50`) with a dark backdrop click-dismiss, keyboard `Escape` close listener, and scroll locks on the page body.

### 📋 Feedback List Page (`/feedback`)
* **`app/feedback/page.jsx`**:
  * Displays a table containing all feedback submissions.
  * **Interactive Filter Controls**:
    * Sorts items by newest first, oldest first, or alphabetically by category using an animated dropdown menu.
    * Dynamically filters items by category tabs (Feature, Bug, Process, Praise) and real-time text query matches.
  * **Loading Skeleton Loader**: Simulates a `900ms` loading state using `useEffect` and displays visual pulse animation grids before displaying matching entries.
  * **Pagination Logic**: Computes index offsets (`Showing X–Y of Z`) and dynamically splits items into pages.
  * **Empty State Pages**: Displays helper panels to clear filters or search query bounds if no matches are found.

### 🔒 Authentication (`/signin` & `/signup`)
* **`app/signin/page.jsx`** & **`app/signup/page.jsx`**:
  * **Signup Form Steps**:
    * **Step 1**: Basic input form with a custom password strength progress estimator (Weak, Fair, Good, Strong).
    * **Step 2**: Emailed confirmation code validation layout containing auto-shifting inputs and code resend cooldowns.
  * **Cognito Badges**: Both authentication cards contain the unified `<CognitoNote text="SECURED BY AMAZON COGNITO" />` label which stays perfectly aligned with the lock SVG icon in a single line.

### 🖼️ Dynamic Favicon
* **`app/icon.jsx`**:
  * Generates a 32x32px PNG favicon using Next.js’s metadata `ImageResponse`.
  * Renders the initials **"CP"** in bold white text against an indigo gradient background.

---

## 2. Reusable UI Components (`/components`)
* **`components/FeedbackDrawer.jsx`**:
  * Side panel drawer that slides out from the right on desktop, or rises as a bottom sheet overlay on mobile layouts.
  * Displays full details of selected items, category tags, sentiment ratings, and mock pre-signed URL download warnings.
* **`components/Navbar.jsx`** & **`components/Footer.jsx`**:
  * Global navigation links and footer layout. Identifies the active page path using Next.js’s `usePathname()`.
* **`components/CognitoNote.jsx`**:
  * Renders a lock badge next to an uppercase security label.
* **`components/CountUp.jsx`** & **`components/Reveal.jsx`**:
  * Utility helper wrappers using simple interval loops to trigger count-up increments and scroll-reveal transitions.

---

## 3. Mock Data Layer (`/lib`)
* **`lib/data.js`**:
  * Exports database structure categories and initial test items.
  * Serves as the localized data provider before backend endpoints are hooked up.

---

## 4. Serverless Backend AWS Lambda Handlers (`/aws/lambda`)
These Node.js modules are deployed to AWS Lambda and handle the API logic.

### 📥 POST /feedback: Create Feedback
* **`aws/lambda/create-feedback/index.mjs`**:
  * Parses the request payload `event.body` and returns a `400 Bad Request` if JSON format is invalid.
  * Validates payload fields:
    * Title must be between 5 and 120 characters.
    * Description must be under 1000 characters.
    * Category must be one of `FEATURE`, `BUG`, `PROCESS`, or `PRAISE`.
  * Generates database entry metadata:
    * Generates a unique UUID `feedbackId`.
    * Timestamps creation in ISO 8601 format.
    * Links optional file attachment keys.
  * Writes the item to the database using `PutCommand` from `@aws-sdk/lib-dynamodb`.
  * Returns a `201 Created` status code with the saved feedback item.

### 📋 GET /feedback: List Feedback
* **`aws/lambda/list-feedback/index.mjs`**:
  * Fetches all records from the database table using the `ScanCommand` from `@aws-sdk/lib-dynamodb`.
  * Sorts items in memory using JS `sort()` to order them by creation date descending (**newest first**).
  * Returns a `200 OK` status code containing the sorted list.
