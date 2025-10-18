class AddNationalityAndGenderToAuthors < ActiveRecord::Migration[8.0]
  def change
    add_column :authors, :nationality, :string
    add_column :authors, :gender, :integer
  end
end
