class CreateYearlyReadingGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :yearly_reading_goals do |t|
      t.integer :year, null: false
      t.integer :target_books, default: 50, null: false

      t.timestamps
    end

    add_index :yearly_reading_goals, :year, unique: true
  end
end
