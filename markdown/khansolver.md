# KhanAcademy Solver

Github: [github.com/Firebird1029/KhanSolver](https://github.com/Firebird1029/KhanSolver)

***Google Chrome Extension***

This was a fun little project that adds keyboard shortcuts to [khanacademy.org](https://khanacademy.org/) and auto-solves basic math problems by parsing (un-parsing?) KaTeX into solvable math equations.

Here's an example of one of the keyboard shortcuts I added to the website, a Command+Enter shortcut to automatically skip to the next question if the previous question was correct (instead of having to manually click through).

```javascript
// Command+enter
$(document).on("keydown",function(e) {
    if((event.ctrlKey || event.metaKey) && event.which == 13) {
        event.preventDefault();
        $("button[data-test-id=exercise-check-answer]").click();
        if ($("button[data-test-id=exercise-next-question]").length) {
            $("button[data-test-id=exercise-next-question]").click();
        }
        return false;
    };
});
```

Here's some of the KaTeX parsing I wrote that produces a valid math equation that can be solved using math.js:

```javascript
evalString = evalString
    .trim()
    .replace(/\\large{([^}]+)}/gi, "$1") // capture text in large format
    .replace(/\\small{([^}]+)}/gi, "$1") // capture text in small format
    .replace(/\\(?:red|orange|yellow|green|blue|purple|maroon)\w{([^}]+)}/gi, "$1") // capture text in colored block
    .replace(/\\(?:red|orange|yellow|green|blue|purple|maroon)\w(\d)/gi, "$1") // capture number in colored block without {}
    .replace(/[=~?]/g, "") // remove = or ~ or ?
    .replace(/\\approx/gi, "") // remove approx =
    .replace(/\\,/g, "").replace(/{,}/g, "") // remove \, and {,}
    .replace(/{}/g, "") // remove {} (placeholder for answer box)
    .replace(/\\text{\s?(?:m|cm)}/gi, "") // remove words m, cm
    .replace(/(\d?)\\d?frac{?(\d+)}?{(\d+)}/g, "($1*$3+$2)/$3") // capture mixed numbers
    .replace(/(\d?)\\d?frac(\d)(\d)/g, "($1*$3+$2)/$3") // capture mixed numbers without {} in mathML
    .replace(/\(\*\d+\+/g, "(") // then re-format fraction if it's not a mixed number aka (*5+6)/7 --> 6/7
    .replace(/\\times/gi, "*") // replace \times with *
    .replace(/\\div/gi, "/") // replace \div with /
    .replace(/^[-+*/]/, "") // remove ±*/ at start of string
    .replace(/[-+*/]$/, ""); // remove ±*/ at end of string
```

Some Khan Academy questions involve finding the sum/difference/etc. of several calculations. I had an idea to automatically calculate those basic functions, similar to how Microsoft Excel/Google Sheets automatically displays a footer row that sums up the numbers in a given column.

```javascript
const calculatedSum = evalAnswerStoredArray.reduce((curSum, curNum) => curSum + (isNaN(curNum) ? 0 : curNum), 0);
const calculatedDiff = Math.abs(2*evalAnswerStoredArray[0] - calculatedSum) || "";
const calculatedProd = evalAnswerStoredArray.reduce((curProd, curNum) => curProd * (isNaN(curNum) ? 1 : curNum), 1);
const calculatedDiv = (Math.max.apply(Math, evalAnswerStoredArray) / Math.min.apply(Math, evalAnswerStoredArray)) || "";
```

I'm sure I could take this project much farther, especially if I integrate it with an API such as WolframAlpha or figure out a better way to parse KaTeX into math symbols instead of doing it manually, which I'm sure there is a library for it out there somewhere.

Although that time would probably be better spent actually learning math.&nbsp; :)
