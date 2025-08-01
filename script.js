// elements
const form = document.getElementById("expenseForm");
const inputAmount = document.getElementById("amount");
const inputNote = document.getElementById("note");
const selectCategory = document.getElementById("category");
const inputDate = document.getElementById("date");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("total");

// data array
let expenses = [];

// load from localStorage on page load
const savedExpenses = JSON.parse(localStorage.getItem("expenses"));
if (savedExpenses) {
  expenses = savedExpenses;
  renderExpenses();
}
// form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  //   get inpute values
  const amount = parseFloat(inputAmount.value);
  const note = inputNote.value.trim();
  const category = selectCategory.value;
  const date = inputDate.value;

  //validation
  if (isNaN(amount) || amount < 0 || note === "" || date === "") {
    alert("Please all fields correctly !!!");
    return;
  }

  // create expense object
  const expense = {
    id: Date.now(),
    amount,
    note,
    category,
    date,
  };

  // add to array
  expenses.push(expense);

  // localStorage data save
  localStorage.setItem("expenses", JSON.stringify(expenses));
  // show in ui
  renderExpenses();

  // form clear
  form.reset();
});

// Render expenses in the list
function renderExpenses() {
  // Clear previous
  expenseList.innerHTML = "";

  // Render each expense
  expenses.forEach((item) => {
    const li = document.createElement("li");
    li.className = "border p-2 rounded flex justify-between items-center";

    li.innerHTML = `
     <div>
    <p class="font-semibold">${item.note}</p>
    <p class="text-sm text-gray-600">${item.category} | ${item.date}</p>
  </div>
  <div class="flex items-center gap-2">
    <span class="text-red-600 font-bold">
      <i class="fas fa-coins text-yellow-500 mr-1"></i>${item.amount}
    </span>
     <button onclick="deleteExpense(${item.id})" class="text-red-500 hover:text-red-700">
      <i class="fas fa-edit"></i>
    </button>
    <button onclick="deleteExpense(${item.id})" class="text-red-500 hover:text-red-700">
      <i class="fas fa-trash"></i>
    </button>
   
  </div>
    `;

    expenseList.appendChild(li);
  });

  // Update total
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  totalExpense.innerHTML = `<i class="fas fa-coins text-yellow-500 mr-1"></i>${total}`;
}

// delete expense
const deleteExpense = (id) => {
  if (confirm("Are you sure you want to delete this expense?")) {
    const updateExpenses = expenses.filter((item) => item.id !== id);

    // new array data
    expenses.length = 0;
    expenses.push(...updateExpenses);

    // localStorage update
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // ui refresh
    renderExpenses();
  }
};
