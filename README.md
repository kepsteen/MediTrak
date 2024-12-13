<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img width="408" alt="Screenshot 2024-08-11 at 12 25 23 AM" src="https://github.com/user-attachments/assets/1a1c1efd-3a06-4589-b5a9-7d372b1f85b0">
  </a>

<h3 align="center">MediTrak</h3>

  <p align="center">
    An accessible Full-Stack web application for patients and Caregivers to more easily manage their medications
    <br />
    <a href="http://meditrak.codyepstein.com">View Demo</a>
    ·
    <a href="https://github.com/kepsteen/MediTrak/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/kepsteen/MediTrak/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#purpose">Purpose</a></li>
        <li><a href="#stack">Stack</a></li>
        <li><a href="#packages">Packages</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#challenges">Challenges Faced</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

https://github.com/user-attachments/assets/5df9b247-0fcb-414b-a628-23058aac6a69

### Purpose

<p>As a certified nursing assistant who worked on the frontlines during the pandemic, I gained valuable insights into the healthcare system. I wanted to leverage the skills I had acquired in the inpatient setting to create a meaningful project. The idea came to me after hearing about my mother's struggles to manage my ill grandfather's 20+ medications while living across the country. She diligently maintained countless spreadsheets, updating them each time his medication changed. Hearing about this and numerous incidents where home health nurses had made mistakes dispensing his medication due to not having access to up-to-date information inspired me to build an application to solve these issues. The app would serve patients like my grandfather and caregivers like my mother, providing an accessible solution for medication management.</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Stack

- [![React][React.js]][React-url]
- [![TypeScript][TypeScript.com]][TypeScript-url]
- [![Node][NodeJS.com]][NodeJS-url]
- [![Express][Express.js.com]][Express.js-url]
- [![PostgreSQL][Postgres.com]][Postgres-url]

### Packages

- Shadcn UI Components
- React-pdf
- React-hook-form
- zod - validation
- twilio

<!-- ROADMAP -->

## Features

- Users can register for an account and sign in
- Users can add medications to their list
- Users can view medication interactions
- Users can view their medicaitons List
- Users can schedule medications
- Caregivers can request access to patient accounts
- Users can download a pdf of their medication List
- Users can sign up for text message notifications when a medication runs out

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Challenges

<p>Developing MediTrak in just three weeks posed numerous challenges, from planning and designing to building and deploying. I hoped to streamline this process by using the Shadcn ui library, but this decision brought its own hurdles. While Shadcn allows for easy copy-pasting of components into the codebase, modifying their functionality to fit my use cases proved difficult, requiring frequent referral to the Shadcn and Radix documentation.</p>
<p>The most persistent issue arose while developing the medication schedules feature. When users add medications to their list, they are prompted to schedule each medication in the schedule tab consecutively. However, if a user moved too quickly between medications, a flush resync error would be thrown by the Radix UI checkboxes in the form. Despite thoroughly examining the documentation and researching similar issues faced by other users, I found no solutions that wouldn't compromise the user experience. I determined that the ongoing process needed about four seconds to complete when the component re-rendered. To address this, I implemented a four-second progress bar that appears after each form submission, allowing the process to finish before the user proceeds.
</p>
<p>While using multiple new technologies like Shadcn, Zod, React Hook Form, and React PDF presented various challenges, I embraced the opportunity to expand my skill set. By diligently reading the documentation and persevering through debugging when issues arose, I not only overcame these hurdles but also gained valuable knowledge and experience. Tackling these challenges head-on allowed me to grow as a developer and deliver a more robust, user-friendly application.</p>
</br>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Get a free API Key from Twilio for text notifications https://www.twilio.com/docs
2. Clone the repo
   ```sh
   git clone https://github.com/kepsteen/MediTrak
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a .env from the example
   ```js
   PORT=8080
   DATABASE_URL=postgres://dev:dev@localhost/changeMe
   TOKEN_SECRET=changeMe
   //Optional
   TWILIO_ACCOUNT_SID=changeMe
   TWILIO_AUTH_TOKEN=changeMe
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

<p> Email - codyepstein@gmail.com</p>
<a href="https://www.linkedin.com/in/cody-epstein">LinkedIn</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/cody-epstein
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Postgres.com]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[NodeJS.com]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/en
[Express.js.com]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express.js-url]: https://expressjs.com/
[TypeScript.com]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
