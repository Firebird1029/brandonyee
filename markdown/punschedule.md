<!-- Sorry, this page is still being written! &nbsp; &#x1F613; -->

# Punschedule

**Stack**: Node.js, Express, Pug, Socket.io, NightmareJS, Cheerio, DigitalOcean  

*Collab*: [Jason Tay](https://github.com/jason2020)

Punschedule uses NightmareJS, a Node-based "headless" web scraper, similar to Puppeteer or PhantomJS. However, we ran into an issue where upon deployment in a DigitalOcean droplet, NightmareJS could not run because it was not a true headless browser. It runs on Electron, and Electron requires a framebuffer to render. The solution was to use Xvfb, an emulated virtual framebuffer, so that we could deploy Punschedule in a containerized, shell-based environment. After parsing a student's schedule from the webscraper and cleaning it with Cheerio, we sent it to the client-side via socket.io. With the data, we pre-filled form fields that allowed a student to quickly confirm their class schedule without needing to manually type out of each of their courses and course times.

<!-- For security reasons, the demo no longer includes the webscraper. -->
