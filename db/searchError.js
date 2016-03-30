function SearchError(message, date, searchedName){
    this.name='SearchError';
    this.message= message || 'Some Failure happened while searching for a SentimentAnalyses';
    this.stack= (new Error()).stack;
    this.date= date;
    this.searchedName= searchedName;
}

SearchError.prototype = Object.create(Error.prototype);
SearchError.prototype.constructor = SearchError;

module.exports = SeachError;