fetch("./faq_dump/faq1.json")
    .then(response => response.text())
    .then(results => console.log(results))
    .catch(error => console.log('error', error));
