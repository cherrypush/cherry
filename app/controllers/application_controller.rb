# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit::Authorization

  helper_method :current_user

  layout 'landing'

  before_action :set_sentry_context, if: -> { current_user.present? }

  # Used to control access to blazer dashboards
  def require_admin
    return if current_user&.admin?
    redirect_to '/'
  end

  private

  def current_user
    @current_user ||=
      begin
        user = User.find_by(id: session[:user_id]) if session[:user_id]
        # reset_session if user.nil? # clear session if the user is not found
        user
      end
  end

  def set_sentry_context
    Sentry.set_user(id: current_user&.id, email: current_user&.email, username: current_user&.github_handle)
  end
end
