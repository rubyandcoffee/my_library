// Inline creation of authors and series from book form
document.addEventListener('turbo:load', () => {
  // Author Modal
  const authorModal = document.getElementById('new-author-modal');
  const authorForm = document.getElementById('new-author-form');
  const authorBtn = document.getElementById('add-new-author-btn');
  const cancelAuthorBtn = document.getElementById('cancel-author-modal');
  const authorStatus = document.getElementById('author-modal-status');

  // Series Modal
  const seriesModal = document.getElementById('new-series-modal');
  const seriesForm = document.getElementById('new-series-form');
  const seriesBtn = document.getElementById('add-new-series-btn');
  const cancelSeriesBtn = document.getElementById('cancel-series-modal');
  const seriesStatus = document.getElementById('series-modal-status');

  // Genre Modal
  const genreModal = document.getElementById('new-genre-modal');
  const genreForm = document.getElementById('new-genre-form');
  const genreBtn = document.getElementById('add-new-genre-btn');
  const cancelGenreBtn = document.getElementById('cancel-genre-modal');
  const genreStatus = document.getElementById('genre-modal-status');

  // Exit if modals don't exist on this page
  if (!authorModal && !seriesModal && !genreModal) return;

  // Open author modal
  if (authorBtn && authorModal) {
    authorBtn.addEventListener('click', () => {
      authorModal.classList.remove('hidden');
      document.getElementById('author_name').focus();
    });
  }

  // Close author modal
  if (cancelAuthorBtn && authorModal) {
    cancelAuthorBtn.addEventListener('click', () => {
      authorModal.classList.add('hidden');
      authorForm.reset();
      authorStatus.classList.add('hidden');
    });
  }

  // Close on background click
  if (authorModal) {
    authorModal.addEventListener('click', (e) => {
      if (e.target === authorModal) {
        authorModal.classList.add('hidden');
        authorForm.reset();
        authorStatus.classList.add('hidden');
      }
    });
  }

  // Submit author form
  if (authorForm) {
    authorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('author_name').value;
    const nationality = document.getElementById('author_nationality').value;
    const gender = document.getElementById('author_gender').value;

    const submitBtn = authorForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
      const response = await fetch('/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          author: { name, nationality, gender }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add new author to main book form dropdown
        const authorSelect = document.getElementById('book_author_id');
        if (authorSelect) {
          const option = document.createElement('option');
          option.value = data.id;
          option.textContent = data.name;
          option.selected = true;
          authorSelect.appendChild(option);
        }

        // Add to all bulk add author dropdowns
        const bulkAuthorSelects = document.querySelectorAll('select.author-select');
        bulkAuthorSelects.forEach(select => {
          const option = document.createElement('option');
          option.value = data.id;
          option.textContent = data.name;
          select.appendChild(option);
        });

        // Also add to series modal dropdown
        const seriesAuthorSelect = document.getElementById('series_author_id');
        const seriesOption = document.createElement('option');
        seriesOption.value = data.id;
        seriesOption.textContent = data.name;
        seriesAuthorSelect.appendChild(seriesOption);

        // Close modal
        authorModal.classList.add('hidden');
        authorForm.reset();

        // Show success message
        alert(`Author "${data.name}" created successfully!`);
      } else {
        throw new Error(data.errors?.join(', ') || 'Failed to create author');
      }
    } catch (error) {
      authorStatus.classList.remove('hidden');
      const statusDiv = authorStatus.querySelector('div');
      statusDiv.className = 'rounded-lg bg-red-50 border border-red-200 p-3';
      authorStatus.querySelector('p').className = 'text-sm text-red-800';
      authorStatus.querySelector('p').textContent = error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Author';
    }
    });
  }

  // Open series modal
  if (seriesBtn && seriesModal) {
    seriesBtn.addEventListener('click', () => {
      // Pre-select the currently selected author if any
      const currentAuthorId = document.getElementById('book_author_id')?.value;
      if (currentAuthorId) {
        document.getElementById('series_author_id').value = currentAuthorId;
      }
      seriesModal.classList.remove('hidden');
      document.getElementById('series_name').focus();
    });
  }

  // Close series modal
  if (cancelSeriesBtn && seriesModal) {
    cancelSeriesBtn.addEventListener('click', () => {
      seriesModal.classList.add('hidden');
      seriesForm.reset();
      seriesStatus.classList.add('hidden');
    });
  }

  // Close on background click
  if (seriesModal) {
    seriesModal.addEventListener('click', (e) => {
      if (e.target === seriesModal) {
        seriesModal.classList.add('hidden');
        seriesForm.reset();
        seriesStatus.classList.add('hidden');
      }
    });
  }

  // Submit series form
  if (seriesForm) {
    seriesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('series_name').value;
    const authorId = document.getElementById('series_author_id').value;

    const submitBtn = seriesForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
      const response = await fetch('/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          series: { name, author_id: authorId }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add new series to main book form dropdown
        const seriesSelect = document.getElementById('book_series_id');
        if (seriesSelect) {
          const option = document.createElement('option');
          option.value = data.id;
          option.textContent = data.name;
          option.setAttribute('data-author-id', data.author_id);
          option.selected = true;
          seriesSelect.appendChild(option);
        }

        // Add to all bulk add series dropdowns
        const bulkSeriesSelects = document.querySelectorAll('select.series-select');
        bulkSeriesSelects.forEach(select => {
          const option = document.createElement('option');
          option.value = data.id;
          option.textContent = data.name;
          option.setAttribute('data-author-id', data.author_id);
          select.appendChild(option);
        });

        // Close modal
        seriesModal.classList.add('hidden');
        seriesForm.reset();

        // Show success message
        alert(`Series "${data.name}" created successfully!`);
      } else {
        throw new Error(data.errors?.join(', ') || 'Failed to create series');
      }
    } catch (error) {
      seriesStatus.classList.remove('hidden');
      const statusDiv = seriesStatus.querySelector('div');
      statusDiv.className = 'rounded-lg bg-red-50 border border-red-200 p-3';
      seriesStatus.querySelector('p').className = 'text-sm text-red-800';
      seriesStatus.querySelector('p').textContent = error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Series';
    }
    });
  }

  // Open genre modal
  if (genreBtn && genreModal) {
    genreBtn.addEventListener('click', () => {
      genreModal.classList.remove('hidden');
      document.getElementById('genre_name').focus();
    });
  }

  // Close genre modal
  if (cancelGenreBtn && genreModal) {
    cancelGenreBtn.addEventListener('click', () => {
      genreModal.classList.add('hidden');
      genreForm.reset();
      genreStatus.classList.add('hidden');
    });
  }

  // Close on background click
  if (genreModal) {
    genreModal.addEventListener('click', (e) => {
      if (e.target === genreModal) {
        genreModal.classList.add('hidden');
        genreForm.reset();
        genreStatus.classList.add('hidden');
      }
    });
  }

  // Submit genre form
  if (genreForm) {
    genreForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('genre_name').value;

    const submitBtn = genreForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
      const response = await fetch('/genres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          genre: { name }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add new genre checkbox to the main form
        const genreCheckboxContainer = document.getElementById('genre-checkboxes');
        if (genreCheckboxContainer) {
          const label = document.createElement('label');
          label.className = 'flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'book[genre_ids][]';
          checkbox.value = data.id;
          checkbox.checked = true;
          checkbox.className = 'rounded border-neutral-300 text-purple-600 focus:ring-purple-500';

          const span = document.createElement('span');
          span.className = 'text-sm text-neutral-700';
          span.textContent = data.name;

          label.appendChild(checkbox);
          label.appendChild(span);
          genreCheckboxContainer.appendChild(label);
        }

        // Add to all bulk add genre checkbox containers
        const bulkGenreContainers = document.querySelectorAll('.genre-checkboxes-bulk');
        bulkGenreContainers.forEach(container => {
          const label = document.createElement('label');
          label.className = 'flex items-center gap-2 cursor-pointer';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'rounded border-neutral-300 text-purple-600 focus:ring-purple-500 genre-checkbox';
          checkbox.value = data.id;
          checkbox.setAttribute('data-genre-id', data.id);
          checkbox.setAttribute('data-genre-name', data.name);

          const span = document.createElement('span');
          span.className = 'text-sm text-neutral-700';
          span.textContent = data.name;

          label.appendChild(checkbox);
          label.appendChild(span);
          container.appendChild(label);
        });

        // Close modal
        genreModal.classList.add('hidden');
        genreForm.reset();

        // Show success message
        alert(`Genre "${data.name}" created successfully!`);
      } else {
        throw new Error(data.errors?.join(', ') || 'Failed to create genre');
      }
    } catch (error) {
      genreStatus.classList.remove('hidden');
      const statusDiv = genreStatus.querySelector('div');
      statusDiv.className = 'rounded-lg bg-red-50 border border-red-200 p-3';
      genreStatus.querySelector('p').className = 'text-sm text-red-800';
      genreStatus.querySelector('p').textContent = error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Genre';
    }
    });
  }
});
