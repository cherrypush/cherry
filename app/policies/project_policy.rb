# frozen_string_literal: true

# TODO: remove this policy and purely rely on the OrganizationPolicy
# This policy is used by user/metrics#index, user/dashboards#show, and user/dashboards#create
# We should first change the FK from dashboards to organizations, instead of projects, then remove this policy
class ProjectPolicy < ApplicationPolicy
  def read?
    return true if user.admin?
    return true if record.name == "cherrypush/cherry"
    return true if record.user == user
    return true if user.organizations.include?(record.organization)
    false
  end

  def destroy?
    return true if user.admin?
    record.user == user
  end
end
