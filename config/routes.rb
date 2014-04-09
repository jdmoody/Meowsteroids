Meowsteroids::Application.routes.draw do
  root 'game#show'
  resources :highscores
end