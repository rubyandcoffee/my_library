require "test_helper"

class YearlyReadingGoalTest < ActiveSupport::TestCase
  test "should create goal with year and target_books" do
    goal = YearlyReadingGoal.create(year: 2025, target_books: 75)
    assert goal.persisted?
    assert_equal 2025, goal.year
    assert_equal 75, goal.target_books
  end

  test "should have default target_books of 50" do
    goal = YearlyReadingGoal.create(year: 2026)
    assert_equal 50, goal.target_books
  end

  test "should validate uniqueness of year" do
    YearlyReadingGoal.create(year: 2024, target_books: 50)
    duplicate_goal = YearlyReadingGoal.new(year: 2024, target_books: 60)
    assert_not duplicate_goal.valid?
    assert_includes duplicate_goal.errors[:year], "has already been taken"
  end

  test "should validate presence of year" do
    goal = YearlyReadingGoal.new(target_books: 50)
    assert_not goal.valid?
    assert_includes goal.errors[:year], "can't be blank"
  end

  test "should validate target_books is non-negative" do
    goal = YearlyReadingGoal.new(year: 2027, target_books: -5)
    assert_not goal.valid?
    assert_includes goal.errors[:target_books], "must be greater than or equal to 0"
  end

  test "find_or_create_for_year creates new goal with default" do
    goal = YearlyReadingGoal.find_or_create_for_year(2028)
    assert_equal 2028, goal.year
    assert_equal 50, goal.target_books
  end

  test "find_or_create_for_year returns existing goal" do
    existing = YearlyReadingGoal.create(year: 2029, target_books: 100)
    goal = YearlyReadingGoal.find_or_create_for_year(2029)
    assert_equal existing.id, goal.id
    assert_equal 100, goal.target_books
  end

  test "for_year scope returns goals for specific year" do
    YearlyReadingGoal.create(year: 2030, target_books: 60)
    YearlyReadingGoal.create(year: 2031, target_books: 70)

    goals_2030 = YearlyReadingGoal.for_year(2030)
    assert_equal 1, goals_2030.count
    assert_equal 2030, goals_2030.first.year
  end
end
