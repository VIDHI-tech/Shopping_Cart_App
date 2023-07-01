if (!localStorage.getItem("curntUser")) {
  window.location.href = "../login/login.html";
}

let grid = document.querySelector(".products");
let search = document.getElementById("search");
let filterInput = document.getElementById("fltr");
var productsArr = [];
var counter = 0;
var myArr = [];

if (localStorage.getItem("curntUser")) {
  var cart = JSON.parse(localStorage.getItem("curntUser"));
  var cartArr = cart.myCart;
} else {
  var cartArr = [];
}

fltr.addEventListener("keyup", () => {
  grid.innerHTML = "";
  myArr = productsArr.filter((ele) => {
    if (ele.title.toLowerCase().includes(fltr.value.trim().toLowerCase())) {
      return ele;
    }
  });
  if (myArr.length == 0) {
    // console.log("search")
    grid.innerHTML = `
      Oops,No products found for this filtering, try different combinations!
      `;
    // console.log(grid.innerHTML)
    return;
  }
  for (let value of myArr) {
    addElement(grid, value);
  }
});

// get value from the api create dynamic element
function addElement(appendIn, value) {
  let myDiv = document.createElement("div");
  myDiv.className = "container";
  // object destructuring...
  let { id, title, price, description, category, image, rating } = value;

  myDiv.innerHTML = ` <ul class="p">
           <li class="crop" >
          <img src="${image}"alt="Avatar">
          </li>
          </ul>
          
          <div class="card-co">
          <h1 ><b>${title}</b></h1>
           <p>Price: <span><b>$${price}</b></span></p>
           <p>Rating: <span><b>${rating.rate}</b></span></p>
          </div>
        <div class="footer">
        <button id="add-to-cart" onClick='addToCart(${value.id})' >Add to cart</button>
        </div>
        `;
  appendIn.appendChild(myDiv);
}

category("all");

var btnContainer = document.getElementsByClassName("filters");
var btns = document.getElementsByClassName("filter");
console.log("hi", btnContainer, btns);
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function category(passedData) {
  var filteredData;

  if (passedData == "all") {
    grid.innerHTML = "";
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        productsArr = json;
        // iterating products
        // adding data in grid.innerHTML=""(product box);
        for (let value of json) {
          addElement(grid, value);
        }
      });
  } else {
    grid.innerHTML = "";
    filteredData = productsArr.filter(function (data) {
      return data.category == passedData;
    });
    // console.log(filteredData)
    for (let value of filteredData) {
      addElement(grid, value);
    }
  }
}

function ratingFilter(x) {
  var ratingData = productsArr.filter(function (data) {
    console.log(data.rating, x);
    return data.rating.rate <= x;
    // console.log(data.rating, x)
  });
  console.log(ratingData);
  grid.innerHTML = "";
  if (ratingData.length == 0) {
    grid.innerHTML = "No Data Found";
  } else {
    for (let value of ratingData) {
      addElement(grid, value);
    }
  }
}

document.querySelectorAll('input[type="checkbox"]').forEach((c) => {
  c.addEventListener("change", filterProducts);
});

function filterProducts() {
  grid.innerHTML = "";
  const checkboxes = Array.from(
    document.querySelectorAll('input[name="prange"]')
  );
  const checkedRanges = checkboxes.filter((c) => c.checked).map((c) => c.value);
  console.log("check", checkedRanges);
  if (checkedRanges.length === 0) {
    for (let value of productsArr) {
      addElement(grid, value);
    }
    return;
  }

  const filteredProducts = productsArr.filter((p) => {
    const price = p.price;

    for (const range of checkedRanges) {
      if (range === "100+" && price >= 100) {
        return true;
      }

      const [min, max] = range.split("-").map(parseFloat);
      if (price >= min && price <= max) {
        return true;
      }
    }
    return false;
  });
  // console.log(filteredProducts)

  let myArr = productsArr.filter((p) => {
    if (filteredProducts.includes(p)) {
      return p;
    }
  });
  // console.log(myArr)
  grid.innerHTML = "";
  for (let value of myArr) {
    addElement(grid, value);
  }
}

function addToCart(id) {
  let item;
  productsArr.forEach((ele) => {
    if (ele.id == id) {
      item = ele;
    }
  });
  // cartArr.push(item);
  // console.log("Item is" ,cartArr);
  // Retrieve the user's data from the localStorage
  let currentUser = JSON.parse(localStorage.getItem("curntUser"));
  // console.log(currentUser)
  // Add the selected item to the myCart array
  currentUser.myCart.push(item);
  // Store the updated CurrntUser data back to localStorage
  localStorage.setItem("curntUser", JSON.stringify(currentUser));

  // Also store the updated user data back to localStorage
  let currentUserList = JSON.parse(localStorage.getItem("Usr"));
  const currentUserIndex = currentUserList.findIndex(
    (user) => user.email === currentUser.email
  );
  if (currentUserIndex !== -1) {
    currentUserList[currentUserIndex].myCart.push(item);
    localStorage.setItem("Usr", JSON.stringify(currentUserList));
  }

  alert("Item added..");
}
