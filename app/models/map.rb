class Map < ActiveRecord::Base

  def self.response_from_citi
    HTTParty.get("http://www.citibikenyc.com/stations/json")
  end

  def self.flatten_response
    response_from_citi.flatten(4)
  end

  def self.citi_search(selector,min)
    flatten_response.select do |station|
      station if station.is_a?(Hash) && station[selector] >= min
    end
  end

end
