// api/policies/hasLinkObjectAdmin.js

/**
 * Policy to check if user has admin access to specified link object or not. Actual check is
 * simple:
 *
 *  - Fetch link object, compare createdUserId in data to current user
 *
 * Note that this policy relies that following parameter is present
 *
 *  - id
 *
 * Also note that users who are administrators has admin access to comment.
 *
 * @param   {Request}   request     Request object
 * @param   {Response}  response    Response object
 * @param   {Function}  next        Callback function to call if all is ok
 */
module.exports = function hasLinkObjectAdmin(request, response, next) {
    sails.log.verbose(" POLICY - api/policies/hasLinkObjectAdmin.js");

    var linkId = parseInt(request.param("id"), 10);

    DataService.getLink(linkId, function(error, comment) {
        if (error) {
            return ErrorService.makeErrorResponse(error.status ? error.status : 500, error.message ? error.message : error, request, response);
        } else if (request.user.id === comment.createdUserId || request.user.admin) {
            sails.log.verbose("          OK");

            return next();
        } else {
            return ErrorService.makeErrorResponse(403, "Insufficient rights to this link", request, response);
        }
    });
};