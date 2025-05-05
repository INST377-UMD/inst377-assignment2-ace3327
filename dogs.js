function loadCarousel() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(res => res.json())
      .then(data => {
        const carousel = document.getElementById('dogCarousel');
        carousel.innerHTML = '';
  
        data.message.forEach(imgUrl => {
          const img = document.createElement('img');
          img.src = imgUrl;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          carousel.appendChild(img);
        });
  
        simpleslider.getSlider();
      });
  }  
  
  async function loadBreedButtons() {
    const allBreeds = [];
  
    const pages = [1, 2, 3].map(() => Math.floor(Math.random() * 29) + 1);
  
    for (const page of pages) {
      const res = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${page}`);
      const json = await res.json();
      allBreeds.push(...json.data);
    }
  
    const shuffled = allBreeds.sort(() => 0.5 - Math.random());
    const selectedBreeds = shuffled.slice(0, 10);
  
    const container = document.getElementById('breedButtons');
    container.innerHTML = '';
  
    selectedBreeds.forEach(breed => {
      const btn = document.createElement('button');
      btn.className = 'custom-btn';
      btn.textContent = breed.attributes.name;
      btn.setAttribute('data-id', breed.id);
      btn.addEventListener('click', () => showBreedInfo(breed));
      container.appendChild(btn);
    });
  
    window.breedData = selectedBreeds;
  }
  

  function showBreedInfo(breed) {
    const info = document.getElementById('breedInfo');
    info.style.display = 'block';
  
    const attr = breed.attributes;
    const lifeMin = attr.life.min || 'N/A';
    const lifeMax = attr.life.max || 'N/A';
  
    info.innerHTML = `
      <h3>${attr.name}</h3>
      <p><strong>Description:</strong> ${attr.description || 'No description available'}</p>
      <p><strong>Life Span:</strong> ${lifeMin} - ${lifeMax} years</p>
    `;
  }  
  
  window.addEventListener('DOMContentLoaded', () => {
    loadCarousel();
    loadBreedButtons();
  
    if (annyang) {
        annyang.addCommands({
            'load dog breed *breed': (spokenName) => {
              const breed = window.breedData.find(b =>
                b.attributes.name.toLowerCase() === spokenName.toLowerCase()
              );
              if (breed) showBreedInfo(breed);
            }
          });          
    }
  });