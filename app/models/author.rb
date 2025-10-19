class Author < ApplicationRecord
  has_many :books, dependent: :restrict_with_error
  has_many :series, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  enum :gender, {
    male: 0,
    female: 1
  }
end
