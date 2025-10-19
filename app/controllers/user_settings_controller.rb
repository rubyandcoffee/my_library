class UserSettingsController < ApplicationController
  before_action :set_user_setting, only: [ :update ]

  def update
    if @user_setting.update(user_setting_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "user_settings_display",
            partial: "user_settings/settings_display",
            locals: { user_setting: @user_setting }
          )
        end
        format.html { redirect_to reading_goals_path, notice: "Settings updated successfully." }
        format.json { render json: @user_setting }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "user_settings_display",
            partial: "user_settings/settings_form",
            locals: { user_setting: @user_setting }
          )
        end
        format.html { redirect_to reading_goals_path, alert: "Failed to update settings." }
        format.json { render json: @user_setting.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_user_setting
    @user_setting = UserSetting.current
  end

  def user_setting_params
    params.require(:user_setting).permit(:daily_reading_minutes, :reading_speed_wpm)
  end
end
