# GraphQL Profile Page

A **web application** that leverages [GraphQL](https://graphql.org/) to query user information from a school database, display profile details, and generate interactive **SVG-based** charts using [Frappe Charts](https://frappe.io/charts). This project was built to **learn and practice** GraphQL, JWT-based authentication, and front-end data visualization.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies and Libraries](#technologies-and-libraries)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Future Improvements](#future-improvements)
8. [License](#license)
9. [On-Site Availability](#on-site-availability)
10. [Contact](#contact)

---

## 1. Project Overview

The main objectives of this project:

- **Learn GraphQL**: Practice writing simple, nested, and argument-based queries.
- **Authentication**: Obtain a JWT by sending credentials to a custom sign-in endpoint (`https://01.gritlab.ax/api/auth/signin`), then use Bearer tokens for GraphQL queries (`https://01.gritlab.ax/api/graphql-engine/v1/graphql`).
- **Build a Profile Page**: Show at least three pieces of user data (e.g., ID, login, XP) on a separate page once the user has logged in.
- **Create SVG Charts**: Generate at least two statistics using Frappe Charts and present them as **line** and **bar** charts.

**Live Demo**: [Hosted on GitHub Pages](https://maryamkheirkhah.github.io/graphql/)

---

## 2. Features

### Login & Logout
- **index.html / index.js**: Collects user credentials, sends them in a POST request (Basic Auth) to obtain a JWT token.
- **Local Storage**: Stores the token on successful login, then redirects to the home page (`home.html`).
- **Logout**: Clears the token and returns the user to the login page.

### Profile Page
- **home.html / home.js**: Fetches user data from multiple tables (like `user`, `transaction`), calculates stats (e.g., XP, pass/fail ratio), and displays them in cards.
- Uses GraphQL queries with the stored JWT token in the request headers.

### SVG-Based Statistics
- **Frappe Charts**: Creates both line and bar charts.
  - Displays XP or other data over time.
  - Renders a separate bar chart for audit ratio or additional stats.

### Hosting
- **GitHub Pages**: The site is publicly hosted at [maryamkheirkhah.github.io/graphql](https://maryamkheirkhah.github.io/graphql/).

---

## 3. Technologies and Libraries

- **HTML / CSS / JavaScript**: Core web technologies for the UI.
- **GraphQL**: Querying the school database.
- **JWT (JSON Web Tokens)**: For authentication & authorization.
- **Axios**: Sending HTTP requests to sign-in and GraphQL endpoints.
- **Frappe Charts**: Providing bar and line charts in SVG.

---

## 4. Setup and Installation

### Clone the Repository
```bash
git clone https://github.com/maryamkheirkhah/graphql.git
cd graphql
```
---

## 5. Usage

### Local Usage
1. **Open `index.html`** in your browser.
2. **Enter credentials** (username/password or email/password). The app requests a JWT, stores it, and navigates to `home.html`.
3. **Home Page** (`home.html`):
   - Displays user info (ID, login, XP, ratio, etc.) retrieved from GraphQL.
   - Shows two Frappe Charts (line + bar) for a visual representation of XP progress or audit ratio.
4. **Logout** by clicking the logout button.

### Hosted Version
You can also visit the **[GitHub Pages link](https://maryamkheirkhah.github.io/graphql/)** for a live demo. *(Note: The site may only function if you have valid credentials and are on the correct network—see [On-Site Availability](#on-site-availability).)*

---

## 6. Future Improvements

- **Additional GraphQL Queries**: Expand the queries, possibly adding mutations or more advanced filters.
- **UI/UX Enhancements**: Improve styling, animations, or transitions for charts.
- **Extended Data Visualization**: Include additional chart types or interactive filters.
- **Role-Based Features**: Implement different layouts or permissions for different user roles (if the API supports it).

---

## 7. License

This project is licensed under the [Kitty Clause License (KCL) 1.0](LICENSE).

---

## 8. On-Site Availability

Please note that this website is configured to work **on-site** with the a01-edu school network and may not function properly outside that environment.

---

## 9. Contact

For questions or issues, please open a GitHub [issue](https://github.com/maryamkheirkhah/graphql/issues) or contact me via [my GitHub profile](https://github.com/maryamkheirkhah).

