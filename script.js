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

const navTabes = document.querySelector(".nav-tabs");
const controls = document.querySelector("#controls");
const imgContainer = document.querySelector("#imgContainer");
let init = true;
let initImg = true;

function addImages(imageSets) {
  for (set in imageSets) {
    // add tabs
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.classList.add("nav-link");
    a.setAttribute("aria-current", "page");
    a.setAttribute("href", "#");
    a.textContent = set;
    imageSets[set].tab = a;

    li.appendChild(a);
    navTabes.appendChild(li);

    if (init) {
      a.classList.add("active");
      init = !init;
    }

    a.addEventListener("click", wrapper(imageSets));
    
    // add controls
    for (img of imageSets[set].urls) {
      let anchor = img.slice(img.lastIndexOf("/")+1);

      const label = document.createElement("label");
      label.classList.add("form-label");
      label.setAttribute("for", anchor);
      label.textContent = anchor;

      const input = document.createElement("input");
      input.classList.add("form-range");
      input.setAttribute("type", "range");
      input.setAttribute("id", anchor);

      controls.appendChild(label);
      controls.appendChild(input);

      // add images
      const image = document.createElement("img");
      image.classList.add("img-fluid");
      image.setAttribute("alt", anchor);
      image.src = img;

      if (initImg) {
        image.classList.add("position-relative");
        initImg = !initImg;
      } else {
        image.classList.add("position-absolute", "top-0", "start-0");
      }

      imgContainer.appendChild(image);

      // to know which image to control
      input.imagePartner = image;
      // connect controls to images
      input.addEventListener("change", function() {
        this.imagePartner.style.opacity = this.value/100;
      });
    }

  }
}
function wrapper(imageSets) {
  return function makeActive() {
    this.classList.add("active");
    
    for (set in imageSets) {
      if (set !== this.textContent) {
        imageSets[set].tab.classList.remove("active");
      }
    }
    
  }
}