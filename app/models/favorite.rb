class Favorite < ApplicationRecord

  belongs_to :user

  def stock
    Stock.code_index(self.code).date_desc(1).find_by(code: self.code)
  end

end
