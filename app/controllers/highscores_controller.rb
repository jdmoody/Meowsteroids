class HighscoresController < ApplicationController
  def index
    @highscores = Highscore.all.sort_by { |highscore| -highscore.score }[0..9]
    render json: @highscores
  end
  
  def create
    Highscore.create(initials: params[:initials], score: params[:score])
    head :ok
  end
end