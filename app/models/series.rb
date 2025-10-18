class Series < ApplicationRecord
  belongs_to :author
  has_many :books
end
