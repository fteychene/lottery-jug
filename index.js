const Nbrite = require('nbrite');
const express = require('express');
const rp = require('request-promise');

const nbrite = new Nbrite({'token': process.env.EVENTBRITE_TOKEN});
const event_id = process.env.EVENT_ID


const range = (start, end) => {
  let pages = []
  for (var i = start ; i <= end; i++) {
     pages.push(i);
  }
  return pages
}

const getAttendees = (event_id) => {
    return nbrite.get(`/events/${event_id}/attendees`).then(attendees =>
      Promise.all(
        range(attendees.pagination.page_number +1, attendees.pagination.page_count)
          .reduce((acc, val) => acc.concat([nbrite.get(`/events/${event_id}/attendees`, { 'page': val }).then(data => data.attendees)]), attendees.attendees))
        .then(values => [].concat.apply([], values))
    )
}

const findWinnerWithTrustedRandom = (attendees, nbWinner) => {
  return (nbWinner >= attendees.length) ? attendees : rp(`https://www.random.org/integers/?num=${nbWinner}&min=0&max=${attendees.length}&col=1&base=10&format=plain&rnd=new`)
      .then(function (body) {
       console.log(body);
        return body.split("\n")
                  .filter((element)=>{return element.length > 0})
                  .map(Number)
                  .map((index)=> { return attendees[index]})
      })
    }


const app = express();


app.get('/winners', function(req, res){
  const nb_winner = req.query.nb
  if (nb_winner == undefined || isNaN(nb_winner) || nb_winner < 0) {
    res.status(400)
    res.json({error: 'Nb param should be a positive integer'})
  } else if (nb_winner == 0) {
    res.json([])
  } else {
    getAttendees(event_id)
      .then(attendees => findWinnerWithTrustedRandom(attendees, nb_winner))
      .then(winners => winners.map(({profile: {first_name: first_name, last_name: last_name}}) => { return {'Winner': `${first_name} ${last_name}`}}))
      .then(winners => res.json(winners))
    }
});

app.listen(3000);
