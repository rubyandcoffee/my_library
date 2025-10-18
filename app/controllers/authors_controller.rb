class AuthorsController < ApplicationController
  before_action :set_author, only: [:edit, :update, :destroy]

  def index
    @authors = Author.all.order(:name)
  end

  def new
    @author = Author.new
  end

  def create
    @author = Author.new(author_params)

    if @author.save
      respond_to do |format|
        format.html { redirect_to authors_path, notice: "Author was successfully created." }
        format.json { render json: { id: @author.id, name: @author.name }, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @author.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @author.update(author_params)
      redirect_to authors_path, notice: "Author was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @author.destroy
      redirect_to authors_path, notice: "Author was successfully deleted."
    else
      redirect_to authors_path, alert: "Cannot delete author because they have associated books or series. Please delete those first."
    end
  end

  private

  def set_author
    @author = Author.find(params[:id])
  end

  def author_params
    params.require(:author).permit(:name, :nationality, :gender)
  end
end
