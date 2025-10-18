// Filter series dropdown based on selected author
document.addEventListener('turbo:load', () => {
  const authorSelect = document.getElementById('book_author_id');
  const seriesSelect = document.getElementById('book_series_id');

  if (authorSelect && seriesSelect) {
    const allOptions = Array.from(seriesSelect.options);

    authorSelect.addEventListener('change', () => {
      const selectedAuthorId = authorSelect.value;

      // Clear current options except the "None" option
      seriesSelect.innerHTML = '';

      // Always add the "None" option first
      const noneOption = document.createElement('option');
      noneOption.value = '';
      noneOption.textContent = 'None';
      seriesSelect.appendChild(noneOption);

      // Filter and add matching series
      allOptions.forEach(option => {
        if (option.value === '') return; // Skip the original "None" option

        const optionAuthorId = option.dataset.authorId;

        // Show series if no author selected OR if author matches
        if (!selectedAuthorId || optionAuthorId === selectedAuthorId) {
          seriesSelect.appendChild(option.cloneNode(true));
        }
      });
    });
  }
});
