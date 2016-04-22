class MapsController < ApplicationController

  def all_data
    render json: Map.response_from_citi
  end

end
