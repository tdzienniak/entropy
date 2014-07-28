module.exports = (destination, sources...) ->
    for source in sources
        for own key, value of source
            destination[key] = value
    undefined