class AddPageCountToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :page_count, :integer
  end
end
