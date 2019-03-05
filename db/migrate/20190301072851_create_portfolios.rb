class CreatePortfolios < ActiveRecord::Migration[5.2]
  def change
    create_table :portfolios do |t|

      t.references :user,foregin_key: true
      t.string :group_name
      t.timestamps
    end
  end
end
