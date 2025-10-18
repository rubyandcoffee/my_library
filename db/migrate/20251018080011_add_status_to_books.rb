class AddStatusToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :status, :integer
  end
end
