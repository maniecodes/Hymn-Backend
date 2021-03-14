const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    
    type Song {
        _id: ID!
        number: Int!
        title: String!
        description: String!
        pdfUrl: String!
        mp3Url: String!
        hymnId: Hymn!
        createdAt: String!
        updatedAt: String!
    }

    type Hymn {
        _id: ID!
        title: String!
        description: String!
        imageUrl: String
        createdAt: String!
        updatedAt: String!
    }

    type Verse {
        _id: ID!
        wording: String!
        song: Song!
    }

    type HymnData {
        hymns: [Hymn!]!
        totalHymns: Int!
    }

    type SongData {
        songs: [Song!]!
        totalSongs: Int!
    }

    type VerseData {
        verses: [Verse!]!
        totalVerses: Int!
    }

    input HymnInputData {
        title: String!
        description: String!
        imageUrl: String
    }

    input SongInputData {
        number: Int!
        title: String!
        description: String!
        pdfUrl: String
        mp3Url: String
        hymnId: ID!
    }

    input VerseInputData {
        wording: String!
    }

    type RootQuery {
        hymn(id: ID!): Hymn!
        song(id: ID!): Song!
        verse(id: ID!): Verse!
        hymns(page: Int): HymnData!
    }

    type RootMutation {
        createHymn(hymnInput: HymnInputData): Hymn!
        createSong( songInput: SongInputData): Song!
        createVerse(verseInput: VerseInputData): Verse!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
