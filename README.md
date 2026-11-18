# Outdoor Reporter

**Live Application:** https://outdoor-site-reporting.vercel.app/

Outdoor Reporter is a mobile-friendly Progressive Web Application (PWA) developed using React and Vite. It allows users to report outdoor issues and record environmental observations by providing descriptions, photographs and geographical locations.

The application uses IndexedDB through Dexie.js to store reports locally in the browser. Users can create, view, update and delete their saved reports. The application also supports offline access to locally stored reports.

## Technologies Used

- React 19
- Vite
- JavaScript
- Tailwind CSS 4
- React Router
- Dexie.js
- IndexedDB
- React Webcam
- Browser Geolocation API
- vite-plugin-pwa
- Lucide React (icons)

## Installation Instructions

### Requirements

Before running the application, make sure the following tools are installed:

- Node.js
- npm
- Git
- Visual Studio Code or another code editor

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Iram-Rafique/Outdoor_Site_Reporter.git
```

### 2. Open the Project Directory

Navigate to the project folder:

```bash
cd Outdoor_Site_Reporter
```

### 3. Install Dependencies

Install the required project dependencies:

```bash
npm install
```

### 4. Start the Development Server

Run the following command:

```bash
npm run dev
```

Vite will display a local development URL in the terminal. Open this URL in a web browser to access Outdoor Reporter.

## Usage Guidelines

### 1. Home Page

Open the application and choose one of the two available options:

- **Report an Issue:** Record a problem found in an outdoor environment, such as damaged facilities or maintenance issues.
- **Record an Observation:** Record something observed in the natural environment, such as wildlife sightings or environmental changes.

### 2. Create a Report

Complete the reporting form by following these steps:

1. Select the report type.
2. Choose a category.
3. Enter a report title.
4. Add a description.
5. Add a photograph using the device camera or upload an existing image.
6. Capture your current geographical location, if required.
7. Save the report.

### 3. View and Manage Reports

Open the **My Reports** page to view previously saved reports.

Users can:

- View saved report information and photographs.
- Edit existing report details.
- Delete reports that are no longer needed.

## Additional Setup Notes

### Camera and Location Permissions

The application uses React Webcam to access the device camera and the browser Geolocation API to retrieve the user's geographical coordinates.

When using these features, allow camera and location access when requested by the browser.

Camera and geolocation access require a secure context, such as HTTPS, or localhost during local development.

If camera permission is denied, the application cannot access the device camera. If location permission is denied, the application cannot retrieve the user's current geographical coordinates.

### Local Data Storage

Reports are stored locally in the browser's IndexedDB database using Dexie.js.

The database is named `OutdoorReporterDB` and contains a `reports` table.

Saved reports remain available in the same browser unless the relevant site data is cleared.

### Progressive Web Application (PWA)

The application is configured as a PWA using `vite-plugin-pwa`.

It includes:

- A web app manifest.
- Application icons.
- Service worker registration.
- Automatic service worker updates.

On supported browsers, users can install Outdoor Reporter using the browser's installation option.

### Installing the PWA

1. Open the deployed application in a supported browser.
2. Select the browser's **Install App** option, if available.
3. Follow the browser instructions to install Outdoor Reporter.
4. Open the installed application from your device.
   
### Agentic Deployment

Outdoor Reporter uses a Node.js deployment agent to automate the application deployment process. The agent is triggered through GitHub Actions whenever new code is pushed to the GitHub repository.The deployment agent also includes a test-checking step. As no automated test suite is currently configured, this step is skipped, and the agent continues with the code quality checks and remaining deployment stages.

The deployment process includes the following steps:

1. **Trigger:** GitHub Actions starts the workflow following a code push.
2. **Code Checks:** The agent checks the code quality using ESLint.
3. **Build:** The application is built to check for build errors.
4. **PWA Checks:** The agent checks for the required PWA files, including the web app manifest and service worker.
5. **Deployment:** The application is deployed to Vercel.
6. **Health Check:** The agent checks whether the deployed application is accessible and healthy.
7. **Rollback:** If the health check fails, the agent attempts to restore the previous production deployment and checks its health.It escalates to human verification if recovery cannot be confirmed.

**Deployment Workflow:**

`GitHub Push → GitHub Actions → Node.js Agent → Code Checks → Build → PWA Checks → Vercel Deployment → Health Check`

The deployment agent also includes a limit of one rollback attempt to prevent repeated rollback operations.

## GitHub Repository

The complete source code for Outdoor Reporter is available on GitHub:

**GitHub Repository:** https://github.com/Iram-Rafique/Outdoor_Site_Reporter
