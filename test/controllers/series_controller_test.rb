require "test_helper"

class SeriesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get series_index_url
    assert_response :success
  end

  test "should get new" do
    get new_series_url
    assert_response :success
  end

  test "should get edit" do
    author = Author.create!(name: "Test Author")
    series = Series.create!(name: "Test Series", author: author)
    get edit_series_url(series)
    assert_response :success
  end
end
