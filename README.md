# 📚 My Library

A beautiful, modern personal library management app built with Ruby on Rails. Track your reading journey, organize your collection, and visualize your reading statistics with style!

![Ruby](https://img.shields.io/badge/Ruby-3.2.2-red?logo=ruby)
![Rails](https://img.shields.io/badge/Rails-8.0.3-red?logo=rubyonrails)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)

## ✨ Features

### 📖 Book Management
- **Complete CRUD operations** for books, authors, series, and genres
- **Smart search & filters** - Find books by title, author, series, status, ownership, rating, and more
- **Duplicate books** with one click for quick data entry
- **Bulk add** multiple books at once with a spreadsheet-style interface
- **Google Books API integration** - Auto-fill page counts and book details
- **Reading time estimates** based on page count
- **Inline creation** - Add new authors, series, and genres without leaving the book form

### 🎯 Reading Goals
- **Monthly planning** - Set reading goals by month and year
- **Visual progress tracking** - See your completion rate and monthly breakdown
- **Status badges** - Track books as unread, reading, read, TBR, or DNF
- **Year navigation** - Browse and plan across multiple years

### 📊 Statistics & Leaderboards
- **Podium display** for your top-rated books (🏆 🥈 🥉)
- **Interactive charts** powered by Chart.js:
  - Author gender distribution
  - Reading status breakdown
  - Genre distribution
  - Top 10 author nationalities
- **Visual insights** into your reading habits

### 🎨 Beautiful Design
- **Modern UI** with Tailwind CSS 4.x
- **Responsive layout** - Works on desktop, tablet, and mobile
- **Color-coded sections** - Purple, pink, orange, blue, and amber themes
- **Smooth transitions** and hover effects
- **Clean typography** and spacious layouts

### 🚀 Additional Features
- **Pagination** - Browse large collections with ease (15 books per page)
- **Author profiles** with nationality and gender tracking
- **Series organization** - Group books by series
- **Multiple genres** per book
- **Star ratings** (1-5 stars)
- **Ownership tracking** - Owned, borrowed, wishlist, or sold
- **Currently Reading** dropdown in navigation
- **Book duplication** for quick entry of similar books

## 🛠️ Tech Stack

- **Backend**: Ruby 3.2.2, Rails 8.0.3
- **Frontend**: Tailwind CSS 4.x, Turbo, Stimulus
- **Database**: SQLite (development), PostgreSQL-ready
- **Charts**: Chart.js 4.4.1
- **APIs**: Google Books API (no authentication required)
- **Pagination**: Kaminari gem
- **Deployment**: Kamal-ready with Docker support

## 🏁 Getting Started

### Prerequisites

- Ruby 3.2.2
- Rails 8.0.3
- Node.js and npm (for asset compilation)
- chruby (for Ruby version management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my_library
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Set up the database**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed  # Optional: Add sample data
   ```

5. **Start the development server**
   ```bash
   bin/dev
   ```

6. **Visit the app**
   Open your browser to `http://localhost:3000`

## 📝 Usage

### Adding Your First Book

1. Click **"New Book"** from the Books page
2. Fill in the book details:
   - Title and Author (required)
   - Series (optional)
   - Page count
   - Status, ownership, and rating
   - Genres (select multiple)
   - Reading goal (optional month/year)
3. Use the **Google Books button** to auto-fill page count
4. Click **"Create Book"** to save

### Setting Reading Goals

1. Navigate to **"Reading Goals"** in the menu
2. Edit a book and set a goal month and year
3. View your yearly plan organized by month
4. Track your progress with completion statistics

### Bulk Adding Books

1. Click **"Bulk Add Books"** from the Books page
2. Fill in multiple books in the spreadsheet-style form
3. Use **"+ New Author"** or **"+ New Series"** to create new items on the fly
4. Submit to create all books at once

### Viewing Statistics

1. Navigate to **"Leaderboard"** in the menu
2. See your top-rated books in podium format
3. Explore charts showing:
   - Gender distribution of authors you've read
   - Your reading status breakdown
   - Favorite genres
   - Top nationalities

## 🎨 Color Scheme

- **Purple** (`purple-500`) - Authors and primary actions
- **Pink** (`pink-500`) - Series
- **Orange** (`orange-500`) - Branding and highlights
- **Blue** (`blue-500`) - Information and utilities
- **Amber** (`amber-500`) - Reading goals
- **Green** (`green-500`) - Success states
- **Neutral** - Base UI elements

## 📦 Database Schema

### Books
- Title, page_count, status, ownership, rating
- Author (belongs_to)
- Series (belongs_to, optional)
- Genres (has_many through)
- Reading goals (goal_month, goal_year)

### Authors
- Name, nationality, gender
- Books (has_many)
- Series (has_many)

### Series
- Name
- Author (belongs_to)
- Books (has_many)

### Genres
- Name
- Books (has_many through)

## 🚢 Deployment

This app is configured for deployment with Kamal:

```bash
# Set up Kamal configuration
kamal setup

# Deploy
kamal deploy
```

See `.kamal/` directory for deployment configuration.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

Copyright © 2025. All rights reserved.

This software is available for **personal, educational, and non-commercial use only**.

**You may:**
- ✅ Use and modify it for your own non-commercial use

**You may NOT:**
- ❌ Use this software for commercial purposes
- ❌ Sell products or services based on this code
- ❌ Redistribute this software commercially

For commercial licensing inquiries, please contact the project owner.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

## 🙏 Acknowledgments

- Built with [Ruby on Rails](https://rubyonrails.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Book data from [Google Books API](https://developers.google.com/books)
- Pagination by [Kaminari](https://github.com/kaminari/kaminari)

---

Made with ❤️ and lots of ☕

**Happy Reading! 📖✨**
