var page = 1;

$(function() {
  $("#details-page").hide();
  $('#more-button').hide();
  $('form').submit(function(event){
    event.preventDefault();
    page = 1;
    $('#results').html('');
    // $('#more-button').show();
    searchMovies();
  });

  $('#more-button').click(function() {
    searchMovies();
  });

  $("#back").click(function(event) {
    event.preventDefault();
    $('#details-page').hide();
    $('#search-page').show();
  });

  //function to search movies using Ajax & OMDb API
  function searchMovies() {
    var userInput = $('#search').val();
    $.ajax({
      method: 'GET',
      url: 'http://www.omdbapi.com/',
      data: {
        s: userInput,
        page: page
      },
      success: function(data) {
        // page++;
        // console.log('Total Results: ', data);
        var total = Number(data.totalResults);
        if (total > page * 10) {
          $("#more-button").show();
        }
        else {
          $("#more-button").hide();
        }
        page++;
        var results = data.Search;
        for (var i = 0; i < results.length; i++) {
          var link = $("<a>")
            .data("data-imdbID", results[i].imdbID)
            .attr("href", "http://www.imdb.com/title/" + results[i].imdbID + "/")
            .addClass('result');
            if (results[i].Poster === 'N/A') {
              var img2 = $('<img>')
                .attr('src', 'not-available.jpg')
                .attr('alt', results[i].Title);
              link.append(img2);
            } else {
              var img = $('<img>')
                .attr('src', results[i].Poster)
                .attr('alt', results[i].Title);
              link.append(img);
            }
          $('#results').append(link);
        }
      }
    });
  }

  $("#search-page").on("click", ".result", function(event){
    event.preventDefault();
    $('#more-button').hide();
    var imdbID = $(this).data("data-imdbID");
    $.ajax({
      method: "GET",
      url: "http://www.omdbapi.com",
      data: {
        i: imdbID,
        plot: "full"
      },
      success: function(data){
        $("#search-page").hide();
        $("#details-page").show();
        $("#details-page .poster").attr("src", data.Poster);
        $("#details-page .title").text(data.Title);
        $("#details-page .actors").text(data.Actors);
        $("#details-page .plot").text(data.Plot);
        $("#details-page .genre").text(data.Genre);
        $("#details-page .year").text(data.Year);
        $("#details-page .director").text(data.Director);
      }
    });
  });
});
