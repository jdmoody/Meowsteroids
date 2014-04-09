class HighscoresController < ApplicationController
  def index
    @highscores = Highscore.all
    render json: @highscores
  end
end