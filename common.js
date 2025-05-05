if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        const lowerPage = page.toLowerCase();
        if (lowerPage.includes('home')) window.location.href = 'index.html';
        else if (lowerPage.includes('stocks')) window.location.href = 'stocks.html';
        else if (lowerPage.includes('dogs')) window.location.href = 'dogs.html';
      }
    };
  
    annyang.addCommands(commands);
  }
  
  function startListening() {
    if (annyang) annyang.start();
  }
  
  function stopListening() {
    if (annyang) annyang.abort();
  }  