# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  before_action :set_project, if: -> { params[:project_id].present? }
  before_action :set_metric, if: -> { params[:metric_id].present? }

  def index
    authorize(@project, :read?) if @project
    render json: @project ? @project.metrics.as_json(include: :last_report) : current_user.metrics
  end

  def show
    @metric = Metric.includes(:project, :reports).find(params[:id])
    authorize @metric.project, :read?
    render json:
             @metric.attributes.merge(
               owners: @metric.owners,
               occurrences: @metric.occurrences(params[:owner_handles]),
               chart_data: @metric.chart_data(owners: params[:owner_handles]),
             )
  end

  def destroy
    metric = Metric.find(params[:id])
    project = metric.project
    authorize(project, :destroy?)
    metric.destroy!
    redirect_to user_metrics_path(project_id: project.id), notice: 'Metric was successfully deleted.'
  end

  private

  def set_metric
    @metric = Metric.find_by(id: params[:metric_id])
  end

  def set_project
    @project = Project.includes(:metrics).find_by(id: params[:project_id])
  end
end
