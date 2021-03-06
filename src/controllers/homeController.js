const newsService = require( '../services/newsService' )();

module.exports = () => {
    var homeController = new Object();

    /**
     *
     *
     * @param {any} arrayParam
     * @returns
     */
    function normalizeArrayParameter( arrayParam ) {
        let origins = [];

        if ( !arrayParam ) {
            origins = [];
        } else if ( !Array.isArray( arrayParam ) ) {
            origins = [ arrayParam ];
        } else {
            origins = arrayParam;
        }

        // Remove duplicates
        return Array.from( new Set( origins ) );
    }

    homeController.getList = ( req, res, next ) => {

        const dateMin = req.query.dateMin ? new Date( req.query.dateMin ) : null;
        let dateMax = req.query.dateMax ? new Date( req.query.dateMax ) : null;
        if ( dateMax ) {
            // Get entire day
            dateMax = dateMax.setDate( dateMax.getDate() + 1 ) - 1;
        }
        const query = req.query.query;
        const origins = normalizeArrayParameter( req.query.origins );
        const pageNumber = req.query.pageNumber || 1;
        const pageSize = req.query.pageSize || 10;

        newsService.getList( dateMin, dateMax, query, origins, pageNumber, pageSize )
            .then( news => {
                return res.json( news );
            } )
            .catch( err => {
                next( err );
            } );
    };

    homeController.getSingle = ( req, res, next ) => {

        newsService.getSingle( req.params.id )
            .then( news => {
                return res.json( news );
            } )
            .catch( err => {
                next( err );
            } );
    };

    return homeController;
};
