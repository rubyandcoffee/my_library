document.addEventListener('turbo:load', () => {
  const table = document.getElementById('bulk-books-table');
  if (!table) return;

  const tbody = document.getElementById('bulk-books-tbody');
  const addRowButton = document.getElementById('add-row');
  let rowCounter = tbody.querySelectorAll('.book-row').length;

  // Function to filter series based on author selection
  function setupSeriesFiltering(row) {
    const authorSelect = row.querySelector('.author-select');
    const seriesSelect = row.querySelector('.series-select');

    if (!authorSelect || !seriesSelect) return;

    const allSeriesOptions = Array.from(seriesSelect.options);

    authorSelect.addEventListener('change', () => {
      const selectedAuthorId = authorSelect.value;

      // Clear current options except the first "None" option
      seriesSelect.innerHTML = '';

      // Always add the "None" option first
      const noneOption = document.createElement('option');
      noneOption.value = '';
      noneOption.textContent = 'None';
      seriesSelect.appendChild(noneOption);

      // Filter and add series options
      allSeriesOptions.forEach(option => {
        if (option.value === '') return; // Skip the original "None" option

        const authorId = option.dataset.authorId;
        if (!selectedAuthorId || authorId === selectedAuthorId) {
          seriesSelect.appendChild(option.cloneNode(true));
        }
      });
    });
  }

  // Setup series filtering for existing rows
  tbody.querySelectorAll('.book-row').forEach(row => {
    setupSeriesFiltering(row);
  });

  // Add row button
  if (addRowButton) {
    addRowButton.addEventListener('click', () => {
      const newRow = tbody.querySelector('.book-row').cloneNode(true);
      newRow.dataset.rowIndex = rowCounter;

      // Update row number
      newRow.querySelector('td:first-child').textContent = rowCounter + 1;

      // Update all input names and clear values
      newRow.querySelectorAll('input, select').forEach(field => {
        const name = field.getAttribute('name');
        if (name) {
          field.setAttribute('name', name.replace(/\[\d+\]/, `[${rowCounter}]`));
        }

        // Clear values
        if (field.tagName === 'SELECT') {
          field.selectedIndex = 0;
        } else {
          field.value = '';
        }
      });

      tbody.appendChild(newRow);
      setupSeriesFiltering(newRow);
      setupRemoveButton(newRow);
      rowCounter++;
    });
  }

  // Remove row functionality
  function setupRemoveButton(row) {
    const removeButton = row.querySelector('.remove-row');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        // Don't remove if it's the last row
        if (tbody.querySelectorAll('.book-row').length > 1) {
          row.remove();
          updateRowNumbers();
        }
      });
    }
  }

  // Setup remove buttons for existing rows
  tbody.querySelectorAll('.book-row').forEach(row => {
    setupRemoveButton(row);
  });

  // Update row numbers after removal
  function updateRowNumbers() {
    tbody.querySelectorAll('.book-row').forEach((row, index) => {
      row.querySelector('td:first-child').textContent = index + 1;
    });
  }
});
