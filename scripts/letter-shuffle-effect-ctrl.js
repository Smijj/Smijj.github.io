const letters = "abcdefghijklmnopqrstuvwxyz1234567890#%$@";

document.querySelector(".letter-shuffle-effect").onmouseover = event => {
    let iterations = 0;
    
    // looping the function to achieve a staggered effect
    const interval = setInterval(() => {
        // inner text gets set here.
        // splits the inner text into seperate characters.
        event.target.innerText = event.target.innerText.split("")
        // alters each character to be a different character
        .map((letter, index) => {
            // if the loop has already passed this character during this event call, set it back to its default value (or if its a space).
            if (index < iterations || event.target.dataset.value.charAt(index) == " ") {
                return event.target.dataset.value.charAt(index);
            }
            // if the loop hasn't passed this character, set it to a random character
            return letters[Math.floor(Math.random() * 40)]
        })
        .join("");        
        
        // when the number of iterations >= the length of the original string, stop the loop
        if (iterations >= event.target.dataset.value.length) {
            clearInterval(interval);
        };
        
        // dividing it by 3 means that it'll change the string 3 times before reaching the "second" iteration where the first character no longer changes 
        iterations += 1/3;
    }, 40); // loop gets called every 40ms
};