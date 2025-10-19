class LeaderboardController < ApplicationController
  def index
    # Top rated books (top 10)
    @top_books = Book.includes(:author, :genres).where.not(rating: nil)
                     .order(rating: :desc).limit(10)

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
