class YearlyReadingGoal < ApplicationRecord
  validates :year, presence: true, uniqueness: true
  validates :target_books, presence: true, numericality: { greater_than_or_equal_to: 0, only_integer: true }

  scope :for_year, ->(year) { where(year: year) }

  # Find or create a goal for a specific year with default target
  def self.find_or_create_for_year(year)
    find_or_create_by!(year: year) do |goal|
      goal.target_books = 50
    end
  end
end
