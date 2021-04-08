(function() {
    let a = document.createElement("button");
    a.style = "position: fixed; top: 0; right: 0; font-size: 24px; z-index: 99999";
    a.innerText = "Eval";
    a.addEventListener("click", function() {
        alert(require('util').inspect(eval(prompt()), false, 0))
    });
    document.body.appendChild(a);
    setInterval(function() {
        a.style = "position: fixed; top: 0; right: 0; font-size: 24px; z-index: 99999";
    }, 100);
})();