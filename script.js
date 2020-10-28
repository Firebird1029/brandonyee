// AOS
AOS.init();

// Scrolling to Element on Page By DOM ID
function scrollToID(id) {
	const contact = document.getElementById(id);
	contact.scrollIntoView({ behavior: "smooth" });
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

	const panel = document.getElementById("panel_" + projectID); // get panel by its ID
	panel.style.display = "initial"; // display panel
	animateCSS(panel, "slideInLeft"); // animate panel
}

// Close Project Description Panel
function closeProjectDescription() {
	const panels = document.querySelectorAll(".project-panel"); // close all panels
	Array.prototype.forEach.call(panels, function (panel, i) {
		if (panel.style.display === "initial") {
			// if this panel is the one shown, then animate it out
			animateCSS(panel, "slideOutLeft").then(() => {
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
		}
	};
	request.send(); // start async XML request
}
// Inject Markdown --> HTML content into all panels
document.querySelectorAll(".project-panel").forEach((projectPanel) => {
	produceProjectContent(projectPanel); // retrieve and parse project description content from Markdown files
});
