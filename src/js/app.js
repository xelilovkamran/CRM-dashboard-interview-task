const dataUrl = "/src/data/data.json";
const rowsPerPage = 5;
let currentPage = 1;
let tableData = [];
let tableDataCopy = [];

async function fetchData() {
  const response = await fetch(dataUrl);
  const jsonData = await response.json();
  tableData = jsonData.table;
  tableDataCopy = [...tableData];
  renderTable(tableData);
  renderPagination(tableData);
}

function renderTable(tableData) {
  const tableBody = document.querySelector(".content__table tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = tableData.slice(startIndex, endIndex);

  pageData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.company}</td>
      <td>${row.phone}</td>
      <td>${row.email}</td>
      <td>${row.country}</td>
      <td><span class="status status--${row.status.toLowerCase()}">${
      row.status
    }</span></td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderPagination(tableData) {
  const pagination = document.getElementById("pagination");
  const paginationText = document.getElementById("pagination__info");
  pagination.innerHTML = "";

  if (tableData.length === 0) {
    paginationText.textContent = "No data found";
    return;
  }

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const prevButton = document.createElement("button");
  prevButton.setAttribute("aria-label", "Previous page");
  prevButton.className = "pagination__btn pagination__btn--prev";
  prevButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable(tableDataCopy);
      renderPagination(tableDataCopy);
    }
  };

  const nextButton = document.createElement("button");
  nextButton.setAttribute("aria-label", "Next page");
  nextButton.className = "pagination__btn pagination__btn--next";
  nextButton.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable(tableDataCopy);
      renderPagination(tableDataCopy);
    }
  };

  pagination.appendChild(prevButton);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className =
      i === currentPage
        ? "pagination__btn pagination__btn--active"
        : "pagination__btn";
    button.onclick = () => {
      currentPage = i;
      renderTable(tableDataCopy);
      renderPagination(tableDataCopy);
    };
    pagination.appendChild(button);
  }

  pagination.appendChild(nextButton);

  // Update pagination text
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, tableData.length);
  paginationText.textContent = `Showing data ${start} to ${end} of ${tableData.length} entries`;
}

function setupSearch() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    tableDataCopy = tableData.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm) ||
        row.email.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable(tableDataCopy);
    renderPagination(tableDataCopy);
  });
}

async function init() {
  await fetchData();
  setupSearch();
}

init();
