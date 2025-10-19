require "test_helper"

class UserSettingsControllerTest < ActionDispatch::IntegrationTest
  test "should update user settings" do
    setting = UserSetting.current
    patch user_settings_url, params: {
      user_setting: {
        daily_reading_minutes: 90,
        reading_speed_wpm: 250
      }
    }
    assert_redirected_to reading_goals_path

    setting.reload
    assert_equal 90, setting.daily_reading_minutes
    assert_equal 250, setting.reading_speed_wpm
  end

  test "should not update with invalid data" do
    setting = UserSetting.current
    original_minutes = setting.daily_reading_minutes

    patch user_settings_url, params: {
      user_setting: {
        daily_reading_minutes: -10
      }
    }

    setting.reload
    assert_equal original_minutes, setting.daily_reading_minutes
  end
end
