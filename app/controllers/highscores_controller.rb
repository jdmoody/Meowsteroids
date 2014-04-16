class HighscoresController < ApplicationController
  def index
    @highscores = Highscore.all.sort_by { |highscore| -highscore.score }[0..9]
    until @highscores.length == 10
      @highscores << Highscore.new(initials: "", score: 0)
    end
    render json: @highscores
  end
  
  def create
    Highscore.create(initials: params[:initials], score: params[:score])
    head :ok
  end
end