# == Schema Information
#
# Table name: highscores
#
#  id       :integer          not null, primary key
#  initials :string(255)
#  score    :integer
#

class Highscore < ActiveRecord::Base
  
end
