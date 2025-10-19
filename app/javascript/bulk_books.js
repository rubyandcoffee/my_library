document.addEventListener('turbo:load', () => {
  const table = document.getElementById('bulk-books-table');
  if (!table) return;

  const tbody = document.getElementById('bulk-books-tbody');
  const addRowButton = document.getElementById('add-row');
  let rowCounter = tbody.querySelectorAll('.book-row').length;

  // Genre selection modal elements
  const bulkGenreModal = document.getElementById('bulk-genre-modal');
  const bulkGenreSearch = document.getElementById('bulk-genre-search');
  const bulkGenreGrid = document.getElementById('bulk-genre-grid');
  const bulkModalSelected = document.getElementById('bulk-modal-selected');
  const bulkModalPlaceholder = document.getElementById('bulk-modal-placeholder');
  const confirmBulkGenres = document.getElementById('confirm-bulk-genres');
  const cancelBulkGenreModal = document.getElementById('cancel-bulk-genre-modal');
  let currentEditingRow = null;

  // Setup genre selector for each row
  function setupGenreSelector(row) {
    const genreSelector = row.querySelector('.bulk-genre-selector');
    const selectedGenresContainer = row.querySelector('.bulk-selected-genres');

    if (!genreSelector || !selectedGenresContainer) return;

    selectedGenresContainer.addEventListener('click', () => {
      openGenreModal(row);
    });
  }

  // Open genre selection modal
  function openGenreModal(row) {
    currentEditingRow = row;
    const rowIndex = row.dataset.rowIndex;
    const genreInputsContainer = row.querySelector('.bulk-genre-inputs');
    const existingGenreIds = Array.from(genreInputsContainer.querySelectorAll('input')).map(input => input.value);

    // Reset modal state
    bulkModalSelected.innerHTML = '';
    bulkGenreSearch.value = '';

    // Uncheck all checkboxes first
    bulkGenreGrid.querySelectorAll('.bulk-genre-checkbox').forEach(checkbox => {
      checkbox.checked = false;
    });

    // Check boxes for already selected genres and add tags
    existingGenreIds.forEach(genreId => {
      if (genreId) {
        const checkbox = bulkGenreGrid.querySelector(`.bulk-genre-checkbox[value="${genreId}"]`);
        if (checkbox) {
          checkbox.checked = true;
          const label = checkbox.closest('.bulk-genre-option');
          const genreName = label.dataset.genreName;
          addGenreTagToModal(genreId, genreName);
        }
      }
    });

    // Show placeholder if no genres selected
    if (bulkModalSelected.children.length === 0) {
      bulkModalPlaceholder.classList.remove('hidden');
    }

    // Show modal
    bulkGenreModal.classList.remove('hidden');
    bulkGenreModal.style.display = 'flex';
    filterModalGenres('');
  }

  // Add genre tag to modal display
  function addGenreTagToModal(genreId, genreName) {
    bulkModalPlaceholder?.classList.add('hidden');

    const tag = document.createElement('span');
    tag.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium';
    tag.dataset.genreId = genreId;
    tag.innerHTML = `
      ${genreName}
      <button type="button" class="remove-modal-genre text-purple-600 hover:text-purple-800 font-bold" data-genre-id="${genreId}">&times;</button>
    `;

    bulkModalSelected.appendChild(tag);

    // Add remove functionality
    const removeBtn = tag.querySelector('.remove-modal-genre');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeGenreFromModal(genreId);
    });
  }

  // Remove genre tag from modal
  function removeGenreFromModal(genreId) {
    const tag = bulkModalSelected.querySelector(`[data-genre-id="${genreId}"]`);
    if (tag) tag.remove();

    const checkbox = bulkGenreGrid.querySelector(`.bulk-genre-checkbox[value="${genreId}"]`);
    if (checkbox) checkbox.checked = false;

    if (bulkModalSelected.children.length === 0) {
      bulkModalPlaceholder?.classList.remove('hidden');
    }
  }

  // Filter genres in modal based on search
  function filterModalGenres(searchTerm) {
    const options = bulkGenreGrid.querySelectorAll('.bulk-genre-option');
    options.forEach(option => {
      const genreName = option.dataset.genreName.toLowerCase();
      if (genreName.includes(searchTerm.toLowerCase())) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });
  }

  // Handle checkbox changes in modal
  if (bulkGenreGrid) {
    bulkGenreGrid.addEventListener('change', (e) => {
      if (e.target.classList.contains('bulk-genre-checkbox')) {
        const checkbox = e.target;
        const label = checkbox.closest('.bulk-genre-option');
        const genreId = checkbox.value;
        const genreName = label.dataset.genreName;

        if (checkbox.checked) {
          addGenreTagToModal(genreId, genreName);
        } else {
          const tag = bulkModalSelected.querySelector(`[data-genre-id="${genreId}"]`);
          if (tag) tag.remove();
          if (bulkModalSelected.children.length === 0) {
            bulkModalPlaceholder?.classList.remove('hidden');
          }
        }
      }
    });
  }

  // Handle search in modal
  if (bulkGenreSearch) {
    bulkGenreSearch.addEventListener('input', (e) => {
      filterModalGenres(e.target.value);
    });
  }

  // Confirm genre selection
  if (confirmBulkGenres) {
    confirmBulkGenres.addEventListener('click', () => {
      if (!currentEditingRow) return;

      const rowIndex = currentEditingRow.dataset.rowIndex;
      const selectedGenresContainer = currentEditingRow.querySelector('.bulk-selected-genres');
      const genreInputsContainer = currentEditingRow.querySelector('.bulk-genre-inputs');
      const checkedCheckboxes = bulkGenreGrid.querySelectorAll('.bulk-genre-checkbox:checked');

      // Clear existing tags and inputs
      selectedGenresContainer.innerHTML = '';
      genreInputsContainer.innerHTML = '';

      // Add selected genres
      if (checkedCheckboxes.length === 0) {
        const placeholder = document.createElement('span');
        placeholder.className = 'text-xs text-neutral-400 italic no-genres-text';
        placeholder.textContent = 'Click to add';
        selectedGenresContainer.appendChild(placeholder);
      } else {
        checkedCheckboxes.forEach(checkbox => {
          const label = checkbox.closest('.bulk-genre-option');
          const genreId = checkbox.value;
          const genreName = label.dataset.genreName;

          // Add visual tag
          const tag = document.createElement('span');
          tag.className = 'inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs';
          tag.textContent = genreName;
          selectedGenresContainer.appendChild(tag);

          // Add hidden input
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `books[${rowIndex}][genre_ids][]`;
          input.value = genreId;
          genreInputsContainer.appendChild(input);
        });
      }

      // Close modal
      bulkGenreModal.classList.add('hidden');
      bulkGenreModal.style.display = 'none';
      currentEditingRow = null;
    });
  }

  // Cancel genre selection
  if (cancelBulkGenreModal) {
    cancelBulkGenreModal.addEventListener('click', () => {
      bulkGenreModal.classList.add('hidden');
      bulkGenreModal.style.display = 'none';
      currentEditingRow = null;
    });
  }

  // Close modal on outside click
  if (bulkGenreModal) {
    bulkGenreModal.addEventListener('click', (e) => {
      if (e.target === bulkGenreModal) {
        bulkGenreModal.classList.add('hidden');
        bulkGenreModal.style.display = 'none';
        currentEditingRow = null;
      }
    });
  }

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

  // Setup series filtering and genre selectors for existing rows
  tbody.querySelectorAll('.book-row').forEach(row => {
    setupSeriesFiltering(row);
    setupGenreSelector(row);
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

      // Clear genre selections in new row
      const genreContainer = newRow.querySelector('.bulk-selected-genres');
      const genreInputs = newRow.querySelector('.bulk-genre-inputs');
      if (genreContainer) {
        genreContainer.innerHTML = '<span class="text-xs text-neutral-400 italic no-genres-text">Click to add</span>';
      }
      if (genreInputs) {
        genreInputs.innerHTML = '';
      }

      // Update data attributes
      const genreSelector = newRow.querySelector('.bulk-genre-selector');
      if (genreSelector) {
        genreSelector.dataset.rowIndex = rowCounter;
      }
      if (genreContainer) {
        genreContainer.dataset.row = rowCounter;
      }
      if (genreInputs) {
        genreInputs.dataset.row = rowCounter;
      }

      tbody.appendChild(newRow);
      setupSeriesFiltering(newRow);
      setupGenreSelector(newRow);
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
