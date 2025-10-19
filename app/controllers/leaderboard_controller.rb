class LeaderboardController < ApplicationController
  def index
    # Top rated books (top 10, one per author)
    # Get all rated books ordered by rating and ID (for tiebreaking)
    all_rated_books = Book.includes(:author, :genres)
                          .where.not(rating: nil)
                          .order(rating: :desc, id: :asc)

    # Select one book per author, keeping the highest rated
    seen_authors = Set.new
    @top_books = []

    all_rated_books.each do |book|
      unless seen_authors.include?(book.author_id)
        @top_books << book
        seen_authors.add(book.author_id)
        break if @top_books.size >= 10
      end
    end

    # Gender distribution (only read books)
    read_books = Book.includes(:author).where(status: :read)
    @gender_stats = read_books.joins(:author).where.not(authors: { gender: nil })
                               .group("authors.gender").count

    # Nationality distribution (top 10)
    @nationality_stats = Book.includes(:author).where(status: :read)
                              .joins(:author).where.not(authors: { nationality: nil })
                              .group("authors.nationality").count
                              .sort_by { |k, v| -v }.first(10).to_h

    # Genre distribution
    @genre_stats = Book.joins(:genres).where(status: :read)
                       .group("genres.name").count
                       .sort_by { |k, v| -v }.to_h

    # Reading status distribution
    @status_stats = Book.where.not(status: nil).group(:status).count
  end
end
