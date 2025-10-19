class UserSetting < ApplicationRecord
  validates :reading_speed_wpm, presence: true, numericality: { greater_than: 0 }
  validates :daily_reading_minutes, presence: true, numericality: { greater_than: 0 }

  # Singleton pattern - only one settings record should exist
  def self.current
    first_or_create!(
      reading_speed_wpm: 239,
      daily_reading_minutes: 60
    )
  end
end
