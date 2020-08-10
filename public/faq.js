var faqCounter = 1;
var segmentNo = 1;


document.getElementById('faqContent').innerHTML += `
    <div class="ui segment" id="faqSegment${segmentNo}" style="display:none;min-height:140vh;">
    </div>
`

fetch("./faq_dump/faq1.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            if(removeTags(data.answer)){
                document.getElementById(`faqSegment${segmentNo}`).innerHTML  += `
                <div class="ui styled fluid accordion" id="faq${faqCounter}" >
                    <div class="title" onclick="accordionClicked('faq${faqCounter}')"><i class="dropdown icon"></i>${data.question}</div>
                    <div class="content"><p class="transition hidden">${data.answer}</p></div>
                </div>
                `
                faqCounter += 1;
                if( faqCounter%25 == 0){
                    segmentNo += 1;
                    document.getElementById('faqContent').innerHTML += `
                    <div class="ui segment" id="faqSegment${segmentNo}" style="display:none;min-height:140vh;">
                    </div>
                    `
                }
            }
        }
    })
    .catch(error => console.log('error', error));

fetch("./faq_dump/faq2.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            if(removeTags(data.answer)){
                document.getElementById(`faqSegment${segmentNo}`).innerHTML  += `
                <div class="ui styled fluid accordion" id="faq${faqCounter}" >
                    <div class="title" onclick="accordionClicked('faq${faqCounter}')"><i class="dropdown icon"></i>${data.question}</div>
                    <div class="content"><p class="transition hidden">${data.answer}</p></div>
                </div>
                `
                faqCounter += 1;
                if( faqCounter%25 == 0){
                    segmentNo += 1;
                    document.getElementById('faqContent').innerHTML += `
                    <div class="ui segment" id="faqSegment${segmentNo}" style="display:none;min-height:140vh;">
                    </div>
                    `
                }
            }
        }
    })
    .catch(error => console.log('error', error));

fetch("./faq_dump/faq3.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            if(removeTags(data.answer)){
                document.getElementById(`faqSegment${segmentNo}`).innerHTML  += `
                <div class="ui styled fluid accordion" id="faq${faqCounter}" >
                    <div class="title" onclick="accordionClicked('faq${faqCounter}')"><i class="dropdown icon"></i>${data.question}</div>
                    <div class="content"><p class="transition hidden">${data.answer}</p></div>
                </div>
                `
                faqCounter += 1;
                if( faqCounter%25 == 0){
                    segmentNo += 1;
                    document.getElementById('faqContent').innerHTML += `
                    <div class="ui segment" id="faqSegment${segmentNo}" style="display:none;min-height:140vh;">
                    </div>
                    `
                }
            }
        }
        
    })
    .then(function(){
        // keep account of active segment
        var activeSegment = 1;
        
        // Adding page nav at bottom
        document.getElementById('faqPageNavContainer').innerHTML += `
            <div class="ui horizontal list" id="faqPageNav" ></div>
        `;
        
        // Adding items in page nav 
        var segments = document.getElementById('faqContent').children;
        console.log(segments.length)
        for(var j=1;j<=segments.length;j++){
            document.getElementById('faqPageNav').innerHTML +=`
            <a class="item" id="segmentPageTab${j}" onclick="displayFaqSegment(${j},${segments.length})">${j}</a>
            `
        }

        // Displaying first Page initially
        displayFaqSegment(activeSegment,segments.length);
    })
    .catch(error => console.log('error', error));



// nav page function
function displayFaqSegment(i,k){
    for(var j=1;j<=k;j++){
        if(j!=i){
            document.getElementById(`segmentPageTab${j}`).style.fontWeight = "normal";
            document.getElementById(`faqSegment${j}`).style.display = "none";
        }else{
            document.getElementById(`segmentPageTab${j}`).style.fontWeight = "bolder";
            document.getElementById(`faqSegment${j}`).style.display = "block";
        }
    }   
}

// Function to remove unnecessary tags from scrapped data
function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
}


// Function for  Accordion 
function accordionClicked(i){
    console.log('clicked');
    var childElements = document.getElementById(i).children;
    if(childElements[0].classList.contains('active')){
        childElements[0].classList.remove('active');
        childElements[1].classList.remove('active');
    }
    else{
        childElements[0].classList.add('active');
        childElements[1].classList.add('active');
    }
};
