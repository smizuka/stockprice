class Group < ApplicationRecord
  validates :group_name,presence: true
  belongs_to :user

  #belongs_to
  def portfolio
    Portfolio.find_by(group_name: self.group_name)
  end
end
