const letters = "abcdefghijklmnopqrstuvwxyz";

document.querySelector(".letter-shuffle-effect").onmouseover = event => {
    let iterations = 0;
    
    const interval = setInterval(() => {
        console.log(event.target.innerText);

        event.target.innerText = event.target.innerText.split("")
        .map((letters, index) => {
            if (index < iterations) {
                // console.log(index);
                // console.log(event.target.dataset.value.innerText.split());
                return event.target.dataset.value.innerText(index);
            }

            return letters[Math.floor(Math.random() * 26)]
        })
        .join("");

        // console.log(event.target.dataset.value.length);
        
        
        if (iterations >= event.target.dataset.value.length) {
            clearInterval(interval);
        };
        
        // console.log(iterations);
        iterations += 1/3;
    }, 30);
};