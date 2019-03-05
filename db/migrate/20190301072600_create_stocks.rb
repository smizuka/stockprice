class CreateStocks < ActiveRecord::Migration[5.2]
  def change
    create_table :stocks do |t|

      t.integer :code
      t.string :name
      t.string :date
      t.integer :volume
      t.integer :adjust

      t.timestamps
    end
  end
end
