// gets json data for image urls
fetch("./data.docx")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.text();
  })
  .then(data => {
    addImages(parse(data));
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

// makes a javascript object from a text file
function parse(data) {
  const jsData = {};
  const sections = data.split("\n\n");
  let imageSets;
  for (let i = 1; i < sections.length; i++) {
    imageSets = sections[i].split("\n");
    jsData[imageSets[0]] = {};
    jsData[imageSets[0]].urls = imageSets.slice(1);  
  }
  return jsData;
}

const navTabes = document.querySelector(".nav-tabs");
const controls = document.querySelector("#controls");
const imgContainer = document.querySelector("#imgContainer");
const initOpacity = 0; // change depending on the desired initialization
let init = true;
let initImg = true;
let initDisplay = true;

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
    imageSets[set].elements = [];

    for (img of imageSets[set].urls) {
      // gets the name of the image minus file extension
      let anchor = img.slice(img.lastIndexOf("/")+1, img.lastIndexOf("."));

      const label = document.createElement("label");
      label.classList.add("form-label");
      label.setAttribute("for", anchor);
      label.textContent = anchor;
      imageSets[set].elements.push(label);

      const input = document.createElement("input");
      input.classList.add("form-range");
      input.setAttribute("type", "range");
      input.setAttribute("id", anchor);
      input.value = initOpacity*100;
      imageSets[set].elements.push(input);

      controls.appendChild(label);
      controls.appendChild(input);

      // add images
      const image = document.createElement("img");
      image.classList.add("img-fluid");
      image.setAttribute("alt", anchor);
      image.src = img;
      image.style.opacity = initOpacity;

      imageSets[set].elements.push(image);

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

      if (!initDisplay) {
        label.classList.add("d-none");
        input.classList.add("d-none");
        image.classList.add("d-none");
      }
    }
    if (initDisplay) {
      initDisplay = !initDisplay;
    }
  }
}
function wrapper(imageSets) {
  return function makeActive() {
    this.classList.add("active");

    for (element of imageSets[this.textContent].elements) {
      element.classList.remove("d-none");
    }

    // show controls and images
    
    for (set in imageSets) {
      if (set !== this.textContent) {
        // do stuff to all other sets
        // hide controls and images
        imageSets[set].tab.classList.remove("active");

        for (element of imageSets[set].elements) {
          element.classList.add("d-none");
        }
      }
    }
  }
}