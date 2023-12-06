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

async function getDatas(url = "", keyword = "") {
  // Add Loading if pagination or search is used; Remove if its not needed
  if (url != "" || keyword != "") {
    document.getElementById(
      "get_data"
    ).innerHTML = `<div class="col-sm-12 d-flex justify-content-center align-items-center">
                      <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>
                      <b class="ms-2">Loading Data...</b>
                  </div>`;
  }

  // To cater pagination and search feature
  let queryParams =
    "?" +
    (url != "" ? new URL(url).searchParams + "&" : "") + // Remove this line if not using pagination
    (keyword != "" ? "keyword=" + keyword : "");

  // Get Carousel API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/carousel" + queryParams, {
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
    // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
    json.data.forEach((element) => {
      const date = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12">
                        <div class="card w-100 mt-3" data-id="${element.carousel_item_id}">

                            <div class="row">
                                <div class="col-sm-4">
                                    <img src="${backendURL}/storage/${element.image_path}" width="100%" height="225px">
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

    // Assign click event on Edit Btns
    document.querySelectorAll("#btn_edit").forEach((element) => {
      element.addEventListener("click", editAction);
    });

    // Assign click event on Delete Btns
    document.querySelectorAll("#btn_delete").forEach((element) => {
      element.addEventListener("click", deleteAction);
    });

    // Get Each Json Elements and merge with Html element and put it into a container
    let pagination = "";
    // Now caters pagination; Remove below if no pagination
    json.links.forEach((element) => {
      pagination += `<li class="page-item">
                        <a class="page-link
                        ${element.url == null ? " disabled" : ""}
                        ${element.active ? " active" : ""}
                        " href="#" id="btn_paginate" data-url="${element.url}">
                            ${element.label}
                        </a>
                    </li>`;
    });
    // Use the container to display the fetch data
    document.getElementById("get_pagination").innerHTML = pagination;

    // Assign click event on Page Btns
    document.querySelectorAll("#btn_paginate").forEach((element) => {
      element.addEventListener("click", pageAction);
    });
  }
  // Get response if 400+ or 500+ status code
  else {
    errorNotification("HTTP-Error: " + response.status);
  }
}

// Search Form
const form_search = document.getElementById("form_search");
form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);

  getDatas("", formData.get("keyword"));
};

// Submit Form Functionality; This is for Create and Update
const form_slides = document.getElementById("form_slides");

form_slides.onsubmit = async (e) => {
  e.preventDefault();

  // Disable Button
  document.querySelector("#form_slides button[type='submit']").disabled = true;
  document.querySelector(
    "#form_slides button[type='submit']"
  ).innerHTML = `<div class="spinner-border me-2" role="status">
                      </div>
                      <span>Loading...</span>`;

  // Get Values of Form (input, textarea, select) set it as form-data
  const formData = new FormData(form_slides);

  // Check key/value pairs of FormData; Uncomment to debug
  // for (let [name, value] of formData) {
  //   console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
  // }

  let response;
  // Check if for_update_id is empty, if empty then it's create, else it's update
  if (for_update_id == "") {
    // Fetch API Carousel Item Store Endpoint
    response = await fetch(backendURL + "/api/carousel", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });
  }
  // for Update
  else {
    // Add Method Spoofing to cater Image upload coz you are using FormData; Comment if no Image upload
    formData.append("_method", "PUT");
    // Fetch API Carousel Item Update Endpoint
    response = await fetch(backendURL + "/api/carousel/" + for_update_id, {
      method: "POST", // Change to PUT/PATCH if no Image Upload
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      // Comment body below; if with Image Upload; form-data equivalent
      body: formData,
      // Uncomment body below; if no Image Upload; form-urlencoded equivalent
      // body: new URLSearchParams(formData)
    });
  }

  // Get response if 200-299 status code
  if (response.ok) {
    // Uncomment for debugging purpose
    // const json = await response.json();
    // console.log(json);

    // Reset Form
    form_slides.reset();

    successNotification(
      "Successfully " +
        (for_update_id == "" ? "created" : "updated") +
        " slide.",
      10
    );

    // Close Modal Form
    document.getElementById("modal_close").click();

    // Reload Page
    getDatas();
  }
  // Get response if 422 status code
  else if (response.status == 422) {
    const json = await response.json();

    // Close Modal Form
    document.getElementById("modal_close").click();

    errorNotification(json.message, 10);
  }

  // Always reset for_update_id to empty string
  for_update_id = "";

  document.querySelector("#form_slides button[type='submit']").disabled = false;
  document.querySelector("#form_slides button[type='submit']").innerHTML =
    "Submit";
};

// Delete Functionality
const deleteAction = async (e) => {
  // Use JS Confirm to ask for confirmation; You can use bootstrap modal instead of this
  if (confirm("Are you sure you want to delete?")) {
    // Get Id from data-id attrbute within the btn_delete anchor tag
    const id = e.target.getAttribute("data-id");

    // Background red the card that you want to delete
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "red";

    // Fetch API Carousel Item Delete Endpoint
    const response = await fetch(backendURL + "/api/carousel/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    // Get response if 200-299 status code
    if (response.ok) {
      // Uncomment for debugging purpose
      // const json = await response.json();
      // console.log(json);

      successNotification("Successfully deleted slide.", 10);

      // Remove the Card from the list
      document.querySelector(`.card[data-id="${id}"]`).remove();
    }
    // Get response if 400+ or 500+
    else {
      errorNotification("Unable to delete!", 10);

      // Background white the card if unable to delete
      document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
        "white";
    }
  }
};

// Update Functionality
const editAction = async (e) => {
  // Get Id from data-id attrbute within the btn_edit anchor tag
  const id = e.target.getAttribute("data-id");

  // Show Functionality function call
  showData(id);

  // Show Modal Form
  document.getElementById("modal_show").click();
};

// Storage of Id of chosen data to update
let for_update_id = "";

// Show Functionality
const showData = async (id) => {
  // Background yellow the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "yellow";

  // Fetch API Carousel Item Show Endpoint
  const response = await fetch(backendURL + "/api/carousel/" + id, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();
    // console.log(json);

    // Store id to a variable; id will be utilize for update
    for_update_id = json.carousel_item_id;

    // Display json response to Form tags; make sure to set id attrbute on tags (input, textarea, select)
    document.getElementById("carousel_name").value = json.carousel_name;
    document.getElementById("description").value = json.description;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
    document.querySelector("#form_slides button[type='submit']").textContent =
      "Update Info";
  }
  // Get response if 400+ or 500+
  else {
    errorNotification("Unable to show!", 10);
  }
};

// Page Functionality
const pageAction = async (e) => {
  // Get url from data-url attrbute within the btn_paginate anchor tag
  const url = e.target.getAttribute("data-url");

  // Refresh card list
  getDatas(url);
};
