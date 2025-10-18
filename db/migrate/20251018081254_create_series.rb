class CreateSeries < ActiveRecord::Migration[8.0]
  def change
    create_table :series do |t|
      t.string :name
      t.references :author, null: false, foreign_key: true

      t.timestamps
    end
  end
end
