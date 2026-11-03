# Outdoor Reporter

Outdoor Reporter is a mobile-friendly Progressive Web Application (PWA) developed using React and Vite. It allows users to report outdoor issues and record environmental observations by adding descriptions, photographs and geographical locations.

The application uses IndexedDB through Dexie.js to store reports locally in the browser. Users can create, view, update and delete their saved reports.

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

Before running the application, install:

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

```bash
cd Outdoor_Site_Reporter
```

### 3. Install Dependencies

Run the following command to install the project dependencies:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Vite will display a local development URL in the terminal. Open that URL in your web browser to access Outdoor Reporter.

## Usage Guidelines

### 1. Home Page

Open the application and choose one of the two available options:

- **Report an Issue:** Record a problem found in an outdoor environment.
- **Record an Observation:** Record something observed in the natural environment.

### 2. Create a Report

Complete the reporting form by:

1. Selecting the report type.
2. Choosing a category.
3. Entering a report title.
4. Adding a description.
5. Adding a photograph using the device camera or uploading an existing image.
6. Capturing your current geographical location, if required.
7. Saving the report.

### 3. View and Manage Reports

Open the Reports page to view previously saved reports.

Users can:

- View saved report information and photographs.
- Edit existing report details.
- Delete reports that are no longer needed.

## Additional Setup Notes

### Camera and Location Permissions

The application uses the device camera through React Webcam and the browser Geolocation API.

When using these features, allow camera and location access when requested by the browser.

Camera and geolocation access require a secure context, such as HTTPS, or localhost during local development.

### Local Data Storage

Reports are stored in the browser's IndexedDB database using Dexie.js.

The database is named `OutdoorReporterDB` and contains a `reports` table.

Saved reports remain available in the same browser unless the relevant site data is cleared.

### Progressive Web App

The application is configured as a PWA using `vite-plugin-pwa`.

It includes a web app manifest, application icons and service worker registration with automatic updates.

On supported browsers, users can install the application using the browser's installation option.

## GitHub Repository

[Outdoor Reporter – Source Code](https://github.com/Iram-Rafique/Outdoor_Site_Reporter)