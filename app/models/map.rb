class Map < ActiveRecord::Base

  def self.response_from_citi
    HTTParty.get("http://www.citibikenyc.com/stations/json")
  end

end
