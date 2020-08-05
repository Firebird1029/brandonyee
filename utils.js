// AnimateCSS Helper Function
const animateCSS = (node, animation, prefix = "animate__") =>
	// We create a Promise and return it
	new Promise((resolve, reject) => {
		const animationName = `${prefix}${animation}`;
		// const node = document.querySelector(element);

		node.classList.add(`${prefix}animated`, animationName);

		// When the animation ends, we clean the classes and resolve the Promise
		function handleAnimationEnd() {
			node.classList.remove(`${prefix}animated`, animationName);
			node.removeEventListener("animationend", handleAnimationEnd);

			resolve("Animation ended");
		}

		node.addEventListener("animationend", handleAnimationEnd);
	});

// Get Scrollbar Width
// https://stackoverflow.com/questions/28360978/css-how-to-get-browser-scrollbar-width-for-hover-overflow-auto-nice-margi
class TempScrollBox {
	constructor() {
		this.scrollBarWidth = 0;

		this.measureScrollbarWidth();
	}

	measureScrollbarWidth() {
		// Add temporary box to wrapper
		let scrollbox = document.createElement("div");

		// Make box scrollable
		scrollbox.style.overflow = "scroll";

		// Append box to document
		document.body.appendChild(scrollbox);

		// Measure inner width of box
		this.scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth;

		// Remove box
		document.body.removeChild(scrollbox);
	}

	get width() {
		return this.scrollBarWidth;
	}
}

const scrollbox = new TempScrollBox();
function getScrollbarWidth() {
	return scrollbox.width;
}
