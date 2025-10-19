# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "series_filter"
pin "bulk_books"
pin "currently_reading_dropdown"
pin "google_books_fetch"
pin "inline_create"
pin "genre_search"
