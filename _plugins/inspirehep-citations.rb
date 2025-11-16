require "active_support/all"
require 'net/http'
require 'json'
require 'uri'

module Helpers
  extend ActiveSupport::NumberHelper
end

module Jekyll
  class InspireHEPCitationsTag < Liquid::Tag
    Citations = { }

    def initialize(tag_name, params, tokens)
      super
      @recid = params.strip
    end

    def render(context)
      recid = context[@recid.strip]
      api_url = "https://inspirehep.net/api/literature/?fields=citation_count&q=recid:#{recid}"

      begin
        # If the citation count has already been fetched, return it
        if InspireHEPCitationsTag::Citations[recid]
          return InspireHEPCitationsTag::Citations[recid]
        end

        # Fetch the citation count from the API with timeout
        require 'timeout'
        uri = URI(api_url)
        response = nil
        Timeout.timeout(5) do
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = (uri.scheme == 'https')
          http.read_timeout = 5
          http.open_timeout = 5
          request = Net::HTTP::Get.new(uri)
          response = http.request(request)
        end
        
        if response.nil? || !response.is_a?(Net::HTTPSuccess)
          raise "Invalid response from API"
        end
        
        data = JSON.parse(response.body)

        # # Log the response for debugging
        # puts "API Response: #{data.inspect}"

        # Extract citation count from the JSON data
        if data && data["hits"] && data["hits"]["hits"] && data["hits"]["hits"][0] && data["hits"]["hits"][0]["metadata"]
          citation_count = data["hits"]["hits"][0]["metadata"]["citation_count"].to_i
        else
          citation_count = 0
        end

        # Format the citation count for readability
        citation_count = Helpers.number_to_human(citation_count, format: '%n%u', precision: 2, units: { thousand: 'K', million: 'M', billion: 'B' })

      rescue Timeout::Error => e
        # Handle timeout errors
        citation_count = "N/A"
        puts "Timeout fetching citation count for #{recid}: #{e.class} - #{e.message}"
      rescue Exception => e
        # Handle any other errors that may occur during fetching
        citation_count = "N/A"

        # Print the error message including the exception class and message
        puts "Error fetching citation count for #{recid}: #{e.class} - #{e.message}"
      end

      InspireHEPCitationsTag::Citations[recid] = citation_count
      return "#{citation_count}"
    end
  end
end

Liquid::Template.register_tag('inspirehep_citations', Jekyll::InspireHEPCitationsTag)
