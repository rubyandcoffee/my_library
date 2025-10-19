// Genre search and tag functionality
document.addEventListener('turbo:load', function() {
  const searchInput = document.getElementById('genre-search');
  const dropdown = document.getElementById('genre-dropdown');
  const selectedGenresContainer = document.getElementById('selected-genres');
  const hiddenInputsContainer = document.getElementById('genre-hidden-inputs');
  const noGenresPlaceholder = document.getElementById('no-genres-placeholder');

  if (!searchInput || !dropdown) return;

  // Show dropdown when search input is focused
  searchInput.addEventListener('focus', function() {
    dropdown.classList.remove('hidden');
    filterGenres('');
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // Filter genres as user types
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterGenres(searchTerm);
  });

  // Filter genre options based on search term
  function filterGenres(searchTerm) {
    const options = dropdown.querySelectorAll('.genre-option');
    let hasVisibleOptions = false;

    options.forEach(option => {
      const genreName = option.dataset.genreName.toLowerCase();
      const genreId = option.dataset.genreId;
      const isSelected = document.querySelector(`input[name="book[genre_ids][]"][value="${genreId}"]`) !== null;

      if (genreName.includes(searchTerm) && !isSelected) {
        option.classList.remove('hidden');
        hasVisibleOptions = true;
      } else {
        option.classList.add('hidden');
      }
    });

    // Show "No results" message if no options match
    let noResultsMsg = dropdown.querySelector('.no-results');
    if (!hasVisibleOptions) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results px-4 py-2 text-sm text-neutral-500 italic';
        noResultsMsg.textContent = 'No genres found';
        dropdown.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // Add genre when clicked
  dropdown.addEventListener('click', function(e) {
    const option = e.target.closest('.genre-option');
    if (option) {
      const genreId = option.dataset.genreId;
      const genreName = option.dataset.genreName;
      addGenre(genreId, genreName);
      searchInput.value = '';
      filterGenres('');
      searchInput.focus();
    }
  });

  // Add genre tag and hidden input
  function addGenre(genreId, genreName) {
    // Check if already selected
    if (document.querySelector(`input[name="book[genre_ids][]"][value="${genreId}"]`)) {
      return;
    }

    // Remove placeholder if it exists
    if (noGenresPlaceholder && !noGenresPlaceholder.classList.contains('hidden')) {
      noGenresPlaceholder.remove();
    }

    // Create tag element
    const tag = document.createElement('span');
    tag.className = 'genre-tag inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium';
    tag.dataset.genreId = genreId;
    tag.innerHTML = `
      ${genreName}
      <button type="button" class="remove-genre text-purple-600 hover:text-purple-800 font-bold" data-genre-id="${genreId}">&times;</button>
    `;

    // Add to selected genres container
    selectedGenresContainer.appendChild(tag);

    // Create hidden input for form submission
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'book[genre_ids][]';
    hiddenInput.value = genreId;
    hiddenInput.dataset.genreId = genreId;
    hiddenInputsContainer.appendChild(hiddenInput);

    // Add remove functionality
    const removeBtn = tag.querySelector('.remove-genre');
    removeBtn.addEventListener('click', function() {
      removeGenre(genreId);
    });
  }

  // Remove genre tag and hidden input
  function removeGenre(genreId) {
    // Remove tag
    const tag = selectedGenresContainer.querySelector(`.genre-tag[data-genre-id="${genreId}"]`);
    if (tag) {
      tag.remove();
    }

    // Remove hidden input
    const hiddenInput = hiddenInputsContainer.querySelector(`input[data-genre-id="${genreId}"]`);
    if (hiddenInput) {
      hiddenInput.remove();
    }

    // Show placeholder if no genres selected
    const remainingTags = selectedGenresContainer.querySelectorAll('.genre-tag');
    if (remainingTags.length === 0 && noGenresPlaceholder) {
      const placeholder = document.createElement('span');
      placeholder.className = 'text-sm text-neutral-400 italic';
      placeholder.id = 'no-genres-placeholder';
      placeholder.textContent = 'No genres selected - search below to add';
      selectedGenresContainer.appendChild(placeholder);
    }

    // Refresh the dropdown to show the removed genre again
    filterGenres(searchInput.value.toLowerCase());
  }

  // Handle remove buttons for pre-existing genres
  document.querySelectorAll('.remove-genre').forEach(btn => {
    btn.addEventListener('click', function() {
      const genreId = this.dataset.genreId;
      removeGenre(genreId);
    });
  });

  // Handle keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const visibleOptions = Array.from(dropdown.querySelectorAll('.genre-option:not(.hidden)'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visibleOptions.length > 0) {
        visibleOptions[0].focus();
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      searchInput.blur();
    }
  });

  // Allow arrow key navigation in dropdown
  dropdown.addEventListener('keydown', function(e) {
    const visibleOptions = Array.from(dropdown.querySelectorAll('.genre-option:not(.hidden)'));
    const currentIndex = visibleOptions.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(currentIndex + 1, visibleOptions.length - 1);
      visibleOptions[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex <= 0) {
        searchInput.focus();
      } else {
        visibleOptions[currentIndex - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0) {
        visibleOptions[currentIndex].click();
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      searchInput.focus();
    }
  });

  // Make genre options focusable
  dropdown.querySelectorAll('.genre-option').forEach(option => {
    option.setAttribute('tabindex', '0');
  });
});
