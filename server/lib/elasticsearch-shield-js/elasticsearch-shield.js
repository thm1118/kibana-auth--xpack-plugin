(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ElasticsearchShield = factory();
  }
}(this, function () {
  return function addShieldApi(Client, config, components) {
    var ca = components.clientAction.factory;

    Client.prototype.shield = components.clientAction.namespaceFactory();
    var shield = Client.prototype.shield.prototype;

    /**
     * Perform a [shield.authenticate](Retrieve details about the currently authenticated user) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     */
    shield.authenticate = ca({
      params: {},
      url: {
        fmt: '/security/_authenticate'
      }
    });

    /**
     * Perform a [shield.changePassword](Change the password of a user) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {Boolean} params.refresh - Refresh the index after performing the operation
     * @param {String} params.username - The username of the user to change the password for
     */
    shield.changePassword = ca({
      params: {
        refresh: {
          type: 'boolean'
        }
      },
      urls: [
        {
          fmt: '/security/user/<%=username%>/_password',
          req: {
            username: {
              type: 'string',
              required: false
            }
          }
        },
        {
          fmt: '/security/user/_password'
        }
      ],
      needBody: true,
      method: 'POST'
    });

    /**
     * Perform a [shield.clearCachedRealms](Clears the internal user caches for specified realms) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {String} params.usernames - Comma-separated list of usernames to clear from the cache
     * @param {String} params.realms - Comma-separated list of realms to clear
     */
    shield.clearCachedRealms = ca({
      params: {
        usernames: {
          type: 'string',
          required: false
        }
      },
      url: {
        fmt: '/security/realm/<%=realms%>/_clear_cache',
        req: {
          realms: {
            type: 'string',
            required: true
          }
        }
      },
      method: 'POST'
    });

    /**
     * Perform a [shield.clearCachedRoles](Clears the internal caches for specified roles) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {String} params.name - Role name
     */
    shield.clearCachedRoles = ca({
      params: {},
      url: {
        fmt: '/security/role/<%=name%>/_clear_cache',
        req: {
          name: {
            type: 'string',
            required: true
          }
        }
      },
      method: 'POST'
    });

    /**
     * Perform a [shield.deleteRole](Remove a role from the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {Boolean} params.refresh - Refresh the index after performing the operation
     * @param {String} params.name - Role name
     */
    shield.deleteRole = ca({
      params: {
        refresh: {
          type: 'boolean'
        }
      },
      url: {
        fmt: '/security/role/<%=name%>',
        req: {
          name: {
            type: 'string',
            required: true
          }
        }
      },
      method: 'DELETE'
    });

    /**
     * Perform a [shield.deleteUser](Remove a user from the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {Boolean} params.refresh - Refresh the index after performing the operation
     * @param {String} params.username - username
     */
    shield.deleteUser = ca({
      params: {
        refresh: {
          type: 'boolean'
        }
      },
      url: {
        fmt: '/security/user/<%=username%>',
        req: {
          username: {
            type: 'string',
            required: true
          }
        }
      },
      method: 'DELETE'
    });

    /**
     * Perform a [shield.getRole](Retrieve one or more roles from the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {String} params.name - Role name
     */
    shield.getRole = ca({
      params: {},
      urls: [
        {
          fmt: '/security/role/<%=name%>',
          req: {
            name: {
              type: 'string',
              required: false
            }
          }
        },
        {
          fmt: '/security/role'
        }
      ]
    });

    /**
     * Perform a [shield.getUser](Retrieve one or more users from the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {String, String[], Boolean} params.username - A comma-separated list of usernames
     */
    shield.getUser = ca({
      params: {},
      urls: [
        {
          fmt: '/security/user/<%=username%>',
          req: {
            username: {
              type: 'list',
              required: false
            }
          }
        },
        {
          fmt: '/security/user'
        }
      ]
    });

    /**
     * Perform a [shield.putRole](Update or create a role for the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {Boolean} params.refresh - Refresh the index after performing the operation
     * @param {String} params.name - Role name
     */
    shield.putRole = ca({
      params: {
        refresh: {
          type: 'boolean'
        }
      },
      url: {
        fmt: '/security/role/<%=name%>',
        req: {
          name: {
            type: 'string',
            required: true
          }
        }
      },
      needBody: true,
      method: 'PUT'
    });

    /**
     * Perform a [shield.putUser](Update or create a user for the native shield realm) request
     *
     * @param {Object} params - An object with parameters used to carry out this action
     * @param {Boolean} params.refresh - Refresh the index after performing the operation
     * @param {String} params.username - The username of the User
     */
    shield.putUser = ca({
      params: {
        refresh: {
          type: 'boolean'
        }
      },
      url: {
        fmt: '/security/user/<%=username%>',
        req: {
          username: {
            type: 'string',
            required: true
          }
        }
      },
      needBody: true,
      method: 'PUT'
    });

  };
}));
