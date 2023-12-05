function setRouter() {
  switch (window.location.pathname) {
    // If you are logged in you cant access outside pages
    case "/":
    case "/index.html":
    case "/register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname = "/dashboard.html";
      }
      break;
    // If you are not logged in you cant access dashboard pages
    case "/dashboard.html":
    case "/presentation.html":
    case "/slides.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname = "/";
      }
      break;

    default:
      break;
  }
}

export { setRouter };
