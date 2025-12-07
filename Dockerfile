# Dockerfile
# Dev Dockerfile for a Rails 8 app using sqlite3

ARG RUBY_VERSION=3.2.2
FROM ruby:${RUBY_VERSION}-slim

# OS packages: compiler + sqlite + Node + basic tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libsqlite3-dev \
      sqlite3 \
      nodejs \
      curl \
      git \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# App directory
WORKDIR /rails

# Bundler / Rails environment
ENV RAILS_ENV=development \
    BUNDLE_WITHOUT="" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_BIN="/usr/local/bundle/bin" \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3 \
    PATH="/usr/local/bundle/bin:${PATH}"

# Optional: pin Bundler version to match your Gemfile.lock
ARG BUNDLER_VERSION
RUN if [ -n "$BUNDLER_VERSION" ]; then \
      gem install bundler -v "$BUNDLER_VERSION" --no-document; \
    else \
      gem install bundler --no-document; \
    fi

# Install gems (use Gemfile + Gemfile.lock for better caching)
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy the rest of the app
COPY . .

# Ensure bin scripts are executable (bin/rails, bin/dev, etc.)
RUN chmod +x bin/* || true

EXPOSE 3000

# If your app uses bin/dev (Rails 7/8 default):
# CMD ["bash", "-lc", "bin/dev"]

# If you *don’t* have bin/dev, use this instead:
CMD ["bash", "-lc", "bundle exec rails server -b 0.0.0.0 -p 3000"]
