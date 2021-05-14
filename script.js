// AOS
AOS.init();

// Highlight.js
hljs.highlightAll();

// Scrolling to Element on Page By DOM ID
function scrollToID(id) {
	const contact = document.getElementById(id);
	contact.scrollIntoView({ behavior: "smooth" });
}

// Show NPM Meme
function showNPMmeme() {
	if (!document.getElementById("npmMeme").children.length) {
		// show meme video
		const video = document.createElement("video");
		video.setAttribute("width", 320);
		video.setAttribute("autoplay", true);
		video.setAttribute("muted", true);
		video.style.margin = "1rem";
		video.style.maxWidth = "100%"; // for mobile screens
		video.muted = true; // fix mute glitch
		const source = document.createElement("source");
		source.setAttribute("src", "/assets/npm_meme.mp4");
		source.setAttribute("type", "video/mp4");
		video.appendChild(source);
		document.getElementById("npmMeme").appendChild(video);
	} else {
		// hide meme video
		document.getElementById("npmMeme").removeChild(document.getElementById("npmMeme").firstChild);
	}
}

// Keyboard Listeners to Close Project Description
// https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-pure-js-or-jquery
document.onkeydown = function (evt) {
	evt = evt || window.event;
	var isEscape = false;
	if ("key" in evt) {
		isEscape = evt.key === "Escape" || evt.key === "Esc";
	} else {
		isEscape = evt.keyCode === 27;
	}
	if (isEscape) {
		closeProjectDescription();
	}
};

// Open Project Description -- Show a Panel
function openProjectDescription(projectID) {
	document.body.style.overflow = "hidden"; // lock scroll of body
	document.body.style.paddingRight = getScrollbarWidth() + "px"; // preserve scrollbar width of body

	const panel = document.getElementById("panel_" + projectID); // get project panel by its ID

	const xButton = document.querySelector(".closeProjectDescriptionButtonContainer");
	xButton.style.display = "initial";
	panel.appendChild(xButton);

	panel.style.display = "initial"; // display panel
	// animate panel
	animateCSS(panel, "slideInRight").then(() => {
		document.body.appendChild(xButton);
		xButton.style.top = "calc(2rem + 1px)";
		xButton.style.right = "calc(2rem + 1px)";
	});
}

// Close Project Description Panel
function closeProjectDescription() {
	const panels = document.querySelectorAll(".project-panel"); // close all panels

	const xButton = document.querySelector(".closeProjectDescriptionButtonContainer");

	Array.prototype.forEach.call(panels, function (panel, i) {
		if (panel.style.display === "initial") {
			panel.appendChild(xButton);
			xButton.style.top = "1rem";
			xButton.style.right = "1rem";

			// if this panel is the one shown, then animate it out
			animateCSS(panel, "slideOutRight").then(() => {
				panel.style.display = "none";

				document.body.style.overflow = "initial"; // unlock scroll
				document.body.style.paddingRight = "0px"; // preserve scrollbar width
			});
		}
	});
}
// Bind onclick listener to all close-project-buttons
document.querySelectorAll(".closeProjectDescriptionButton").forEach((button) => {
	button.onclick = closeProjectDescription;
});

// Markdown to HTML
// https://github.com/showdownjs/showdown
// https://stackoverflow.com/questions/38132510/equivalent-to-load-without-jquery
async function produceProjectContent(projectPanel) {
	const projectID = projectPanel.getAttribute("id").substring("panel_".length); // get the ID of the project
	const request = new XMLHttpRequest();
	request.open("GET", `/markdown/${projectID}.md`, true); // send XML request to retrieve the markdown file
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			const converter = new showdown.Converter(); // create new showdown converter instance
			// make HTML from the XML response text, then set the project panel content to the newly-made HTML
			projectPanel.querySelector(".project-content").innerHTML = converter.makeHtml(request.responseText);

			hljs.highlightAll();
		}
	};
	request.send(); // start async XML request
}
// Inject Markdown --> HTML content into all panels
document.querySelectorAll(".project-panel").forEach((projectPanel) => {
	produceProjectContent(projectPanel); // retrieve and parse project description content from Markdown files
});
