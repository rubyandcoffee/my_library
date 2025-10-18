Rails.application.routes.draw do
  get "leaderboard", to: "leaderboard#index"
  get "reading_goals", to: "books#reading_goals"
  resources :books do
    member do
      get :duplicate
    end
    collection do
      get :bulk_new
      post :bulk_create
    end
  end
  resources :authors
  resources :series
  resources :genres

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "books#index"
end
