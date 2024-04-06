# frozen_string_literal: true

require 'application_system_test_case'

class AdminTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'John Doe', email: 'john@example.com') }

  it 'blocks non authenticated users' do
    assert_raises(ActionController::RoutingError) do
      visit '/blazer'
      assert_current_path '/'
    end
  end

  it 'block non admin users' do
    assert_raises(ActionController::RoutingError) do
      sign_in(user, to: '/blazer')
      assert_current_path '/user/projects'
    end
  end

  it 'allows admin users' do
    User.stub_const(:ADMIN_EMAILS, ['john@example.com']) do
      sign_in(user, to: '/blazer')
      assert_current_path '/blazer'
      assert_text 'New Query'
    end
  end
end
