# Critter Contraption: Automatic Pet Feeder

Demo Site: [firebird1029.github.io/CC-Control/client.html](https://firebird1029.github.io/CC-Control/client.html)

Github: [github.com/Firebird1029/CC-Control](https://github.com/Firebird1029/CC-Control)

**Stack:** Node.js, Node-Cron, Johnny-Five, Socket.io

## Introduction

In middle school, I designed and built a simple pet feeder that could dipense food to my pet turtle by releasing pellets into my turtle's tank. The use case was that I could kept my pet turtle well-fed in case I was on vacation or away from home. Thus, I needed to design a contraption where I could control the pet feeder remotely from anywhere in the world, and I could have the pet feeder automatically dispense feed during scheduled times of the week. By the end of the three-month project, I had a fully-built, functional pet feeder that accomplished these goals.

Even though this was not my first coding project (my oldest Github repo is a [Rock Paper Scissors game](http://firebird1029.github.io/Rock-Paper-Scissors)), this was one of my first projects into Node.js and connecting the backend and frontend of a web application, all in the context of a physical pet feeder. The contraption, which was prototyped with an Arduino and a servo, was one of the key projects that helped spark my interest in electronics, automation, and IoT.

## Design

Here is an excerpt from the design journal I kept while working on the project:

> My first design is an orange shoebox with a hole on the bottom, that drops food via a PVC pipe. A servo, powered by an Arduino controls when the food is being dispensed. I have prototyped the electrical component of it using the Arduino and a breadboard. The servo moves back and forth based on a push of a button. (The button is the first of three ways to dispense the pet food.) I just need to attach the servo to the bottom of the shoebox.
> The second design I am working on is being made out of aluminum metal. Since it's being made out of metal, I need the cover that stops the food from being dispensed to fit perfectly. This design will also be upright, so that it dispenses food at a slope instead of just dropping it.

I am definitely no artist, so the final design's appearance is very basic:

<!-- TODO -->
[image](image)

Luckily, this project was more focused on the electronics components and programming than developing a commercially-viable product.

## IoT

I used Node.js and a popular IoT library called [Johnny-Five](http://johnny-five.io) to control the Arduino. Johnny-Five is a robotics/IoT platform written in JavaScript and run in the Node.js ecosystem, making it seamless to integrate with a web application or other web-based environments. In my case, it allowed me to easily create a client-side interface to control the pet feeder and showcase the project to other students from a school computer.

One of the challenges was converting user input from user-friendly dropdowns to a proper cron job format.

```javascript
socket.on("serverNewTimer", function serverNewTimerInner (ts) {
  var job = [], dayOfWeekMap = {
    Sunday: "0",
    Monday: "1",
    Tuesday: "2",
    Wednesday: "3",
    Thursday: "4",
    Friday: "5",
    Saturday: "6",
    ed: "*",
    eod: "*/2"
  };

  // Convert 1-12 am/pm to 0-23, by converting string to number, then converting back
  var convertedHour = (ts.ampmSelect === "pm" && ts.hourSelect < 12) ?
    (Number(ts.hourSelect) + 12) :
    (ts.ampmSelect === "am" && ts.hourSelect === "12") ?
        0 : ts.hourSelect;

  // Ccreate Cron Time Array
  job[0] = "00";               // Seconds: 0-59
  job[1] = ts.minutesSelect;         // Minutes: 0-59
  job[2] = convertedHour;          // Hours: 0-23
  job[3] = "*";               // Day of Month: 1-31
  job[4] = "*";               // Months: 0-11
  job[5] = dayOfWeekMap[ts.daySelect];   // Day of Week: 0-6

  createJob(job.join(" "), ts);
});

// Cron Job
function createJob (newTime, ts) {
  // Create Job
  schedule["cron" + identification] = new CronJob({
    cronTime: newTime,
    onTick: moveServo,
    start: true
  });

  ts.id = identification;
  schedule["settings" + identification] = ts;
  schedule["settings" + identification].status = "on";
  identification++;

  // Send to Client-Side
  socket.emit("newSchedule", ts);
}
```

As one of my first times working with Node.js and cron jobs, I was able to develop a system of generating and organizing scheduled jobs to automatically dispense food after lots of trial and error. The downside of experimenting with cron jobs was that I had to wait until specifically-scheduled times to see if my jobs got fired correctly. The plus side was that I got to build up my patience and anticipation (and subsequent disappointment when it didn't work).

## Web Interface

Alongside building and programming the electrical component of the project, I also created a minimalistic web interface to control the Arduino. The client site communicated with the backend via Socket.io and was served via Node's native http module.

As I was writing out the client-side interface, I realized that a lot of the code I was writing was repetitive, especially the date and time dropdowns that allowed the user to control the schedule when the pet feeder would dispense food. To solve this problem, I used Emmet abbreviations to generate a majority of the website, and when I needed to make a change, I would modify the abbreviation and re-expand the snippet. While there are undoubtedly more sustainable solutions to writing code, this was a relatively efficient way to write out large portions of repetitive code without having to rely on any build tools, external libraries, or preprocessors, like Pug.js. For example, the code I used to generate the cron job scheduling dropdowns was:

`select#hourSelect>option[value=$]{$}*12^{:}+select#minutesSelect>option[value=$$@0]{$$@0}*60^{ }+select#ampmSelect>option[value=am]{am}+option[value=pm]{pm}`

With this single Emmet abbrevation, I can instantaneously generate 75 lines of tedious HTML code.

Overall, even though this contraption was done in the context of a school project during middle school, I still remember enjoying working on it tremendously, both after school in the middle school engineering building, and late at night in my living room at home. As a fun fact, when I applied to Yale as an undergraduate, one of the sentences of my application essay was inspired by this project.
