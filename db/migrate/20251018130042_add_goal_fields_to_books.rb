class AddGoalFieldsToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :goal_month, :integer
    add_column :books, :goal_year, :integer
  end
end
