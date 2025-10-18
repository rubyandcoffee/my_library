class AddSeriesToBooks < ActiveRecord::Migration[8.0]
  def change
    add_reference :books, :series, null: true, foreign_key: true
  end
end
