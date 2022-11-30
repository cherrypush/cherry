# frozen_string_literal: true

Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout

  namespace :api do
    resources :occurrences, only: :create
  end

  # namespace dedicated to user authenticated routes
  namespace :user do
    resources :projects, only: %i[index new create destroy]
    resource :settings, only: :show
  end

  resources :projects, only: %i[index show]

  get :pricing, to: 'pages#pricing'
  get :privacy, to: 'pages#privacy'
  get :terms, to: 'pages#terms'

  root 'pages#home'
end
