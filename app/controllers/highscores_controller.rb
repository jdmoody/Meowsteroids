class HighscoresController < ApplicationController
  def index
    @highscores = Highscore.all
    render json: @highscores
  end
  
  def create
    Highscore.create(initials: params[:initials], score: params[:score])
    head :ok
  end
end