import NodeSearch from './NodeSearch';
import LinkSearch from './LinkSearch';

class SearchFactory {
    constructor() {

    }

    createSearch(dirIndex, type) {
        let search = null;
        switch (type) {
            case 'TRACKPOINT':
                search = new NodeSearch(dirIndex, type);
                break;
            case 'TRACKLINK':
                search = new LinkSearch(dirIndex, type);
        }

        return search;
    }
}

export default SearchFactory;