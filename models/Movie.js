const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic');
const MovieSchema = new Schema({
    title: { type : String, es_indexed: true},
    release_date: { type : Date, es_indexed: true},
    runtime: { type : Number, es_indexed: true},
    summary: { type : String, es_indexed: true},
    imdb_rating:  { type : Number, es_indexed: true},
    actors: [ { type : String, es_indexed: true}]
});
MovieSchema.plugin(mongoosastic);
const Movie = mongoose.model('Movie', MovieSchema);

Movie.createMapping({
    analysis:{
        filter: {
            ngram_filter : {
                type: 'nGram',
                min_gram : 3,
                max_gram : 10,
            },
            token_chars:[
                'letter', 'digit', 'symbol', 'punctuation'
            ]
        }
    },
    analyzer : {
        ngram_analyzer : {
            type:'custom',
            tokenizer:'whitespace',
            filter : [
                'lowercase',
                'asciifolding',
                'ngram_filter'
            ]
        },
        keyword_analyzer : {
            tokenizer : 'keyword',
            filter : [
                'lowercase',
                'asciifolding'
            ]
        }
    }
},
    (err, mapping) => {
    if(err) {
        return console.log(err);
    }
    console.log(mapping);
    });




const stream = Movie.synchronize();
let count = 0;

stream.on('data', (err, doc) => count++);
stream.on('close', () => console.log(`Indexed ${count} documents`));
stream.on('error', err => console.log(err));
module.exports = Movie;