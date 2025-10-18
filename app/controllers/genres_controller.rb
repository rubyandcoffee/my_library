class GenresController < ApplicationController
  before_action :set_genre, only: [:edit, :update, :destroy]

  def index
    @genres = Genre.all.order(:name)
  end

  def new
    @genre = Genre.new
  end

  def create
    @genre = Genre.new(genre_params)

    if @genre.save
      respond_to do |format|
        format.html { redirect_to genres_path, notice: "Genre was successfully created." }
        format.json { render json: { id: @genre.id, name: @genre.name }, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @genre.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @genre.update(genre_params)
      redirect_to genres_path, notice: "Genre was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @genre.destroy
      redirect_to genres_path, notice: "Genre was successfully deleted."
    else
      redirect_to genres_path, alert: "Cannot delete genre because it has associated books. Please delete those first."
    end
  end

  private

  def set_genre
    @genre = Genre.find(params[:id])
  end

  def genre_params
    params.require(:genre).permit(:name)
  end
end
