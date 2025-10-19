require "test_helper"

class UserSettingTest < ActiveSupport::TestCase
  test "should have default values" do
    setting = UserSetting.current
    assert_equal 239, setting.reading_speed_wpm
    assert_equal 60, setting.daily_reading_minutes
  end

  test "current returns singleton instance" do
    setting1 = UserSetting.current
    setting2 = UserSetting.current
    assert_equal setting1.id, setting2.id
  end

  test "should validate reading_speed_wpm is positive" do
    setting = UserSetting.current
    setting.reading_speed_wpm = 0
    assert_not setting.valid?
    assert_includes setting.errors[:reading_speed_wpm], "must be greater than 0"
  end

  test "should validate daily_reading_minutes is positive" do
    setting = UserSetting.current
    setting.daily_reading_minutes = -1
    assert_not setting.valid?
    assert_includes setting.errors[:daily_reading_minutes], "must be greater than 0"
  end

  test "should update settings" do
    setting = UserSetting.current
    setting.update(daily_reading_minutes: 90, reading_speed_wpm: 250)
    assert_equal 90, setting.daily_reading_minutes
    assert_equal 250, setting.reading_speed_wpm
  end
end
