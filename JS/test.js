const linkData = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const linkCategoryData =
  "https://www.themealdb.com/api/json/v1/1/categories.php";
const mealsContainer = document.querySelector(".newMeals");
const loadingLayer = document.querySelector(".loadingLayer");
let selectedCategoryData = [];
let selectedMealData = null;

if (mealsContainer.innerHTML === "") {
  console.log("load");
  showLoadingScreen();
} else {
  removeLoadingScreen();
  console.log("finish");
}

export async function getMealsData() {
  try {
    showLoadingScreen();
    const res = await fetch(linkData);
    if (!res.ok) {
      throw new Error("Data not found");
    } else {
      const myData = await res.json();
      const myDataArr = myData.meals;
      console.log(myDataArr[0].strMeal);
      showMealsData(myDataArr);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = "Data not found";
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getMealsData();

window.getMeal = async (id) => {
  try {
    showLoadingScreen();
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (!res.ok) throw new Error("Failed to fetch the meal :(");
    const data = await res.json();
    displayChosenMeal(data.meals[0]);
  } catch (err) {
    console.log(err);
  } finally {
    removeLoadingScreen();
  }
};
function showLoadingScreen() {
  loadingLayer.classList.remove("d-none");
}

function removeLoadingScreen() {
  loadingLayer.classList.add("d-none");
}

function showMealsData(myDataArr) {
  let allMeals = "";
  myDataArr.forEach((el) => {
    allMeals += `
      <div class="col foodCard rounded-3">
        <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
        <div class="bgMeal rounded-3">
          <h3>${el.strMeal}</h3>
        </div>
      </div>
    `;
  });
  mealsContainer.innerHTML = allMeals;
}

async function getMealDetails() {
  try {
    showLoadingScreen();
    const res = await fetch(linkData);
    if (!res.ok) {
      throw new Error("Data not found");
    } else {
      const resData = await res.json();
      const resDataMeals = resData.meals;
      getClickedMealByUser(resDataMeals);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getMealDetails();

function getClickedMealByUser(resDataMeals) {
  mealsContainer.addEventListener("click", (e) => {
    const userchosenMeal = e.target.innerText;
    getChosenMeal(userchosenMeal, resDataMeals);
    console.log("hellooooo");
    $(".foodCard").fadeOut(500, () => {
      $("#mealDetails").removeClass("d-none");
      $("#mainPage").addClass("d-none");
      $("#mealDetails").fadeIn(500);
      backBtn();
    });
  });
}

function getChosenMeal(userchosenMeal, resDataMeals) {
  resDataMeals.forEach((el) => {
    if (el.strMeal == userchosenMeal) {
      selectedMealData = el;
      displayChosenMeal(selectedMealData);
      console.log("hii");
    }
  });
}

function displayChosenMeal(mealData) {
  // console.log(mealData);
  $("#mealDetails").removeClass("d-none");
  $("#areas").addClass("d-none");
  $("#inredients").addClass("d-none");
  $("#search").addClass("d-none");
  const chosenMeal = document.querySelector(".mealDisc");
  let mealDataHtml = `
    <div class="row my-5 mealDisc">
      <div class="col-md-4 mealSoloPhoto">
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" class="rounded-3" />
        <h2>${mealData.strMeal}</h2>
      </div>
      <div class="col-md-8 mealSoloInfo">
        <h3>Instructions</h3>
        <p>${mealData.strInstructions}</p>
        <span class='pe-3'>Area : </span><span>${mealData.strArea}</span> <br />
        <span class='pe-3'>Category : </span><span>${mealData.strCategory}</span> <br />
        <span class='recipes'>Recipes : </span>
        <br />
        <div class="recipe-list"></div>
        <span>Tags :</span> <br />
        <div class="tag-list"></div> <br />
        <button type="button" class="btn btn-success">
          <a href="${mealData.strSource}" target="_blank">Source</a>
        </button>
        <button type="button" class="btn btn-danger">
          <a href="${mealData.strYoutube}" target="_blank">Youtube</a>
        </button>
      </div>
    </div>
  `;

  chosenMeal.innerHTML = mealDataHtml;
  const recipeList = document.querySelector(".recipe-list");
  const tagList = document.querySelector(".tag-list");

  const mealRecipes = [];
  for (let i = 1; i <= 20; i++) {
    let ingredientMeal = `strIngredient${i}`;
    let measureMeal = `strMeasure${i}`;
    let ingredient = mealData[ingredientMeal];
    let measure = mealData[measureMeal];
    if (ingredient && measure) {
      mealRecipes.push(`${measure} ${ingredient}`);
    }
  }

  mealRecipes.forEach((recipe) => {
    // console.log(recipe);
    const recipeElement = document.createElement("span");
    recipeElement.className = "badge text-bg-info p-2 me-3 mb-3 fs-6";
    recipeElement.innerText = recipe;
    recipeList.appendChild(recipeElement);
  });

  const mealTags = mealData.strTags ? mealData.strTags.split(",") : [];
  mealTags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "badge text-bg-warning p-2 me-3 mb-3 fs-6";
    tagElement.innerText = tag;
    tagList.appendChild(tagElement);
  });
}

function backBtn() {
  $(".backBtn").on("click", () => {
    $("#mealDetails").addClass("d-none");
    $(".foodCard").fadeIn(200);
    $("#mainPage").removeClass("d-none");
  });
}
function backBtnCat() {
  $(".backBtn").on("click", () => {
    $("#mealDetails").addClass("d-none");
    $(".foodCard").fadeIn(200);
    $("#mainPage").removeClass("d-none");
  });
}

// *********************************************************** aside section

const navBarMenu = document.querySelector("#navMenu");
const navBarLinks = document.querySelectorAll(".navLinks ul li");

$("#navMenu").on("click", function () {
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
  $("#navBar").toggleClass("navBarOpen", 5000);
  $("#Search").animate({ top: "0px" }, 500);
  $("#Categories").animate({ top: "40px" }, 600);
  $("#Area").animate({ top: "80px" }, 700);
  $("#Ingredients").animate({ top: "120px" }, 800);
  $("#ContactUs").animate({ top: "160px" }, 900);

  if (navBarMenu.firstElementChild.classList.contains("fa-xmark")) {
    console.log("x");
    $("#Search").animate({ top: "0px" }, 500);
    $("#Categories").animate({ top: "40px" }, 600);
    $("#Area").animate({ top: "80px" }, 700);
    $("#Ingredients").animate({ top: "120px" }, 800);
    $("#ContactUs").animate({ top: "160px" }, 900);
    $(".linksContain").animate({ top: "0" }, 0);
  } else if (navBarMenu.firstElementChild.classList.contains("fa-bars")) {
    console.log("y");
    $("#Search").animate({ top: "300px" }, 500);
    $("#Categories").animate({ top: "300px" }, 600);
    $("#Area").animate({ top: "300px" }, 700);
    $("#Ingredients").animate({ top: "300px" }, 800);
    $("#ContactUs").animate({ top: "300px" }, 900);
    $(".linksContain").animate({ top: "15rem" }, 500);
  }

  $("#navMenu").on("click", function () {
    $("#linksContain").animate({ top: "300px" }, 300);
  });
});

//************************************ category link
const categoryLink = document.querySelectorAll(".navLinks ul li a");

categoryLink[1].addEventListener("click", function () {
  $("#categories").removeClass("d-none");
  $("#mainPage").addClass("d-none");
  $("#areas").addClass("d-none");
  $("#inredients").addClass("d-none");
  $("#contactUs").addClass("d-none");
  $("#search").addClass("d-none");
  $("#mealDetails").addClass("d-none");
  $("#navBar").toggleClass("navBarOpen");
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
});

async function getCategoryDataLink() {
  showLoadingScreen();
  try {
    const resCategory = await fetch(linkCategoryData);
    if (!resCategory.ok) {
      throw new Error("Data not found");
    } else {
      const myCategoryData = await resCategory.json();
      const myCategoryDataArr = myCategoryData.categories;
      displayCategory(myCategoryDataArr);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getCategoryDataLink();

let boxCategory = "";

function displayCategory(catData) {
  catData.forEach((el) => {
    let pOnly20 = el.strCategoryDescription;
    boxCategory += `
      <div class="col mealCategory rounded-3 text-center">
        <img src="${el.strCategoryThumb}" alt="${
      el.strCategory
    }" class="rounded-3" />
        <div class="bgMeal rounded-3">
          <h3>${el.strCategory}</h3>
          <p class='p-2'>${pOnly20.slice(0, 100)}...Click for more</p>
        </div>
      </div>
    `;
    document.querySelector(".mealsCategory").innerHTML = boxCategory;
  });
}

async function getOneCategoryLink(userChoiceCat) {
  const linkOneCategoryData = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${userChoiceCat}`;
  try {
    showLoadingScreen();
    let resCat = await fetch(linkOneCategoryData);
    if (!resCat.ok) {
      throw new Error("Data not found");
    } else {
      let getCatDataReady = await resCat.json();
      selectedCategoryData = getCatDataReady.meals;
      console.log(selectedCategoryData);
      displayAllMealsFromCat(selectedCategoryData);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

function displayAllMealsFromCat(selectedCategoryData) {
  let boxAllMealsFromCat = "";
  selectedCategoryData.forEach((el) => {
    boxAllMealsFromCat += `
      <div class="col mealCategory rounded-3" onclick="getMeal('${el.idMeal}')">
        <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
        <div class="bgMeal rounded-3">
          <h3>${el.strMeal}</h3>
        </div>
      </div>
    `;
  });
  document.querySelector(".mealsCategory").innerHTML = boxAllMealsFromCat;
  categoryLink[1].addEventListener("click", function () {
    document.querySelector(".mealsCategory").innerHTML = boxCategory;
  });
  backBtn();
}

function handleCategoryMealClick(userChoiceMeal) {
  const selectedMeal = selectedCategoryData.find(
    (el) => el.strMeal === userChoiceMeal
  );

  if (selectedMeal) {
    selectedMealData = selectedMeal;

    selectedMealData.additionalData = "test";
    displayChosenMeal(selectedMealData);

    $("#categories").addClass("d-none");
    $("#mainPage").addClass("d-none");
    $("#mealDetails").removeClass("d-none");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const mealsCategoryDiv = document.querySelector(".mealsCategory");

  mealsCategoryDiv.addEventListener("click", function (e) {
    const mealCategoryDiv = e.target.closest(".mealCategory");
    if (mealCategoryDiv) {
      const h3Text = mealCategoryDiv.querySelector("h3").innerText;
      let userChoiceCat = h3Text;
      console.log(userChoiceCat);
      getOneCategoryLink(userChoiceCat);
    }
  });

  mealsCategoryDiv.addEventListener("click", function (e) {
    const mealDiv = e.target.closest(".mealCategory");

    if (mealDiv) {
      const mealName = mealDiv.querySelector("h3").innerText;
      handleCategoryMealClick(mealName);
    }
  });
});

async function getCategoryData() {
  showLoadingScreen();
  try {
    const resCategory = await fetch(linkCategoryData);
    if (!resCategory.ok) {
      throw new Error("Data not found");
    } else {
      const myCategoryData = await resCategory.json();
      const myCategoryDataArr = myCategoryData.categories;
      // displayCategory(myCategoryDataArr);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getCategoryData();

//********************************  area*/

const allAriaDiv = document.querySelector(".areas");
const areaLink = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";

categoryLink[2].addEventListener("click", function () {
  $("#areas").removeClass("d-none");
  $("#mainPage").addClass("d-none");
  $("#mealDetails").addClass("d-none");
  $("#search").addClass("d-none");
  $("#categories").addClass("d-none");
  $("#inredients").addClass("d-none");
  $("#contactUs").addClass("d-none");
  $("#navBar").toggleClass("navBarOpen");
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
});

async function getAreasLink() {
  try {
    showLoadingScreen();
    const resAreas = await fetch(areaLink);
    if (!resAreas.ok) {
      throw new Error(`Data not found`);
    } else {
      const data = await resAreas.json();
      console.log(data.meals);
      displayAreas(data.meals);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getAreasLink();

let containAreaData = "";
function displayAreas(data) {
  console.log(data);
  data.forEach((el) => {
    // console.log(el);

    containAreaData += `
      <div class=" area row row-cols-2 row-cols-md-4 g-md-4 text-center d-flex align-items-center justify-content-center" onclick="getMealsByArea('${el.strArea}')">
      <div class="col  rounded-3 text-white w-100">
        <i class="fa-solid fa-earth-americas fs-2"></i>
        <h3>${el.strArea}</h3>
      </div>
      </div>
`;
    allAriaDiv.innerHTML = containAreaData;
  });
}

window.getMealsByArea = async function (areaClicked) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaClicked}`
    );
    if (!res.ok) {
      throw new Error("Data Not Found");
    } else {
      const areaData = await res.json();
      // console.log(areaData);
      displayAllMealsByArea(areaData.meals);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  }
};

function displayAllMealsByArea(areaData, id) {
  let containMealsAreaData = "";
  areaData.forEach((el) => {
    containMealsAreaData += `
    <div class="col mealCategory rounded-3" onclick="getMeal(${el.idMeal})">
    <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
    <div class="bgMeal rounded-3">
      <h3>${el.strMeal}</h3>
    </div>
  </div>`;
    allAriaDiv.innerHTML = containMealsAreaData;
  });
  categoryLink[2].addEventListener("click", function () {
    console.log("mm");
    allAriaDiv.innerHTML = containAreaData;
  });
}

//***********************************************************/ inredients

const allingDiv = document.querySelector(".inredient");
const ingLink = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";

categoryLink[3].addEventListener("click", function () {
  $("#inredients").removeClass("d-none");
  $("#mainPage").addClass("d-none");
  $("#mealDetails").addClass("d-none");
  $("#categories").addClass("d-none");
  $("#areas").addClass("d-none");
  $("#search").addClass("d-none");
  $("#contactUs").addClass("d-none");
  $("#navBar").toggleClass("navBarOpen");
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
});

async function getIngsLink() {
  try {
    showLoadingScreen();
    const tesIng = await fetch(ingLink);
    if (!tesIng.ok) {
      throw new Error(`Data not found`);
    } else {
      const data = await tesIng.json();
      // console.log(data.meals);
      displayIngs(data.meals);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  } finally {
    removeLoadingScreen();
  }
}

getIngsLink();

let containIngData = "";
function displayIngs(data) {
  for (let i = 0; i <= 15; i++) {
    containIngData += `
      <div class="col ingCard rounded-3 text-white text-center">
      <i class="fa-solid fa-utensils fs-1"></i>
        <h4>${data[i].strIngredient}</h4>
        <p>${data[i].strDescription.slice(0, 100)}</p>
      </div>

  `;
    allingDiv.innerHTML = containIngData;

    // console.log(data[i]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const ingsAllDiv = document.querySelector(".inredient");

  ingsAllDiv.addEventListener("click", function (e) {
    const ingCardDiv = e.target.closest(".ingCard");

    if (ingCardDiv) {
      const h3Text = ingCardDiv.querySelector("h4").innerText;
      let userChoiceIng = h3Text;
      // console.log(userChoiceIng);
      getIngLink(userChoiceIng);
    }
  });
});

async function getIngLink(userChoiceIng) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${userChoiceIng}`
    );
    if (!res.ok) {
      throw new Error("Data Not Found");
    } else {
      const ingData = await res.json();
      console.log(ingData);
      displayAllMealsByIng(ingData.meals);
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  }
}

function displayAllMealsByIng(ingData) {
  // console.log(areaData);
  let containIngMealsData = "";
  ingData.forEach((el) => {
    containIngMealsData += `
    <div class="col mealCategory rounded-3" onclick="getMeal('${el.idMeal}')">
    <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
    <div class="bgMeal rounded-3">
      <h3>${el.strMeal}</h3>
    </div>
  </div>`;
    allingDiv.innerHTML = containIngMealsData;
  });
  categoryLink[3].addEventListener("click", function () {
    // console.log("mm");
    allingDiv.innerHTML = containIngData;
  });
}

//***********************************************************/ search

const searchNameInput = document.getElementById("Name");
const searchLetterInput = document.getElementById("Letter");
const searchRes = document.querySelector(".searchRes");

categoryLink[0].addEventListener("click", function () {
  $("#search").removeClass("d-none");
  $("#inredients").addClass("d-none");
  $("#mainPage").addClass("d-none");
  $("#mealDetails").addClass("d-none");
  $("#categories").addClass("d-none");
  $("#areas").addClass("d-none");
  $("#contactUs").addClass("d-none");
  $("#navBar").toggleClass("navBarOpen");
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
});

async function getTotalMealsForS(userSearch) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${userSearch}`
    );
    if (!res.ok) {
      throw new Error("Data Not Found");
    } else {
      const allMealsDataArr = await res.json();
      console.log(allMealsDataArr.meals);
      if (allMealsDataArr.meals === null) {
        searchRes.innerHTML = "";
      } else {
        displayMealsUnderSearch(allMealsDataArr.meals);
        // displayMealsUnderSearchFirstL(allMealsDataArr.meals)
      }
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  }
}
async function getTotalMealsForL(userSearch) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${userSearch}`
    );
    if (!res.ok) {
      throw new Error("Data Not Found");
    } else {
      const allMealsDataArr = await res.json();
      if (allMealsDataArr.meals === null) {
        searchRes.innerHTML = "";
      } else {
        console.log(allMealsDataArr.meals);
        displayMealsUnderSearchFirstL(allMealsDataArr.meals);
        // displayMealsUnderSearch(allMealsDataArr.meals);
        // displayMealsUnderSearchFirstL(allMealsDataArr.meals)
      }
    }
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.innerText = error;
    errorMsg.setAttribute("class", "errorData");
    mealsContainer.append(errorMsg);
  }
}

searchNameInput.addEventListener("input", function () {
  const searchTerm = capitalizeFirstLetter(searchNameInput.value);

  getTotalMealsForS(searchTerm);
  console.log(searchTerm);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayMealsUnderSearch(allMealsDataArr) {
  let resultSearch = "";
  allMealsDataArr.forEach((el) => {
    console.log(el);
    resultSearch += `
    <div class="col mealCategory rounded-3" onclick="getMeal('${el.idMeal}')">
    <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
    <div class="bgMeal rounded-3">
      <h3>${el.strMeal}</h3>
    </div>
  </div>`;
    console.log(searchRes);
    console.log(allMealsDataArr);
  });
  searchRes.innerHTML = resultSearch;
}
// ************************************************************first letter search

function displayMealsUnderSearchFirstL(allMealsDataArr) {
  let resultSearch = "";
  allMealsDataArr.forEach((el) => {
    console.log(el);
    resultSearch += `
    <div class="col mealCategory rounded-3" onclick="getMeal('${el.idMeal}')">
    <img src="${el.strMealThumb}" alt="${el.strMeal}" class="rounded-3" />
    <div class="bgMeal rounded-3">
      <h3>${el.strMeal}</h3>
    </div>
  </div>`;
    console.log(searchRes);
    console.log(allMealsDataArr);
  });
  searchRes.innerHTML = resultSearch;
}

searchLetterInput.addEventListener("input", function () {
  let inputValue = searchLetterInput.value;
  inputValue = inputValue.replace(/[^A-Za-z]/g, "");

  const searchLetter = inputValue.charAt(0);

  searchLetterInput.value = searchLetter;
  console.log(searchLetterInput.value.toUpperCase());
  getTotalMealsForL(searchLetterInput.value);
});

// *****************************************************

categoryLink[4].addEventListener("click", function () {
  $("#contactUs").removeClass("d-none");
  $("#inredients").addClass("d-none");
  $("#mainPage").addClass("d-none");
  $("#mealDetails").addClass("d-none");
  $("#categories").addClass("d-none");
  $("#areas").addClass("d-none");
  $("#navBar").toggleClass("navBarOpen");
  navBarMenu.firstElementChild.classList.toggle("fa-bars");
  navBarMenu.firstElementChild.classList.toggle("fa-xmark");
});

// *************************** contact us

const formInputs = {
  name: /^[A-Za-z\s]{3,}$/,
  email: /^.*@.*\.com$/,
  phone: /^(011|012|010)\d{8}$/,
  age: /^(?:[1-9][3-9]|[2-9]\d{1,})$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
  rePassword: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
};

const inputElements = document.querySelectorAll("#contactForm input");
const submitBtn = document.querySelector(".submitBtn");

inputElements.forEach((input) => {
  input.addEventListener("input", () => {
    const fieldName = input.id;
    const regex = formInputs[fieldName];
    const inputValue = input.value;
    let allInpMsg = document.querySelectorAll(".form-text");

    if (
      regex.test(inputValue) ||
      (fieldName === "rePassword" &&
        inputValue === document.getElementById("password").value)
    ) {
      input.classList.remove("is-invalid");
      // input.classList.remove("D");
      input.classList.add("is-valid");
      input.nextElementSibling.classList.add("d-none");
      input.nextElementSibling.removeClass("d-block");
    } else {
      input.classList.add("is-invalid");
      for (let i = 0; i < allInpMsg.length; i++) {
        allInpMsg[i].classList.add("d-block");
      }
    }

    validateForm();
  });
});

function validateForm() {
  const isValid = [...inputElements].every(
    (input) => !input.classList.contains("is-invalid")
  );
  submitBtn.removeAttribute("disabled");
}
