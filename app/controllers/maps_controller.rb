class MapsController < ApplicationController

  def all_data
    min = params[:min].to_i
    citi_response = Map.citi_search(params[:searchType],min)
    render json: citi_response
  end

end
