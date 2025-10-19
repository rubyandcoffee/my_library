class BooksController < ApplicationController
  before_action :set_book, only: [:edit, :update, :destroy]

  def index
    @books = Book.includes(:author, :genres, :series).all
    @authors = Author.all
    @genres = Genre.all

    # Search by title
    if params[:search].present?
      @books = @books.where("title LIKE ?", "%#{params[:search]}%")
    end

    # Filter by author
    if params[:author_id].present?
      @books = @books.where(author_id: params[:author_id])
    end

    # Filter by status
    if params[:status].present?
      @books = @books.where(status: params[:status])
    end

    # Filter by genre
    if params[:genre_id].present?
      @books = @books.joins(:genres).where(genres: { id: params[:genre_id] })
    end

    # Pagination
    @books = @books.page(params[:page]).per(15)
  end

  def new
    @book = Book.new
    @authors = Author.all
    @genres = Genre.all
    @series_list = Series.all
  end

  def create
    @book = Book.new(book_params)

    if @book.save
      redirect_to books_path, notice: "Book was successfully created."
    else
      @authors = Author.all
      @genres = Genre.all
      @series_list = Series.all
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @authors = Author.all
    @genres = Genre.all
    @series_list = Series.all
  end

  def update
    if @book.update(book_params)
      redirect_to books_path, notice: "Book was successfully updated."
    else
      @authors = Author.all
      @genres = Genre.all
      @series_list = Series.all
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @book.destroy
    redirect_to books_path, notice: "Book was successfully deleted."
  end

  def duplicate
    original_book = Book.find(params[:id])
    @book = original_book.dup
    @book.genre_ids = original_book.genre_ids
    @authors = Author.all
    @genres = Genre.all
    @series_list = Series.all
    render :new
  end

  def bulk_new
    @authors = Author.all
    @genres = Genre.all
    @series_list = Series.all
    @book_count = 5 # Start with 5 rows
  end

  def reading_goals
    @year = params[:year]&.to_i || Date.today.year
    @books_by_month = {}

    # Initialize all 12 months
    (1..12).each do |month|
      @books_by_month[month] = []
    end

    # Get all books with goals for the selected year
    books_with_goals = Book.includes(:author, :series)
                           .where(goal_year: @year)
                           .where.not(goal_month: nil)
                           .order(:goal_month, :title)

    # Group books by month
    books_with_goals.each do |book|
      @books_by_month[book.goal_month] << book if book.goal_month
    end

    # Calculate stats
    @total_books = books_with_goals.count
    @read_books = books_with_goals.where(status: :read).count
    @completion_percentage = @total_books > 0 ? (@read_books.to_f / @total_books * 100).round : 0
  end

  def bulk_create
    books_params = params[:books]&.to_unsafe_h || {}
    created_books = []
    skipped_books = []
    failed_books = []

    books_params.each do |index, book_data|
      # Skip empty rows (rows with no title)
      next if book_data[:title].blank?

      # Check if book already exists (same title and author, regardless of series)
      existing_book = Book.where(
        'LOWER(title) = ?', book_data[:title].downcase
      ).where(
        author_id: book_data[:author_id]
      ).first

      if existing_book
        skipped_books << { index: index.to_i + 1, title: book_data[:title] }
        next
      end

      book = Book.new(
        title: book_data[:title],
        author_id: book_data[:author_id],
        series_id: book_data[:series_id],
        status: book_data[:status],
        ownership: book_data[:ownership],
        rating: book_data[:rating],
        page_count: book_data[:page_count],
        goal_month: book_data[:goal_month],
        goal_year: book_data[:goal_year],
        genre_ids: book_data[:genre_ids]&.reject(&:blank?)
      )

      if book.save
        created_books << book
      else
        failed_books << { index: index.to_i + 1, errors: book.errors.full_messages }
      end
    end

    # Build success/warning message
    messages = []
    messages << "Successfully created #{created_books.count} #{'book'.pluralize(created_books.count)}." if created_books.any?
    messages << "Skipped #{skipped_books.count} #{'book'.pluralize(skipped_books.count)} that already exist." if skipped_books.any?

    if failed_books.any?
      flash.now[:alert] = "#{failed_books.count} #{'book'.pluralize(failed_books.count)} could not be created."
      flash.now[:notice] = messages.join(' ') if messages.any?
      @authors = Author.all
      @genres = Genre.all
      @series_list = Series.all
      @book_count = books_params.count
      @failed_books = failed_books
      render :bulk_new, status: :unprocessable_entity
    else
      redirect_to books_path, notice: messages.join(' ')
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :author_id, :status, :ownership, :series_id, :rating, :page_count, :goal_month, :goal_year, genre_ids: [])
  end
end
