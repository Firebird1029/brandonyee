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
	document.body.style.overflow = "hidden"; // lock scroll
	document.body.style.paddingRight = getScrollbarWidth() + "px"; // preserve scrollbar width
	const panel = document.getElementById(projectID + "-description");
	panel.style.display = "initial";
	animateCSS(panel, "slideInLeft");
}

// Close Project Description Panel
function closeProjectDescription() {
	const panels = document.querySelectorAll(".project-panel");
	Array.prototype.forEach.call(panels, function (panel, i) {
		if (panel.style.display !== "none") {
			animateCSS(panel, "slideOutLeft").then(() => {
				panel.style.display = "none";

				document.body.style.overflow = "initial"; // unlock scroll
				document.body.style.paddingRight = "0px"; // preserve scrollbar width
			});
		}
	});
}
