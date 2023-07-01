if (!localStorage.getItem("curntUser")) {
  window.location.href = "../login/login.html";
}

const UsrSavedData = JSON.parse(localStorage.getItem("Usr"));
const CurrentUserData = JSON.parse(localStorage.getItem("curntUser"));
document.getElementById("Firstname").value = `${CurrentUserData.firstName}`;
document.getElementById("lastname").value = `${CurrentUserData.lastName}`;

function saveinfo() {
  var fname = document.getElementById("Firstname").value;
  var lname = document.getElementById("lastname").value;
  if (CurrentUserData) {
    CurrentUserData.firstName = fname;
    CurrentUserData.lastName = lname;

    const userIndex = UsrSavedData.findIndex(
      (user) => user.email === CurrentUserData.email
    );
    UsrSavedData[userIndex] = CurrentUserData;

    localStorage.setItem("curntUser", JSON.stringify(CurrentUserData));
    localStorage.setItem("Usr", JSON.stringify(UsrSavedData));
    // console.log('CurrentUserData:', CurrentUserData);
    alert("Data save successfully...");
  } else {
    alert("No user data found.");
    return;
  }
}

function changepass() {
  var oldpass = document.getElementById("oldpass").value;
  var newpass = document.getElementById("newpass").value;
  var confirmpass = document.getElementById("confirmpass").value;
  // console.log(oldpass, newpass, confirmpass);

  if (oldpass === CurrentUserData.password) {
    if (newpass === confirmpass) {
      CurrentUserData.password = newpass;

      const userIndex = UsrSavedData.findIndex(
        (user) => user.email === CurrentUserData.email
      );
      UsrSavedData[userIndex] = CurrentUserData;

      localStorage.setItem("curntUser", JSON.stringify(CurrentUserData));
      localStorage.setItem("Usr", JSON.stringify(UsrSavedData));

      // console.log('UsrSavedData:', CurrentUserData, UsrSavedData);
      alert("Password Changed Successfully");
    } else {
      alert("New password and confirm pass not matched.");
    }
  } else {
    alert("Old password incorrect.");
  }
}
function logout() {
  localStorage.removeItem("curntUser");
  window.location.href = "../index.html";
}
