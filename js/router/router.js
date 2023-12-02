function setRouter() {
  switch (window.location.pathname) {
    case "/":
    case "/index.html":
    case "/register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname = "/dashboard.html";
      }
      break;
    case "/dashboard.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname = "/index.html";
      }
      break;

    default:
      break;
  }
}

export { setRouter };
