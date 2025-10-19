class Book < ApplicationRecord
  belongs_to :author
  belongs_to :series, optional: true
  has_and_belongs_to_many :genres

  validates :title, presence: true
  validates :title, uniqueness: { scope: :author_id, case_sensitive: false }
  validates :rating, inclusion: { in: 1..5, allow_nil: true }

  enum :status, {
    unread: 0,
    read: 1,
    tbr: 2,
    dnf: 3,
    reading: 4
  }

  enum :ownership, {
    owned: 0,
    borrowed: 1,
    wishlist: 2,
    sold: 3
  }

  # Calculate reading time based on 239 WPM reading speed
  # Average: 250-300 words per page
  def estimated_reading_time
    return nil unless page_count.present? && page_count > 0

    words_per_page = 275 # Average
    total_words = page_count * words_per_page
    reading_speed_wpm = 239

    minutes = (total_words / reading_speed_wpm.to_f).round

    if minutes < 60
      "#{minutes} min"
    else
      hours = minutes / 60
      remaining_minutes = minutes % 60
      if remaining_minutes == 0
        "#{hours} hr"
      else
        "#{hours} hr #{remaining_minutes} min"
      end
    end
  end
end
