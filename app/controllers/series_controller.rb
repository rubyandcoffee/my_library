class SeriesController < ApplicationController
  before_action :set_series, only: [ :edit, :update, :destroy ]

  def index
    @series = Series.includes(:author, :books).all
  end

  def new
    @series = Series.new
    @authors = Author.all
  end

  def create
    @series = Series.new(series_params)

    if @series.save
      respond_to do |format|
        format.html { redirect_to series_index_path, notice: "Series was successfully created." }
        format.json { render json: { id: @series.id, name: @series.name, author_id: @series.author_id }, status: :created }
      end
    else
      respond_to do |format|
        format.html do
          @authors = Author.all
          render :new, status: :unprocessable_entity
        end
        format.json { render json: { errors: @series.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @authors = Author.all
  end

  def update
    if @series.update(series_params)
      redirect_to series_index_path, notice: "Series was successfully updated."
    else
      @authors = Author.all
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @series.destroy
    redirect_to series_index_path, notice: "Series was successfully deleted."
  end

  private

  def set_series
    @series = Series.find(params[:id])
  end

  def series_params
    params.require(:series).permit(:name, :author_id)
  end
end
