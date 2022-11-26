# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resources :occurrences, only: :create
  end

  resources :occurrences, only: %i[index]

  root 'pages#home'
end
