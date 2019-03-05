class Portfolio < ApplicationRecord

  belongs_to :user

  def groups
    Group.where(group_name: self.group_name)
  end
end
