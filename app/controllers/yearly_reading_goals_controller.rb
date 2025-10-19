class YearlyReadingGoalsController < ApplicationController
  before_action :set_yearly_goal, only: [ :update ]

  def update
    if @yearly_goal.update(yearly_goal_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "yearly_goal_#{@yearly_goal.id}",
            partial: "yearly_reading_goals/goal_display",
            locals: { yearly_goal: @yearly_goal }
          )
        end
        format.html { redirect_to reading_goals_path(year: @yearly_goal.year), notice: "Goal updated successfully." }
        format.json { render json: @yearly_goal }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "yearly_goal_#{@yearly_goal.id}",
            partial: "yearly_reading_goals/goal_form",
            locals: { yearly_goal: @yearly_goal }
          )
        end
        format.html { redirect_to reading_goals_path(year: @yearly_goal.year), alert: "Failed to update goal." }
        format.json { render json: @yearly_goal.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_yearly_goal
    @yearly_goal = YearlyReadingGoal.find(params[:id])
  end

  def yearly_goal_params
    params.require(:yearly_reading_goal).permit(:target_books)
  end
end
