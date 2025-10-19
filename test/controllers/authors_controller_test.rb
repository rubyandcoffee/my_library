require "test_helper"

class AuthorsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get authors_url
    assert_response :success
  end

  test "should get new" do
    get new_author_url
    assert_response :success
  end

  test "should get edit" do
    author = Author.create!(name: "Test Author")
    get edit_author_url(author)
    assert_response :success
  end
end
