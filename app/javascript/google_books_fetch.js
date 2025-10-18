// Google Books API integration for auto-filling book data
document.addEventListener('turbo:load', () => {
  const fetchButton = document.getElementById('fetch-book-data');

  if (!fetchButton) return;

  const modal = document.getElementById('book-selection-modal');
  const optionsList = document.getElementById('book-options-list');
  const cancelButton = document.getElementById('cancel-book-selection');

  // Close modal on cancel
  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  fetchButton.addEventListener('click', async () => {
    const titleInput = document.getElementById('book_title');
    const authorSelect = document.getElementById('book_author_id');
    const pageCountInput = document.getElementById('book_page_count');
    const statusDiv = document.getElementById('fetch-status');
    const statusText = statusDiv.querySelector('p');

    const title = titleInput.value.trim();

    if (!title) {
      alert('Please enter a book title first');
      return;
    }

    // Get selected author name for better search
    const selectedAuthorOption = authorSelect.options[authorSelect.selectedIndex];
    const authorName = selectedAuthorOption && selectedAuthorOption.value ? selectedAuthorOption.text : '';

    // Build search query
    let searchQuery = `intitle:${title}`;
    if (authorName) {
      searchQuery += `+inauthor:${authorName}`;
    }

    // Show loading state
    fetchButton.disabled = true;
    fetchButton.textContent = '⏳ Fetching...';
    statusDiv.classList.remove('hidden');
    statusDiv.querySelector('div').className = 'rounded-lg bg-blue-50 border border-blue-200 p-3';
    statusText.className = 'text-sm text-blue-800';
    statusText.textContent = 'Searching Google Books...';

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=15`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Google Books API');
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        console.log('Total items from API:', data.items.length);

        // Filter out books with suspiciously low page counts (likely excerpts/previews)
        const validBooks = data.items
          .map(item => item.volumeInfo)
          .filter(book => {
            console.log(`Book: "${book.title}", Pages: ${book.pageCount || 'N/A'}`);
            return book.pageCount && book.pageCount > 50;
          }) // Filter out likely excerpts
          .slice(0, 6); // Take top 6

        console.log('Valid books after filtering:', validBooks.length);

        if (validBooks.length === 0) {
          // Check if we have any books at all, even with low page counts
          const anyBooks = data.items
            .map(item => item.volumeInfo)
            .filter(book => book.pageCount);

          if (anyBooks.length > 0) {
            const book = anyBooks[0];
            let bookDetails = `Found: "${book.title}"`;
            if (book.authors) bookDetails += `\nAuthor(s): ${book.authors.join(', ')}`;
            if (book.publishedDate) bookDetails += `\nPublished: ${book.publishedDate}`;
            bookDetails += `\n\nPage Count: ${book.pageCount}`;
            bookDetails += `\n\n⚠️ WARNING: This page count seems unusually low (${book.pageCount} pages).`;
            bookDetails += `\nThis might be a preview, excerpt, or incorrect data.`;
            bookDetails += `\n\nDo you still want to use this value?`;

            if (confirm(bookDetails)) {
              pageCountInput.value = book.pageCount;
              statusDiv.querySelector('div').className = 'rounded-lg bg-amber-50 border border-amber-200 p-3';
              statusText.className = 'text-sm text-amber-800';
              statusText.textContent = `⚠️ Page count set to ${book.pageCount} (verify this is correct)`;
            } else {
              statusDiv.querySelector('div').className = 'rounded-lg bg-neutral-50 border border-neutral-200 p-3';
              statusText.className = 'text-sm text-neutral-800';
              statusText.textContent = 'Cancelled. You may need to enter the page count manually.';
            }
          } else {
            statusDiv.querySelector('div').className = 'rounded-lg bg-amber-50 border border-amber-200 p-3';
            statusText.className = 'text-sm text-amber-800';
            statusText.textContent = 'Found book(s) but no page count data available.';
          }
          return;
        }

        // Build options list for user to choose from
        optionsList.innerHTML = '';

        validBooks.forEach((book, index) => {
          const bookCard = document.createElement('div');
          bookCard.className = 'border border-neutral-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition';

          let bookHTML = `
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                ${index + 1}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-neutral-900 mb-1">${book.title}</h4>
          `;

          if (book.authors && book.authors.length > 0) {
            bookHTML += `<p class="text-sm text-neutral-600 mb-1">by ${book.authors.join(', ')}</p>`;
          }

          const details = [];
          if (book.publishedDate) details.push(book.publishedDate);
          if (book.publisher) details.push(book.publisher);

          if (details.length > 0) {
            bookHTML += `<p class="text-xs text-neutral-500 mb-2">${details.join(' • ')}</p>`;
          }

          bookHTML += `
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <span>📄</span>
                  <span>${book.pageCount} pages</span>
                </div>
              </div>
            </div>
          `;

          bookCard.innerHTML = bookHTML;

          bookCard.addEventListener('click', () => {
            pageCountInput.value = book.pageCount;
            modal.classList.add('hidden');
            statusDiv.querySelector('div').className = 'rounded-lg bg-green-50 border border-green-200 p-3';
            statusText.className = 'text-sm text-green-800';
            statusText.textContent = `✓ Page count updated to ${book.pageCount} pages`;
          });

          optionsList.appendChild(bookCard);
        });

        // Show modal
        modal.classList.remove('hidden');
      } else {
        statusDiv.querySelector('div').className = 'rounded-lg bg-amber-50 border border-amber-200 p-3';
        statusText.className = 'text-sm text-amber-800';
        statusText.textContent = 'No results found. Try adjusting the title or author.';
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      statusDiv.querySelector('div').className = 'rounded-lg bg-red-50 border border-red-200 p-3';
      statusText.className = 'text-sm text-red-800';
      statusText.textContent = 'Error fetching data from Google Books. Please try again.';
    } finally {
      fetchButton.disabled = false;
      fetchButton.textContent = '📚 Enter a title and author to auto-fill the page number';

      // Hide status after 5 seconds
      setTimeout(() => {
        statusDiv.classList.add('hidden');
      }, 5000);
    }
  });
});
