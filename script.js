// elements
const form = document.getElementById("expenseForm");
const inputAmount = document.getElementById("amount");
const inputNote = document.getElementById("note");
const selectCategory = document.getElementById("category");
const inputDate = document.getElementById("date");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("total");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("search");

// data array
let expenses = [];
let chart = null;
let isEditMode = false;
let editId = null;
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

  if (isEditMode) {
    //   Update existing
    const updatedExpenses = expenses.map((item) =>
      item.id === editId ? { ...item, amount, note, category, date } : item
    );

    expenses.length = 0;
    expenses.push(...updatedExpenses);
    isEditMode = false;
    editId = null;
    submitBtn.textContent = "Add Expense";
  } else {
    //  Add new
    const expense = {
      id: Date.now(),
      amount,
      note,
      category,
      date,
    };
    expenses.push(expense);
  }

  // create expense object
  // const expense = {
  //   id: Date.now(),
  //   amount,
  //   note,
  //   category,
  //   date,
  // };

  // add to array
  // expenses.push(expense);

  // localStorage data save
  localStorage.setItem("expenses", JSON.stringify(expenses));
  // show in ui
  renderExpenses();

  // form clear
  form.reset();
});

// Render expenses in the list
// function renderExpenses() {

//   expenseList.innerHTML = "";

//   expenses.forEach((item) => {
//     const li = document.createElement("li");
//     li.className = "border p-2 rounded flex justify-between items-center";

//     li.innerHTML = `
//      <div>
//     <p class="font-semibold">${item.note}</p>
//     <p class="text-sm text-gray-600">${item.category} | ${item.date}</p>
//   </div>
//   <div class="flex items-center gap-2">
//     <span class="text-red-600 font-bold">
//       <i class="fas fa-coins text-yellow-500 mr-1"></i>${item.amount}
//     </span>
//      <button onclick="editExpense(${item.id})" class="text-red-500 hover:text-red-700">
//       <i class="fas fa-edit"></i>
//     </button>
//     <button onclick="deleteExpense(${item.id})" class="text-red-500 hover:text-red-700">
//       <i class="fas fa-trash"></i>
//     </button>

//   </div>
//     `;

//     expenseList.appendChild(li);
//   });

//   // Update total
//   const total = expenses.reduce((sum, item) => sum + item.amount, 0);
//   totalExpense.innerHTML = `<i class="fas fa-coins text-yellow-500 mr-1"></i>${total}`;
// }

// Render expenses in the list with search includes
function renderExpenses(data = expenses) {
  // Clear previous
  expenseList.innerHTML = "";

  // Render each expense
  data.forEach((item) => {
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
     <button onclick="editExpense(${item.id})" class="text-red-500 hover:text-red-700">
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
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  totalExpense.innerHTML = `<i class="fas fa-coins text-yellow-500 mr-1"></i>${total}`;

  renderChart();
}

// edit expense
function editExpense(id) {
  if (confirm("Are you sure you want to edit this expense?")) {
    const expenseToEdit = expenses.find((item) => item.id === id);
    if (!expenseToEdit) {
      return;
    }

    // field from existing data
    inputAmount.value = expenseToEdit.amount;
    inputNote.value = expenseToEdit.note;
    selectCategory.value = expenseToEdit.category;
    inputDate.value = expenseToEdit.date;

    // Set edit mode
    isEditMode = true;
    editId = id;
    submitBtn.textContent = "Update Expense";
    // Remove old expense
    // const updatedExpenses = expenses.filter((item) => item.id !== id);
    // expenses.length = 0;
    // expenses.push(...updatedExpenses);
    // localStorage.setItem("expenses", JSON.stringify(expenses));
    // renderExpenses();
  }
}

// delete expense
function deleteExpense(id) {
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
}

// search input field
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  const filtered = expenses.filter((item) => {
    return (
      item.note.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });
  renderExpenses(filtered);
});
// search input field

// pie chart

function renderChart() {
  const categoryTotals = {};

  expenses.forEach((item) => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category] += item.amount;
    } else {
      categoryTotals[item.category] = item.amount;
    }
  });

  const ctx = document.getElementById("expenseChart").getContext("2d");

  if (chart !== null) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#F87171", // red
            "#60A5FA", // blue
            "#34D399", // green
            "#FBBF24", // yellow
            "#A78BFA", // purple
          ],
        },
      ],
    },
  });
}

// pie chart

// csv file
document.getElementById("exportCSV").addEventListener("click", () => {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (expenses.length === 0) {
    alert(" No expense data to export.");
    return;
  }

  const csvRows = [];
  const headers = Object.keys(expenses[0]);
  csvRows.push(headers.join(","));

  expenses.forEach((expense) => {
    const values = headers.map((header) => `"${expense[header]}"`);
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();

  URL.revokeObjectURL(url);
});

// pdf file
document.getElementById("exportPDF").addEventListener("click", async () => {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (expenses.length === 0) {
    alert(" No data to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Expense Report", 20, 20);
  doc.setFontSize(12);

  const headers = ["Name", "Amount", "Category", "Date"];
  const startY = 30;
  let y = startY;

  doc.text(headers.join(" | "), 20, y);
  y += 8;

  expenses.forEach((item, index) => {
    const row = [item.name, item.amount + " Tk", item.category, item.date];
    doc.text(row.join(" | "), 20, y);
    y += 8;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("expenses.pdf");
});
