// AOS
AOS.init();

// Keyboard Listeners
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

	const panel = document.getElementById(projectID + "-description");
	panel.style.display = "initial"; // display panel
	animateCSS(panel, "slideInLeft"); // animate panel
}

// Close Project Description Panel
function closeProjectDescription() {
	const panels = document.querySelectorAll(".project-panel");
	Array.prototype.forEach.call(panels, function (panel, i) {
		if (panel.style.display === "initial") {
			animateCSS(panel, "slideOutLeft").then(() => {
				panel.style.display = "none";

				document.body.style.overflow = "initial"; // unlock scroll
				document.body.style.paddingRight = "0px"; // preserve scrollbar width
			});
		}
	});
}
document.querySelectorAll(".closeProjectDescriptionButton").forEach((button) => {
	// Bind onclick listener to all close-project-buttons
	button.onclick = closeProjectDescription;
});

// Scrolling
function scrollToID(id) {
	const contact = document.getElementById(id);
	contact.scrollIntoView({ behavior: "smooth" });
}

// Google Docs CMS
function retrieveGoogleCMS(panel) {
	// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
	// https://stackoverflow.com/questions/888875/how-to-parse-html-from-javascript-in-firefox
	// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9

	if (!panel.getAttribute("data-google")) return; // return if no Google CMS URL has been given

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			const googleHTML = document.createElement("div");
			googleHTML.innerHTML = xmlHttp.responseText.replace(/<script(.|\s)*?\/script>/g, "");

			// set contents of iframe to Google's #contents div
			panel.querySelector("iframe").srcdoc = googleHTML.querySelector("#contents").innerHTML;
		}
	};

	xmlHttp.open("GET", "https://cors-anywhere.herokuapp.com/" + panel.getAttribute("data-google"), true);
	xmlHttp.send(null);
}
document.querySelectorAll(".project-panel").forEach((projectPanel) => {
	retrieveGoogleCMS(projectPanel); // retrieve project description content from given Google Docs CMS URL
	projectPanel.querySelector(".iframe-inner-container").style.width = `calc(100% + ${getScrollbarWidth()}px)`; // hide scrollbar of iframe
});
