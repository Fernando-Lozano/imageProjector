// gets json data for image urls
fetch("./data.json") // change this url when posting to github
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(data => {
    addImages(data.imageSets);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

function addImages(imageSets) {
  
}
