import {
  backendURL,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// Get Logged User Info
getLoggedUser();

// Get All Data
getDatas();

async function getDatas() {
  // Get Carousel API Endpoint
  const response = await fetch("http://backend.test/api/carousel", {
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
    json.forEach((element) => {
      const date = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12">
                        <div class="card w-100 mt-3" data-id="${element.carousel_item_id}">

                            <div class="row">
                                <div class="col-sm-4">
                                    <img src="${element.image_path}" width="100%" height="225px">
                                </div>

                                <div class="col-sm-8">
                                    <div class="card-body">
                                
                                        <div class="dropdown float-end">
                                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item" href="#" id="btn_edit" data-id="${element.carousel_item_id}">Edit</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#" id="btn_delete" data-id="${element.carousel_item_id}">Delete</a>
                                                </li>
                                            </ul>
                                        </div>
                                    
                                        <h5 class="card-title">${element.carousel_name}</h5>
                                        <h6 class="card-subtitle mb-2 text-body-secondary">
                                            <small>${date}</small>
                                        </h6>
                                        <p class="card-text">${element.description}</p>

                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </div>`;
    });

    // Use the container to display the fetch data
    document.getElementById("get_data").innerHTML = container;

    // document.querySelectorAll("#btn_edit").forEach((element) => {
    //   element.addEventListener("click", editAction);
    // });

    // document.querySelectorAll("#btn_delete").forEach((element) => {
    //   element.addEventListener("click", deleteAction);
    // });
  }
  // Get response if 400+ or 500+ status code
  else {
    errorNotification("HTTP-Error: " + response.status);
  }
}
