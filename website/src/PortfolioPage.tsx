import digiiCampusLogo from './assets/digiiCampusLogo.png'
import flikLogo from './assets/flik.png'
import yourDiaryLogo from './assets/yourdiary.png'
import acdcLogo from './assets/acdc.jpeg'

function PortfolioPage() {
  return (
    <>
      <section id="about" className="section">
        <h2>About me</h2>
        <p>
          I&apos;m a software engineer who enjoys turning complex ideas into simple, dependable products. I care
          about readable code, thoughtful architecture, and user experiences that feel effortless.
        </p>
        <p>
          Over the years I&apos;ve worked across the stack, from front-end interfaces to back-end services. I enjoy
          collaborating with product and design, mentoring teammates, and leaving systems a little better than I
          found them.
        </p>
      </section>

      <section id="experience" className="section">
        <h2>Experience</h2>
        <div className="timeline">
          <article className="timeline-item">
            <div className="timeline-logo" aria-hidden="true">
              <img src={digiiCampusLogo} alt="DigiiCampus logo" />
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-role">Product Engineer I</span>
                <span className="timeline-company">DigiiCampus · Digital campus platform</span>
                <span className="timeline-period">April 2025 – Present</span>
              </div>
              <ul className="experience-list">
                <li>
                  Develop backend services and secure REST APIs with Spring Boot, Spring Security, and SQL for HR and
                  payroll systems used by 150+ institutes.
                </li>
                <li>
                  Implement JWT-based authentication and role-based access control, and build admin console modules
                  for HR master data, payroll, and roles &amp; privileges with TypeScript and React.
                </li>
                <li>
                  Contribute to Git-based CI/CD pipelines, debug production issues across backend and frontend, and
                  collaborate with product and QA to ship production-ready features.
                </li>
                <li>
                  Help drive AngularJS → React migration by designing foundational React components and patterns.
                </li>
              </ul>
            </div>
          </article>

          <article className="timeline-item">
            <div className="timeline-logo" aria-hidden="true">
              <img src={flikLogo} alt="Flik.Ai logo" />
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-role">Software Engineer</span>
                <span className="timeline-company">Flik.Ai · Early-stage startup</span>
                <span className="timeline-period">January 2025 – April 2025</span>
              </div>
              <ul className="experience-list">
                <li>
                  Designed and built an interactive UI similar to Drizz.dev with custom React components for tables,
                  modals, search, and cards.
                </li>
                <li>
                  Integrated an AI-powered IT support chatbot for raising tickets with autocomplete-assisted issue
                  selection and browser automation for DOM element testing.
                </li>
                <li>
                  Embedded an interactive Jira issue-tracking UI inside Trudesk and customized the open-source
                  ticketing system using React, Material UI, TailwindCSS, and Bootstrap.
                </li>
                <li>
                  Created dashboards with real-time data visualizations using D3.js and Chart.js.
                </li>
              </ul>
            </div>
          </article>

          <article className="timeline-item">
            <div className="timeline-logo" aria-hidden="true">
              <img src={yourDiaryLogo} alt="YourDiary logo" />
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-role">Software Engineer</span>
                <span className="timeline-company">YourDiary</span>
                <span className="timeline-period">Product work</span>
              </div>
              <ul className="experience-list">
                <li>
                  Implemented an end-to-end encrypted location snapshotting feature using AES‑256 and Google Maps APIs
                  with a native Android (Java) app and PHP backend.
                </li>
                <li>
                  Added OAuth 2.0 authentication with FastAPI in Python and built a web version of YourDiary using
                  React and Redux.
                </li>
                <li>
                  Managed data storage and retrieval with MySQL to support secure, reliable diary entries.
                </li>
              </ul>
            </div>
          </article>

          <article className="timeline-item">
            <div className="timeline-logo" aria-hidden="true">
              <img src={acdcLogo} alt="ACDC Electric Infrastructure logo" />
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-role">Full-Stack Developer Intern</span>
                <span className="timeline-company">ACDC Electric Infrastructure Pvt. Ltd.</span>
                <span className="timeline-period">May 2023 – July 2023</span>
              </div>
              <ul className="experience-list">
                <li>
                  Integrated a CMS with Node.js and the Open Charge Point Protocol (OCPP) to streamline EV charging
                  station operations.
                </li>
                <li>
                  Built a React Native mobile app and a Node.js / Express backend with PostgreSQL to deliver a
                  responsive, full-stack charging experience.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section id="projects" className="section">
        <h2>Projects</h2>
        <div className="grid">
          <article className="card">
            <h3>AI Portfolio News Intelligence Platform</h3>
            <p>
              Real-time news ingestion pipeline built with Spring Boot and MySQL, applying LLM-based summarization and
              event detection to cluster stock-level news for user portfolios.
            </p>
            <p>
              NLP sentiment analysis and a scheduled notification pipeline that delivers daily portfolio summaries and
              event-driven alerts via background jobs.
            </p>
            <p className="meta">Tech: Spring Boot, MySQL, LLMs, NLP, sentiment analysis</p>
          </article>

          <article className="card">
            <h3>AI-Powered IT Support Assistant</h3>
            <p>
              LLM-driven assistant using the OpenAI API that auto-classifies support requests and creates tickets;
              integrated with helpdesk workflows end to end.
            </p>
            <p>
              Extended Trudesk with custom routing modules and API integration so classified requests land in the right
              queues with minimal manual triage.
            </p>
            <p className="meta">Tech: OpenAI API, Python, FastAPI, Trudesk</p>
          </article>

          <article className="card">
            <h3>CheckPoint · Location bookmarking app</h3>
            <p>
              Full‑stack location bookmarking application that lets users save, revisit, and navigate to places using
              an interactive map experience.
            </p>
            <p>
              Built a React Native frontend talking to a Node.js / Express backend with RESTful APIs for creating,
              listing, and managing saved locations, backed by Google Maps for geolocation and navigation.
            </p>
            <p className="meta">Tech: React Native, Node.js, Express, Google Maps APIs</p>
          </article>
        </div>
      </section>

      <section id="contact" className="section">
        <h2>Contact</h2>
        <p>
          The easiest way to reach me is via email. I&apos;m open to discussing full-time roles, freelance work, or
          interesting collaborations.
        </p>
        <div className="contact-links">
          <a href="mailto:prajawal800@gmail.com">
            <span className="contact-icon" aria-hidden="true">
              @
            </span>
            <span>prajawal800@gmail.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/prajawal-gupta-8583a2243/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-icon" aria-hidden="true">
              in
            </span>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/00hunter" target="_blank" rel="noreferrer">
            <span className="contact-icon" aria-hidden="true">
              GH
            </span>
            <span>GitHub</span>
          </a>
        </div>
      </section>
    </>
  )
}

export default PortfolioPage

