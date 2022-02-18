function shuffle(array){
    var currentIndex = array.length, temporaryValue, randomIndex
    console.log(currentIndex)

    //if there are elements to shuffle
    while(0 !== currentIndex){
        //pick an element
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        // swap it with current element
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}