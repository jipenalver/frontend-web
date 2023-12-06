import {
  backendURL,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// Get Logged User Info
getLoggedUser();

// Get All Data
getDatas();

async function getDatas() {
  // Get Carousel API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/carousel/all", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();

    // Get Each Json Elements and merge with Html element and put it into a container
    let container = "";
    let indicators = "";
    // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
    json.forEach((element, index) => {
      container += `<div class="carousel-item 
                        ${index == 0 ? "active" : ""}
                        ">
                        <img src="${backendURL}/storage/${element.image_path}" 
                        class="d-block w-100" alt="${element.carousel_name}" />
                        <div class="carousel-caption">
                            <h1>${element.carousel_name}</h1>
                            <p>${element.description}</p>
                        </div>
                    </div>`;
      indicators += `<button type="button" data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="${index}"
                      class="${index == 0 ? "active" : ""}"
                      aria-current="${index == 0 ? "true" : ""}"
                      aria-label="${element.carousel_name}"
                    ></button>`;
    });
    // Use the container to display the fetch data
    document.getElementById("get_data").innerHTML = container;
    document.getElementById("get_indicators").innerHTML = indicators;
  }
  // Get response if 400+ or 500+ status code
  else {
    errorNotification("HTTP-Error: " + response.status);
  }
}
