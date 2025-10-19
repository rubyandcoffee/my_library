require "test_helper"

class YearlyReadingGoalsControllerTest < ActionDispatch::IntegrationTest
  test "should update yearly goal" do
    goal = YearlyReadingGoal.find_or_create_for_year(2025)
    patch yearly_reading_goal_url(goal), params: {
      yearly_reading_goal: {
        target_books: 100
      }
    }
    assert_redirected_to reading_goals_path(year: goal.year)

    goal.reload
    assert_equal 100, goal.target_books
  end

  test "should not update with invalid data" do
    goal = YearlyReadingGoal.find_or_create_for_year(2026)
    original_target = goal.target_books

    patch yearly_reading_goal_url(goal), params: {
      yearly_reading_goal: {
        target_books: -5
      }
    }

    goal.reload
    assert_equal original_target, goal.target_books
  end
end
