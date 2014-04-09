class CreateHighscores < ActiveRecord::Migration
  def change
    create_table :highscores do |t|
      t.string :initials
      t.integer :score
    end
  end
end
