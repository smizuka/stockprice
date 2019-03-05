class CreateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :groups do |t|

      t.string :group_name
      t.string :code
      t.references :user,foreign_key: true

      t.timestamps
    end
  end
end
