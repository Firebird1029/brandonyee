// AOS
AOS.init();

// Open Project Description -- Show a Right Aside
function openProjectDescription(projectID) {
	document.body.style.overflow = "hidden"; // lock scroll
	document.body.style.paddingRight = getScrollbarWidth() + "px"; // preserve scrollbar width
	const aside = document.getElementById(projectID + "-description");
	aside.style.display = "initial";
	animateCSS(aside, "slideInLeft");
}

// Close Project Description
function closeProjectDescription() {
	// Close all Asides
	const asides = document.querySelectorAll(".project-pullout");
	Array.prototype.forEach.call(asides, function (aside, i) {
		animateCSS(aside, "slideOutLeft").then(() => {
			aside.style.display = "none";

			document.body.style.overflow = "initial"; // unlock scroll
			document.body.style.paddingRight = "0px"; // preserve scrollbar width
		});
	});
}
