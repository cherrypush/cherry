# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_project, only: :create
  before_action :set_user, only: :create
  before_action :require_premium_status, except: %i[index]

  def index
    respond_to do |format|
      format.html
      format.json do
        json =
          Authorization
            .where(project: current_user.projects)
            .includes(:user)
            .as_json(include: { user: { only: :github_handle } })
        render json:
      end
    end
  end

  def create
    authorization = Authorization.find_or_create_by!(project: @project, user: @user)
    TelegramClient.send(
      "#{current_user.github_handle} added #{authorization.user.github_handle} to #{authorization.project.name}.",
    )
  end

  def destroy
    authorization = Authorization.find(params[:id])
    unless authorization.project.in?(current_user.owned_projects)
      return redirect_to user_authorizations_path, alert: 'You are not authorized to do this.'
    end
    authorization.destroy!
  end

  private

  def set_project
    @project = current_user.owned_projects.find(params[:project_id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end
end
