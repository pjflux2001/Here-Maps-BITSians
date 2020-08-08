
fetch("./faq_dump/faq1.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        console.log(faqData);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            console.log()
            document.getElementById("faqContent").innerHTML  += `
            <div class="ui accordion">
                <div class="title"><i class="dropdown icon"></i>${data.question}</div>
                <div class="content">${data.answer}</div>
            </div>
            `
        } 
    })
    .catch(error => console.log('error', error));

fetch("./faq_dump/faq2.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        console.log(faqData);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            console.log()
            document.getElementById("faqContent").innerHTML  += `
            <div class="ui accordion">
                <div class="title"><i class="dropdown icon"></i>${data.question}</div>
                <div class="content">${data.answer}</div>
            </div>
            `
        } 
    })
    .catch(error => console.log('error', error));

fetch("./faq_dump/faq3.json")
    .then(response => response.text())
    .then(results => {
        let requiredRegex = /\{([^}]+)\}/g
        var faqData = results.match(requiredRegex);
        console.log(faqData);
        for(var i=0;i<faqData.length;i++){
            var data = JSON.parse(faqData[i]);
            console.log()
            document.getElementById("faqContent").innerHTML  += `
            <div class="ui accordion">
                <div class="title"><i class="dropdown icon"></i>${data.question}</div>
                <div class="content">${data.answer}</div>
            </div>
            `
        } 
    })
    .catch(error => console.log('error', error));
