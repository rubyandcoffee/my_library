class CreateUserSettings < ActiveRecord::Migration[8.0]
  def change
    create_table :user_settings do |t|
      t.integer :reading_speed_wpm, default: 239, null: false
      t.integer :daily_reading_minutes, default: 60, null: false

      t.timestamps
    end

    # Create the singleton record
    reversible do |dir|
      dir.up do
        execute <<-SQL
          INSERT INTO user_settings (reading_speed_wpm, daily_reading_minutes, created_at, updated_at)
          VALUES (239, 60, datetime('now'), datetime('now'));
        SQL
      end
    end
  end
end
