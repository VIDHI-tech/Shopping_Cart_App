if (!localStorage.getItem("curntUser")) {
  window.location.href = "../login/login.html";
}

const itemContainer = document.querySelector(".items");
const listContainer = document.querySelector(".list-container");
const totalPrice = document.getElementById("total-price");
var cartItem = [];

const currentUser = JSON.parse(localStorage.getItem("curntUser"));

if (currentUser) {
  let cartArr = currentUser.myCart;
  cartItem = cartArr;
  showCartItem(cartItem);
} else {
  totalPrice.innerHTML = "$0.00";
}

function showCartItem(Arr) {
  itemContainer.innerHTML = "";
  listContainer.innerHTML = "";

  if (Arr == 0) {
    itemContainer.innerHTML = `
        <h3 style='text-align: center;'>No products found in Cart</h3>
        `;
    totalPrice.innerHTML = "$0.00";
  }

  Arr.forEach((ele, index) => {
    itemContainer.innerHTML += `
        <div class="item">
        <img src="${ele.image}" alt="Item" />
        <div class="info">
          <div style="margin-bottom: 10px; font-weight:600">${ele.title}</div>
          <div style="font-weight:bold" class="row">
            <div class="price">$${ele.price}</div>
          </div>
          
        </div>
        <button id="addBtn" onClick='removeFromCart(${ele.id})'>Remove From Cart</button>
      </div>
        `;

    listContainer.innerHTML += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; gap:20px">
         <div><strong>${index + 1}.<strong>  ${ele.title}</div>
         <div>$${ele.price}</div>
        </div>
        `;
  });

  totalPrice.innerHTML = "$" + totalPriceFunc().toFixed(2);
}

// Function to remove an item from the cart
function removeFromCart(id) {
  // Retrieve the current user data from localStorage
  let currentUser = JSON.parse(localStorage.getItem("curntUser"));
  // Find the index of the item in the currentUser's myCart array
  const itemIndex = currentUser.myCart.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    // Remove the item from the currentUser's myCart array
    currentUser.myCart.splice(itemIndex, 1);
    // Update the currentUser data in localStorage
    localStorage.setItem("curntUser", JSON.stringify(currentUser));

    // Retrieve the user list from localStorage
    let currentUserList = JSON.parse(localStorage.getItem("Usr"));
    // Find the corresponding user in the user list array
    const currentUserInList = currentUserList.find(
      (user) => user.email === currentUser.email
    );
    if (currentUserInList) {
      // Find the index of the item in the corresponding user's myCart array
      const userItemIndex = currentUserInList.myCart.findIndex(
        (item) => item.id === id
      );
      if (userItemIndex !== -1) {
        // Remove the item from the corresponding user's myCart array
        currentUserInList.myCart.splice(userItemIndex, 1);
        // Update the user list data in localStorage
        localStorage.setItem("Usr", JSON.stringify(currentUserList));
      }
    }
  }
  showCartItem(currentUser.myCart);
}

if (cartItem.length == 0) {
  itemContainer.innerHTML = `
    <h3 style='text-align: center;;'>No products found in the Cart</h3>
    `;
}

function totalPriceFunc() {
  return cartItem.reduce((acc, item) => {
    return acc + item.price;
  }, 0);
}

// Link for the documentation:
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration

// Add button code documentation:
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration#code-to-add-pay-button

document.getElementById("rzp-button1").onclick = function (e) {
  // Assuming the payment is successful and you have a reference to the current user
  let currentUser = JSON.parse(localStorage.getItem("curntUser"));
  var options = {
    // Enter the Key ID generated from the Dashboard
    key: "rzp_test_zrT1Hy0dNJFJNq",
    // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    amount: totalPriceFunc() * 100,
    currency: "INR",
    name: "MyShop Checkout",
    //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    description: "This is your order",
    theme: {
      color: "#000",
    },
    image:
      "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
  };

  var rzpy1 = new Razorpay(options);
  rzpy1.open();
  // clear mycart in CuuentUser and User - localStorage
  // Clear the myCart array for the current user
  currentUser.myCart = [];
  // Store the updated user data back to localStorage
  localStorage.setItem("curntUser", JSON.stringify(currentUser));

  // same process for userlist
  let currentUserList = JSON.parse(localStorage.getItem("Usr"));
  const currentUserIndex = currentUserList.findIndex(
    (user) => user.email === currentUser.email
  );
  if (currentUserIndex !== -1) {
    currentUserList[currentUserIndex].myCart = [];
    localStorage.setItem("Usr", JSON.stringify(currentUserList));
  }
  // Reset the cart total price to zero
  totalPrice.innerHTML = "$0.00";

  showCartItem(currentUser.myCart);
};
