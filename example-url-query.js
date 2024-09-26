const url = require("url");

// const adresseUrl = 'http://example.com/page?nom=John&age=30&ville=Paris';

// const urlParse = url.parse(adresseUrl, true)

// const nom = urlParse.query.nom
// const age = urlParse.query.age
// const ville = urlParse.query.ville

// console.log('Nom : ${nom}');

const queryObject = {
  nom: "jhon",
  age: 14,
};

const adresseUrl = url.format({
  protocol: "http",
  hostname: "exemple.com",
  pathname: "/page",
  query: queryObject,
});

console.log(adresseUrl);
