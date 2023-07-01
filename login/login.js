function loginProcess() {
  // getting data from local storage
  const UsrSavedData = JSON.parse(localStorage.getItem("Usr"));
  // console.log(UsrSavedData);
  var email = document.getElementById("email").value;
  var password = document.getElementById("pass").value;

  if (!UsrSavedData) {
    alert("No user data found or No one has singed up yet...");
    return;
  }
  const curntUser = UsrSavedData.find(
    (user) => user.email === email && user.password === password
  );
  // console.log(curntUser)

  // if user is found then add it in localStorage as a curntUser
  // and render to the shopping page
  if (curntUser) {
    localStorage.setItem("curntUser", JSON.stringify(curntUser));
    window.location.href = "../shop/shop.html";
  } else {
    alert("Enter a correct email or password");
  }
}
