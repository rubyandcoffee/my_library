class AddOwnershipToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :ownership, :integer
  end
end
