class AuthorsController < ApplicationController
  before_action :set_author, only: [ :edit, :update, :destroy ]

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

  def bulk_new
    @author_count = params[:count]&.to_i || 10
  end

  def bulk_create
    authors_params = params[:authors]&.values || []
    created_authors = []
    skipped_authors = []
    failed_authors = []

    authors_params.each_with_index do |author_data, index|
      next if author_data[:name].blank?

      # Check if author already exists (case-insensitive)
      existing_author = Author.find_by("LOWER(name) = ?", author_data[:name].downcase)
      if existing_author
        skipped_authors << { index: index + 1, name: author_data[:name] }
        next
      end

      author = Author.new(author_data.permit(:name, :nationality, :gender))
      if author.save
        created_authors << author
      else
        failed_authors << { index: index + 1, errors: author.errors.full_messages }
      end
    end

    # Build success/warning message
    messages = []
    messages << "Successfully created #{created_authors.count} author(s)." if created_authors.any?
    messages << "Skipped #{skipped_authors.count} author(s) that already exist." if skipped_authors.any?

    if failed_authors.any?
      @failed_authors = failed_authors
      @author_count = authors_params.count
      flash.now[:alert] = "#{failed_authors.count} author(s) could not be created."
      flash.now[:notice] = messages.join(" ") if messages.any?
      render :bulk_new, status: :unprocessable_entity
    else
      redirect_to authors_path, notice: messages.join(" ")
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
